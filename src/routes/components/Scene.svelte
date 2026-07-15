<script>
	import { onMount } from 'svelte';

    //import { useTask, T } from '@threlte/core';
    import * as THREE from 'three';
    

     /**
	 * @type {HTMLDivElement}
	 */
    let container;
     
    /**
	 * @type {HTMLCanvasElement}
	 */
    let textCanvas;
    
    /**
	 * @type {HTMLElement}
	 */
    export let textoverlay;

    async function setTempCanvas(c) {
      c = await html2canvas(textoverlay);
    }
    onMount(()=>{
      let width = container.clientWidth;
      let height = container.clientHeight;


      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 10);
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(width, height);
      renderer.setClearAlpha(0.0);
      
      container.appendChild(renderer.domElement);
      camera.position.z = 2.0;
      //camera.rotateZ(3*Math.PI/4);

      function getVisibleWidthAtZ0() {
        const distance = camera.position.z;
        const vFov = camera.fov * Math.PI / 180;
        const visibleHeight = 2 * Math.tan(vFov / 2) * distance;
        return visibleHeight * camera.aspect;
      }
      
      let phase = 0;
      let speed = 0.2;
      const color = new THREE.Color();
      color.setStyle('#0442bf', THREE.SRGBColorSpace);
      
      
      // Segmente pro Welteinheit
      const segmentsPerUnit = 25;

      let planeWidth = getVisibleWidthAtZ0();
      let geometry = new THREE.PlaneGeometry(planeWidth, 0.4, Math.max(2, Math.round(planeWidth * segmentsPerUnit)), 2);

      // ShaderMaterial — animate sine wave in the vertex shader
      const material = new THREE.ShaderMaterial({
        uniforms: {
          u_time: { value: 0 },
          u_amplitude: { value: 0.4 },
          u_wavelength: { value: 2.0 },
          u_speed: { value: 0.1 },
          u_color: { value: color},
          u_pixelSteps: { value: 14.2 }, // pixelation intensity
          u_pixelStepsX: { value: 22.2 }, // pixelation intensity (X-Achse, neu)
          u_noiseScale: { value: 0.6 },   // Frequenz der Verzerrung
          u_noiseStrength: { value: 0.1 }, // Stärke der Verzerrung (leicht)
          u_noiseSpeed: { value: 0.25 },  // wie schnell sich die Verzerrung verändert
        },
        vertexShader: /* glsl */`
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
            p = vec2(dot(p, vec2(127.1,311.7)), dot(p, vec2(269.5,183.3)));
            return -1.0 + 2.0*fract(sin(p)*43758.5453123);
          }

          float noise(in vec2 p) {
            const float K1 = 0.366025404;
            const float K2 = 0.211324865;
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
            vec3 pos = position;
            //X-Achse rastern (analog zu Noise's floor(uv * uPixelSize)/uPixelSize)
            float snappedX = floor(pos.x * u_pixelStepsX) / u_pixelStepsX;
            
               // eigener "Seed" pro Welle, da alle Klone dasselbe Material/Uniforms teilen
               // -> modelMatrix[3].y ist der vertikale Versatz jeder einzelnen Welle
               float seed = modelMatrix[3].y * 13.7;
            
               // leichtes, sich langsam veränderndes Rauschen entlang der Welle
               float n = noise(vec2(snappedX * u_noiseScale + seed, u_time * u_noiseSpeed + seed));
            
               // Animate Y position using a sine function
               float yVal = sin(snappedX * u_wavelength + u_time * u_speed) * u_amplitude;
            
               // Rauschen addiert leichte Unregelmäßigkeit, bevor pixelig quantisiert wird
               pos.y += floor((yVal + n * u_noiseStrength) * u_pixelSteps) / u_pixelSteps;
               pos.x = snappedX;         
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: /* glsl */`
          uniform vec3 u_color;
          void main() {
            gl_FragColor = vec4(pow(u_color, vec3(1.0/2.2)),1.0);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
      });
      const wave = new THREE.Mesh(geometry, material);
      //scene.add(wave);
      const waveMeshes = [wave];

      // Resize handler
      function handleResize() {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        planeWidth = getVisibleWidthAtZ0();
        const newGeometry = new THREE.PlaneGeometry(
          planeWidth, 0.4, Math.max(2, Math.round(planeWidth * segmentsPerUnit)), 2);
        geometry.dispose();
        geometry = newGeometry;
        waveMeshes.forEach((m) => { m.geometry = geometry; });
      }
      window.addEventListener("resize", handleResize);

      const numWaves = 5;
      const waveSpacing = 1.0;
      for (let i = 0; i < numWaves; i++) {
        const clone = wave.clone();
        clone.position.y = (i - Math.floor(numWaves / 2)) * waveSpacing; // stack around center
        scene.add(clone);
      }

      // Animation loop
      let animationId;
      function animate(time) {
        animationId = requestAnimationFrame(animate);
        //requestAnimationFrame(animate);
        
        renderer.render(scene, camera);
        material.uniforms.u_time.value = -time * 0.001;
      }

      animate(0);

      return () => {
        window.removeEventListener("resize", handleResize);
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


  <div bind:this={container} class="overflow-hidden absolute h-full -left-[20%] w-[140%] -z-10">
  <!-- <canvas bind:this={textCanvasi} class="absolute mix-blend-lighter"></canvas>-->

  </div>
         <!--  <p class="absolute mix-blend-difference !text-[#d9c395]">fgjfdgjfdkgjfkdlgjkldfjk</p>-->

