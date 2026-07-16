<script>
    import * as THREE from 'three';
	  import { onMount } from 'svelte';
    import MaskedText from './MaskedText.svelte';

    /**
	 * @type {HTMLDivElement}
	 */
    let container;

     /**
	 * @type {HTMLDivElement}
	 */
    let canvas;

    const mouse = new THREE.Vector2(0.5, 0.5);
    const smoothMouse = new THREE.Vector2(0.5, 0.5);
    let animationId;

    // Data-URL eines periodischen Canvas-Snapshots, den MaskedText für die
    // Text-Maskierung nutzt (die sichtbare Canvas selbst bleibt unverändert live)
    let noiseSnapshot = '';
    const snapshotInterval = 120;

    
    
      // Scene setup
      onMount(()=>{
        const parent = canvas;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
          -w / 2,  // left
          w / 2,  // right
          h / 2,  // top
          -h / 2,  // bottom
          0.1,    // near
          10      // far
        );

        camera.position.z = 1;
        const renderer = new THREE.WebGLRenderer({ preserveDrawingBuffer: true });
        // Pixel size control
        const pixelSize = 80.0;

        renderer.setClearColor(0x000000, 0); // transparent statt deckend dunkelgrau
        canvas.appendChild(renderer.domElement);   

        

        function onMouseMove(event) {
          const rect = canvas.getBoundingClientRect();
          mouse.x = (event.clientX - rect.left) / rect.width;
          mouse.y = 1.0 - (event.clientY - rect.top) / rect.height;
        }
        window.addEventListener('mousemove', onMouseMove);
        
      // Shader material
        const material = new THREE.ShaderMaterial({
        uniforms: {
        uTime: { value: 0.0 },
        uScale: { value: 1.0 },
        uSpeed: { value: 0.01},
        uThreshold: { value: 0.6 },
        uThreshold2: { value: 0.01 },
        uMouse: { value: new THREE.Vector2(0.5, 0.5) },
        //uColor2: { value: new THREE.Color(0x00aaff) },
        uColor2: { value: new THREE.Color(0x0442BF)},
        uColor: { value: new THREE.Color(0xffffff)},
        uPixelSize: { value: pixelSize },
        uResolution: { value: new THREE.Vector2(w, h)}
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uScale;
            uniform float uSpeed;
            uniform float uTime;
            uniform float uThreshold;
            uniform float uThreshold2;
            uniform vec3 uColor;
            uniform vec3 uColor2;
            uniform float uPixelSize;
            uniform vec2 uMouse;
            uniform vec2 uResolution;

            // Simple Perlin noise (GLSL)
            vec2 hash(vec2 p) {
              p = vec2(dot(p, vec2(127.1,311.7)),
                      dot(p, vec2(269.5,183.3)));
              return -1.0 + 2.0*fract(sin(p)*43758.5453123);
            }

            float noise(in vec2 p) {
              const float K1 = 0.366025404; // (sqrt(3)-1)/2
              const float K2 = 0.211324865; // (3-sqrt(3))/6
              vec2 i = floor(p + (p.x + p.y) * K1);
              vec2 a = p - i + (i.x + i.y) * K2;
              vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
              vec2 b = a - o + K2;
              vec2 c = a - 1.0 + 2.0 * K2;
              vec3 h = max(0.5 - vec3(dot(a,a), dot(b,b), dot(c,c)), 0.0);
              vec3 n = h*h*h*h*vec3(dot(a, hash(i + 0.0)), dot(b, hash(i + o)), dot(c, hash(i + 1.0)));
              return dot(n, vec3(70.0));
            }

            void main() {
            float aspect = uResolution.x / uResolution.y;
            vec2 uv = vUv;
            uv.x *= aspect;
            // Pixelation effectq
            vec2 pixelUV = floor(uv * uPixelSize) / uPixelSize;
            
            //float n = noise(vUv * 4.0 + uTime * 0.1);
            vec2 mouse = uMouse;
            mouse.x *= aspect;
            vec2  delta     = pixelUV - mouse;
            float dist      = length(delta);
            float radius    = 0.4;
            float strength  = 0.2;
            float influence = smoothstep(radius, 0.0, dist);
            vec2  displaced = pixelUV - normalize(delta) * influence * strength;

            float n = noise(displaced * 4.0 + uTime * 0.1);

            // Threshold
            vec3 color = vec3(1.0);
            if(n < uThreshold && n > uThreshold2) color = uColor2;
            else if (n > uThreshold) color = uColor;
            gl_FragColor = vec4(pow(color, vec3(1.0/2.2)),1.0);
            }
        `
        });

        // Fullscreen quad
        const geometry = new THREE.PlaneGeometry(1, 1);
        //const material = new THREE.ShaderMaterial(noiseShader)
        
        const plane = new THREE.Mesh(geometry, material);
        scene.add(plane);

        // Animation loop
        const observer = new ResizeObserver(resize);
        observer.observe(parent);
        resize();

        function resize(){
          const w = parent.clientWidth;
          const h = parent.clientHeight;
          renderer.setSize(w, h);
          renderer.setPixelRatio(window.devicePixelRatio);

          camera.left = -w / 2;
          camera.right = w / 2;
          camera.top = h / 2;
          camera.bottom = -h / 2;
          camera.updateProjectionMatrix();

          plane.scale.set(w, h, 1);
          material.uniforms.uResolution.value.set(w, h);
        }
        
        let lastSnapshotTime = 0;
        function animate(time) {
          animationId = requestAnimationFrame(animate);
          
          //material.uniforms.uThreshold.value += time * 0.000001;
          //material.uniforms.uThreshold.value = (material.uniforms.uThreshold.value + time * 0.00000001) % 1;
          //material.uniforms.uThreshold2.value = (material.uniforms.uThreshold2.value + time * 0.00000001) % 1;

          material.uniforms.uTime.value = time * 0.001;
          smoothMouse.lerp(mouse, 0.08);
          //console.log(mouse);
          material.uniforms.uMouse.value.set(mouse.x, mouse.y);
          //material.uniforms.uTime.value = time * 0.0005;
          renderer.render(scene, camera);
          //requestAnimationFrame(animate);

          if (time - lastSnapshotTime >= snapshotInterval) {
            lastSnapshotTime = time;
            noiseSnapshot = renderer.domElement.toDataURL('image/png');
          }
        }

        animate(0);

        return () => {
          observer.disconnect();
          window.removeEventListener('mousemove', onMouseMove);
          if (animationId) cancelAnimationFrame(animationId);
        }
      });


</script>
<div class="my-24 relative">

  <div bind:this={container} class="h-[480px] relative overflow-visible w-full lg:max-w-6xl mx-auto">
    <div bind:this={canvas} class="overflow-hidden absolute h-full -left-[20%] w-[140%] -z-10 flex justify-center">
    </div>

    <div class="w-full max-w-6xl flex flex-col relative h-full mx-auto px-6 lg:px-0">
        <MaskedText
            snapshot={noiseSnapshot}
            bgElement={canvas}
            wrapperClass="absolute top-[50%] -translate-y-1/2 right-0 text-right p-6"
            let:colorClass
        >
            <h2 class="mb-4 {colorClass}">User centered Design</h2>
            <h3 class="mb-4 {colorClass}">Was mich antreibt</h3>
            <p class="mt-4 {colorClass}">Neugier, gutes Design und der Drang, Dinge<br>zu bauen, die es so noch nicht gibt.</p>
        </MaskedText>
    </div>
  </div>
</div>