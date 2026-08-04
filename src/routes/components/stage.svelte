<!--<div class="grid grid-cols-5 gap-4 m-24 relative">-->
<div class="overflow-hidden">
<Section className="isolate !mt-0 h-[480px] overflow-visible">
        <!--info-->
        <Scene onSnapshot={handleSnapshot}/>
        <!-- Periodisch aktualisiertes Abbild der Wave-Canvas als echtes DOM-Element,
             damit die Maske zuverlässig dagegen ausgerichtet werden kann (Live-Canvas
             ist dafür browserübergreifend inkonsistent) -->
        <div
            bind:this={waveBgDiv}
            class="overflow-hidden absolute h-full -left-[20%] w-[140%] -z-10 bg-cover bg-center"
            style="background-image: url({waveSnapshot});"
        ></div>
         <div class="w-full max-w-6xl relative h-full mx-auto px-6 lg:px-0">
         <div bind:this={textWrapper} class="absolute top-1/2 -translate-y-1/2 w-full">
          <MaskedText
                snapshot={waveSnapshot}
                bgElement={waveBgDiv}
                let:colorClass
            >
                <h3 class="mb-4 {colorClass}">Hi, Ich bin Laura</h3>
                <h2 class="{colorClass}">Software-Entwicklerin <br>& Creative Technologist 
                </h2>

                <p class="mt-8 {colorClass}"> 
                    Von Fullstack-Anwendungen bis zu Echtzeit-Audio-Plugins in C++,
                    <br> Ich mag Projekte, bei denen Technik und Kreativität sich nicht ausschließen müssen.
            </MaskedText>

            {#if hasButtons}
                <div
                    class="flex gap-3 z-10 absolute w-full"
                    style="top: calc(50% + {textHeight / 2}px + {buttonGap}px);"
                >
                    <TextButton text="Say hello" icon="mail" on:click={() => handleScroll()}/>                
                    <IconButton icon="github"/>
                    <IconButton icon="linkedin"/>
                </div>
            {/if}
        </div>
</Section>
</div>



<script>
    //                 

    //import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte';
    import TextButton from './TextButton.svelte';
    import IconButton from './IconButton.svelte';
    import scrollIntoView from 'scroll-into-view-if-needed';
    import MaskedText from './MaskedText.svelte';
    import Section from './Section.svelte';
    import { onMount } from 'svelte';

    // Data-URL des periodischen Wave-Canvas-Snapshots (siehe Scene.svelte)
    let waveSnapshot = '';

    /** @type {HTMLDivElement} */
    let waveBgDiv;

    /** @type {HTMLDivElement} */
    let textWrapper;
    let textHeight = 0;
    const buttonGap = 32; // entspricht in etwa "mt-8"

    // Steuert, ob die Button-Zeile überhaupt gerendert wird
    export let hasButtons = true;

    onMount(() => {
        if (!textWrapper) return;
        const observer = new ResizeObserver(([entry]) => {
            textHeight = entry.contentRect.height;
        });
        observer.observe(textWrapper);
        return () => observer.disconnect();
    });

    async function handleSnapshot(url) {
        const img = new Image();
        img.src = url;
        try {
            if (img.decode) {
                await img.decode();
            } else {
                await new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
            }
        } catch (e) {
            // Decode fehlgeschlagen — trotzdem anzeigen, besser als gar nichts
        }
        waveSnapshot = url;
    }

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