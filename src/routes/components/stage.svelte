
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

            <div class="flex gap-3  mt-8">
                <TextButton text="Say hello" icon="mail"/>
                <IconButton icon="github"/>
                <IconButton icon="linkedin"/>
            </div>
        </div>
    </div>
    <div id="waveAnim" class="h-[480px] mr-[-300px] ">
        <!--2d wave graphic class="bg-blue-700-->
        <Canvas >
            <Scene/>
        </Canvas>
    </div>
</div>


<script>
    import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte';
    import TextButton from './TextButton.svelte';
    import IconButton from './IconButton.svelte';
</script>