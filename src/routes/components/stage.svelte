<!--<div class="grid grid-cols-5 gap-4 m-24 relative">-->
<div class="my-24 relative ">
    <div class="h-[480px] relative overflow-visible w-full lg:max-w-6xl lg:mx-auto isolate">
        <!--info-->
        <Scene onSnapshot={(url) => waveSnapshot = url}/>
        <!-- Periodisch aktualisiertes Abbild der Wave-Canvas als echtes DOM-Element,
             damit die Maske zuverlässig dagegen ausgerichtet werden kann (Live-Canvas
             ist dafür browserübergreifend inkonsistent) -->
        <div
            bind:this={waveBgDiv}
            class="overflow-hidden absolute h-full -left-[20%] w-[140%] -z-10 bg-cover bg-center"
            style="background-image: url({waveSnapshot});"
        ></div>
        <div class="w-full max-w-6xl flex flex-col relative h-full mx-auto px-6 lg:px-0">
            <MaskedText
                snapshot={waveSnapshot}
                bgElement={waveBgDiv}
                wrapperClass="absolute top-[50%] -translate-y-1/2"
                let:colorClass
            >
                <h3 class="mb-4 {colorClass}">Hi, I'm Laura</h3>
                <h2 class="leading-7 {colorClass}">Software engineer <br>& creative developer 
                </h2>

                <p class="mt-8 {colorClass}">Wer ich bin, was ich mache, wofür ich mich interessiere.
                    <br> Ich programmiere alles und brauche dringend geld, bla bla.
                </p>
            </MaskedText>

            <div class="flex gap-3  mt-8 z-10 absolute bottom-8">
                <TextButton text="Say hello" icon="mail" on:click={() => handleScroll()}/>                
                <IconButton icon="github"/>
                <IconButton icon="linkedin"/>
            </div>
        </div>
    </div>
</div>


<script>
    //                 

    //import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte';
    import TextButton from './TextButton.svelte';
    import IconButton from './IconButton.svelte';
    import scrollIntoView from 'scroll-into-view-if-needed';
    import MaskedText from './MaskedText.svelte';

    // Data-URL des periodischen Wave-Canvas-Snapshots (siehe Scene.svelte)
    let waveSnapshot = '';

    /** @type {HTMLDivElement} */
    let waveBgDiv;

    function handleScroll() {
		const element = document.getElementById('contactform');
// 		element.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
		scrollIntoView(element,
		{
			behavior: 'smooth',
			block: 'center',
			//boundary: parent
		});
	}
</script>