<script>
    import { onMount } from 'svelte';
    import * as THREE from 'three';

    /** @type {HTMLDivElement} */
    let container;

    // Ruft bei jedem Snapshot mit der aktuellen Canvas als Data-URL auf
    export let onSnapshot = () => {};
    // Wie oft (in ms) ein neuer Snapshot gezogen wird
    export let snapshotInterval = 120;

    // --- Konfiguration der Welle ---
    const WAVE_COLOR = '#0442bf';
    const WAVE_HEIGHT = 0.4;
    const SEGMENTS_PER_UNIT = 25; // Vertex-Dichte pro Welteinheit (Breite bleibt so immer gleich scharf)
    const NUM_WAVES = 5;
    const WAVE_SPACING = 1.1;
    const CAMERA_FOV = 75;
    const CAMERA_Z = 2.0;

    onMount(() => {
        // ---------- Grundgerüst: Scene, Kamera, Renderer ----------
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            CAMERA_FOV,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = CAMERA_Z;

        const renderer = new THREE.WebGLRenderer({ alpha: true, preserveDrawingBuffer: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setClearColor(0xffffff, 1); // opakes Weiß statt Transparenz —
        // nötig, damit luminanzbasiertes CSS-Masking (siehe stage.svelte) den
        // "leeren" Bereich als echtes Weiß erkennt statt als Transparent/Schwarz
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.NoToneMapping;
        container.appendChild(renderer.domElement);

        // Die Canvas selbst bleibt unsichtbar — sichtbar ist stattdessen das
        // periodisch aktualisierte Snapshot-Bild (siehe animate()), gegen das
        // sich mix-blend-mode/CSS-Masken zuverlässig anwenden lässt (im
        // Gegensatz zur Live-Canvas, die dafür browserübergreifend inkonsistent ist)
        renderer.domElement.style.opacity = '0';

        // Berechnet die sichtbare Breite bei z=0 (wo die Wellen liegen) für die aktuelle Kamera
        function getVisibleWidthAtZ0() {
            const vFov = (camera.fov * Math.PI) / 180;
            const visibleHeight = 2 * Math.tan(vFov / 2) * CAMERA_Z;
            return visibleHeight * camera.aspect;
        }

        // ---------- Material & Shader ----------
        const color = new THREE.Color();
        color.setStyle(WAVE_COLOR, THREE.SRGBColorSpace);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: 0 },
                u_amplitude: { value: 0.5 },
                u_wavelength: { value: 2.0 },
                u_speed: { value: 0.1 },
                u_color: { value: color },
                u_pixelSteps: { value: 12.2 },
                u_pixelStepsX: { value: 25.0 },
                u_noiseScale: { value: 0.6 },
                u_noiseStrength: { value: 0.08 },
                u_noiseSpeed: { value: 0.15 }
            },
            vertexShader: /* glsl */ `
                uniform float u_time;
                uniform float u_amplitude;
                uniform float u_wavelength;
                uniform float u_speed;
                uniform float u_pixelSteps;
                uniform float u_pixelStepsX;
                uniform float u_noiseScale;
                uniform float u_noiseStrength;
                uniform float u_noiseSpeed;

                vec2 hash(vec2 p) {
                    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
                    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
                }

                float noise(in vec2 p) {
                    const float K1 = 0.366025404;
                    const float K2 = 0.211324865;
                    vec2 i = floor(p + (p.x + p.y) * K1);
                    vec2 a = p - i + (i.x + i.y) * K2;
                    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
                    vec2 b = a - o + K2;
                    vec2 c = a - 1.0 + 2.0 * K2;
                    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
                    vec3 n = h * h * h * h * vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
                    return dot(n, vec3(70.0));
                }

                void main() {
                    vec3 pos = position;
                    float snappedX = floor(pos.x * u_pixelStepsX) / u_pixelStepsX;
                    float seed = modelMatrix[3].y * 13.7;
                    float n = noise(vec2(snappedX * u_noiseScale + seed, u_time * u_noiseSpeed + seed));
                    float yVal = sin(snappedX * u_wavelength + u_time * u_speed) * u_amplitude;
                    pos.y += floor((yVal + n * u_noiseStrength) * u_pixelSteps) / u_pixelSteps;
                    pos.x = snappedX;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: /* glsl */ `
                uniform vec3 u_color;
                void main() {
                    gl_FragColor = vec4(pow(u_color, vec3(1.0 / 2.2)), 1.0);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        });
        material.toneMapped = false;

        // ---------- Geometrie & Wellen-Klone ----------
        function createWaveGeometry(width) {
            const segments = Math.max(2, Math.round(width * SEGMENTS_PER_UNIT));
            return new THREE.PlaneGeometry(width, WAVE_HEIGHT, segments, 2);
        }

        let planeWidth = getVisibleWidthAtZ0();
        let geometry = createWaveGeometry(planeWidth);

        const waveTemplate = new THREE.Mesh(geometry, material);
        const waveMeshes = [];

        for (let i = 0; i < NUM_WAVES; i++) {
            const clone = waveTemplate.clone();
            clone.position.y = (i - Math.floor(NUM_WAVES / 2)) * WAVE_SPACING;
            scene.add(clone);
            waveMeshes.push(clone);
        }

        // ---------- Resize ----------
        function handleResize() {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);

            planeWidth = getVisibleWidthAtZ0();
            const newGeometry = createWaveGeometry(planeWidth);
            geometry.dispose();
            geometry = newGeometry;
            waveMeshes.forEach((mesh) => {
                mesh.geometry = geometry;
            });
        }

        const resizeObserver = new ResizeObserver(() => handleResize());
        resizeObserver.observe(container);

        // ---------- Animation & periodischer Snapshot ----------
        let animationId;
        let lastSnapshotTime = 0;

        function animate(time) {
            animationId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
            material.uniforms.u_time.value = -time * 0.001;

            if (time - lastSnapshotTime >= snapshotInterval) {
                lastSnapshotTime = time;
                onSnapshot(renderer.domElement.toDataURL('image/png'));
            }
        }
        animate(0);

        // ---------- Cleanup ----------
        return () => {
            resizeObserver.disconnect();
            cancelAnimationFrame(animationId);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            if (renderer.domElement.parentElement === container) {
                container.removeChild(renderer.domElement);
            }
        };
    });
</script>

<div bind:this={container} class="overflow-hidden absolute h-full -left-[20%] w-[140%] -z-10"></div>