

<div class="grid grid-cols-5 gap-4 m-24 relative">
    
    <div class="h-[480px] col-span-3">
        <canvas id="pcAnim">

        </canvas>
    </div>
    <div class="col-span-2">
        <!--info-->
        <div class="absolute top-[50%] -translate-y-1/2">
            <h2 class="leading-7">Skills for your project </h2>
        
            <p class="mt-8"> Wo liegen meine Skills und was für Projekte kann ich mit welchen Technologien umsetzen
            </p>
            
        </div>
    </div>
</div>

<script>
	import { onMount } from 'svelte';
    import * as THREE from 'three';
    import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    
    onMount(() => {
        const scene = new THREE.Scene();
    
        const loader = new GLTFLoader();
    

        loader.load("/assets/pcmodel.glb", (gltf) => {
            const model = gltf.scene;
            model.traverse((child) => {
                if(child.isMesh){
                    const geometry = child.geometry;
                    console.log(geometry);
                    const material = new THREE.MeshBasicMaterial({ color: 0x0000ff, wireframe: true });

                    // Create a mesh with the geometry and material
                    let pc = new THREE.Mesh(geometry, material);
                    
                    // Add the torus to the scene
                    scene.add(pc);
                    renderer.render(scene, camera);

                }
            });
            //scene.add(gltf.scene);
        }, undefined, (error) => {
            console.error("Error loading model:", error);
        });

        const canvas = document.querySelector('#pcAnim');
        let w = canvas ? canvas.clientWidth : 400;
        let h = canvas ? canvas.clientHeight : 400;

        const camera = new THREE.PerspectiveCamera( 75,  w / h, 0.1, 1000 );
        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#pcAnim'), alpha: true
        });
        renderer.setSize( canvas?.clientWidth, canvas?.clientWidth );
        
        camera.position.z = 7;
        camera.position.x = 2;
        camera.position.y = 2;


        renderer.render(scene, camera);
        const controls = new OrbitControls( camera, renderer.domElement );
        controls.update();
    })
    
</script>