<!--<div class="grid grid-cols-5 gap-4 m-24 relative">-->
<div class="my-24 relative ">
    <div class="h-[480px] overflow-visible w-full lg:max-w-6xl lg:mx-auto isolate  relative">
        <!--info-->
        <Scene onSnapshot={(url) => waveSnapshot = url}/>
        <!-- Periodisch aktualisiertes Abbild der Wave-Canvas als echtes DOM-Element,
             damit mix-blend-mode zuverlässig dagegen blendet (Live-Canvas-Blending
             ist browserübergreifend inkonsistent) -->
        <div
            bind:this={waveBgDiv}
            class="overflow-hidden absolute h-full -left-[20%] w-[140%] -z-10 bg-cover bg-center"
            style="background-image: url({waveSnapshot});"
        ></div>
        <div class="w-full max-w-6xl flex flex-col relative h-full mx-auto px-6 lg:px-0">
        <!-- Unsichtbares SVG nur für die Masken-Definitionen -->
            <svg width="0" height="0" class="absolute">
                <filter id="invertColors">
                    <feColorMatrix type="matrix" values="
                        -1 0 0 0 1
                        0 -1 0 0 1
                        0 0 -1 0 1
                        0 0 0 1 0" />
                </filter>
                <mask id="waveMaskInverted" maskUnits="userSpaceOnUse"
                    x={maskOffsetX} y={maskOffsetY} width={maskWidth} height={maskHeight}>
                    <image href={waveSnapshot} x={maskOffsetX} y={maskOffsetY} width={maskWidth} height={maskHeight}
                        preserveAspectRatio="none" filter="url(#invertColors)" />
                </mask>
            </svg>

        <!-- Blaue Ebene: sichtbar, wo der Snapshot hell (weißer Seitenhintergrund) ist -->
            <div
                bind:this={maskAnchor}
                class="absolute top-[50%] -translate-y-1/2"
                style="mask-image: url({waveSnapshot}); -webkit-mask-image: url({waveSnapshot});
                    mask-size: {maskWidth}px {maskHeight}px; -webkit-mask-size: {maskWidth}px {maskHeight}px;
                    mask-position: {maskOffsetX}px {maskOffsetY}px; -webkit-mask-position: {maskOffsetX}px {maskOffsetY}px;
                    mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;"
            >
                <h3 class="mb-4 e">Hi, I'm Laura</h3>
                <h2 class="leading-7 ">Software engineer <br>& creative developer 
                </h2>

                <p class="mt-8 ">Wer ich bin, was ich mache, wofür ich mich interessiere.
                    <br> Ich programmiere alles und brauche dringend geld, bla bla.
                </p>
            </div>

        <!-- Weiße Ebene: sichtbar, wo der Snapshot dunkel (blaue Welle) ist -->
            <div
                class="absolute top-[50%] -translate-y-1/2"
                style="mask: url(#waveMaskInverted); -webkit-mask: url(#waveMaskInverted);"
            >
                <h3 class="mb-4 !text-portfolio-white">Hi, I'm Laura</h3>
                <h2 class="leading-7 !text-portfolio-white">Software engineer <br>& creative developer 
                </h2>

                <p class="mt-8 !text-portfolio-white">Wer ich bin, was ich mache, wofür ich mich interessiere.
                    <br> Ich programmiere alles und brauche dringend geld, bla bla.
                </p>
            </div>

            <div class="flex gap-3  mt-8 z-10 absolute bottom-8">
                <TextButton text="Say hello" icon="mail" on:click={() => handleScroll()}/>
                <IconButton icon="github"/>
                <IconButton icon="linkedin"/>
            </div>
        </div>
    </div>
</div>


<script>
    import { onMount } from 'svelte';
    //import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte';
    import TextButton from './TextButton.svelte';
    import IconButton from './IconButton.svelte';
    import scrollIntoView from 'scroll-into-view-if-needed';


    /**
	 * @type {HTMLDivElement}
	 */
    let textoverlay;

    // Data-URL des periodischen Wave-Canvas-Snapshots (siehe Scene.svelte)
    let waveSnapshot = '';

    /** @type {HTMLDivElement} */
    let waveBgDiv;
    /** @type {HTMLDivElement} */
    let maskAnchor;

    // Größe/Position der Maske exakt auf den Wellen-Hintergrund abgestimmt,
    // relativ zur Position der Text-Ebene (die in einem anderen, engeren
    // Koordinatenrahmen liegt als der -20%/140%-Wellen-Hintergrund)
    let maskWidth = 0;
    let maskHeight = 0;
    let maskOffsetX = 0;
    let maskOffsetY = 0;

    function updateMaskAlignment() {
        if (!waveBgDiv || !maskAnchor) return;
        const waveRect = waveBgDiv.getBoundingClientRect();
        const textRect = maskAnchor.getBoundingClientRect();
        maskWidth = waveRect.width;
        maskHeight = waveRect.height;
        maskOffsetX = waveRect.left - textRect.left;
        maskOffsetY = waveRect.top - textRect.top;
        //console.log('maskwidth:' + maskWidth + ' waveRectWidth:' + waveRect.width );
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
    onMount(() => {
        updateMaskAlignment();
        window.addEventListener('resize', updateMaskAlignment);
        return () => window.removeEventListener('resize', updateMaskAlignment);
    });

    // Neu berechnen, sobald die Wave-Div ihre Größe ändert (z.B. durch
    // Breakpoint-Wechsel oder Layout-Shifts, die kein "resize" auslösen)
    $: if (waveBgDiv && maskAnchor) updateMaskAlignment();
</script>