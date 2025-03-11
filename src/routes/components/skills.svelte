

<div class="grid grid-cols-5 gap-4 m-24 relative">
    
    <div class="h-[480px] col-span-3">
        <canvas id="pcAnim" class="absolute top-[50%] -translate-y-1/2 w-[100%] h-[120%]">

        </canvas>
    </div>
    <div class="col-span-2">
        <!--info-->
        <div class="absolute top-[50%] -translate-y-1/2">
            <h2 class="leading-7">Skills for your project </h2>
        
            <p class="mt-8"> Wo liegen meine Skills und was für Projekte kann ich mit welchen Technologien umsetzen
            </p>
            <div class="flex gap-3  mt-8">
                <IconButton icon="coffee"/>
            </div>
        </div>
    </div>
</div>

<script>
    import IconButton from './IconButton.svelte';
	import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    
    let rotationSpeed = 0.0005;
    onMount(() => {
        const scene = new THREE.Scene();
        const canvas = document.querySelector('#pcAnim');
        const loader = new GLTFLoader();
        let w = canvas ? canvas.clientWidth : 400;
        let h = canvas ? canvas.clientHeight : 400;
        const light = new THREE.AmbientLight( 0xffffff, 3); // soft white light
        const dirlight = new THREE.DirectionalLight(0xffffff, 3);
        scene.add(dirlight);
        scene.add( light );

        const camera = new THREE.PerspectiveCamera( 75,  w / h, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#pcAnim'), alpha: true
        });
        renderer.setSize( w, h );
    
        let pivot = new THREE.Object3D();
        pivot.position.set(-1,1,6);
        scene.add(pivot);

        loader.load("/assets/wireframepc.glb", (gltf) => {
            const model = gltf.scene;
            model.rotateY(5);
            model.position.set(-3, 0, 0); // Center the model
            pivot.add(model);
            
            renderer.render(scene, camera);
        }, undefined, (error) => {
            console.error("Error loading model:", error);
        });
        loader.load("/assets/wireframewindowv4.glb", (gltf) => {
            const model = gltf.scene;
            model.rotateY(4.8);
            model.position.set(3, 0, -10); // Center the model
            model.scale.set(2,2,2);
            pivot.add(model);
            
            renderer.render(scene, camera);
        }, undefined, (error) => {
            console.error("Error loading model:", error);
        });

        window.addEventListener("wheel", (event) => {
            pivot.rotation.y += event.deltaY * rotationSpeed; // Rotate around Y-axis
        });
        
        camera.position.z = 20;
        camera.position.x = 3;
        camera.position.y = 4.5;
        
        renderer.render(scene, camera);
        function animate() {
        requestAnimationFrame(animate);
            renderer.render(scene, camera);
        }
        animate();
        
       /* return () => {
            document.body.removeChild(renderer.domElement);
        };*/
    });
    
</script>