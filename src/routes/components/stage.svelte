
<div class="grid grid-cols-5 gap-4 m-24 relative">
    <div class="col-span-3">
        <!--info-->
        <div class="absolute top-[50%] -translate-y-1/2">
            <h3 class="mb-4">Hi, I'm Laura</h3>
            <h2 class="leading-7">Software engineer <br>& creative developer 
            </h2>
        
            <p class="mt-8">Wer ich bin, was ich mache, wofür ich mich interessiere.
                <br> Ich programmiere alles und brauche dringend geld, bla bla.
            </p>
        </div>
    </div>
    <div id="waveAnim" class="bg-blue-700 h-[480px] mr-[-300px]">
        <!--2d wave graphic-->
        <Canvas>
            <Scene/>
        </Canvas>
    </div>
</div>


<script>
    import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte';
    
</script>