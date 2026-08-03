<script>
    import { onMount } from 'svelte';

    export let snapshot = '';
    export let bgElement = null;
    // Nur noch für Ausrichtungs-Klassen wie "text-right" gedacht — KEINE
    // absolute Positionierung mehr nötig, die übernimmt die Komponente jetzt selbst
    export let wrapperClass = '';

    let anchor;
    let maskWidth = 0;
    let maskHeight = 0;
    let maskOffsetX = 0;
    let maskOffsetY = 0;
    let invertedSnapshot = '';
    let isMobile = false;
    let lastInvertTime = 0;

    function invertSnapshot(src) {
        if (!src) return;
        const now = performance.now();
        const minInterval = isMobile ? 800 : 0;
        if (now - lastInvertTime < minInterval) return;
        lastInvertTime = now;

        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            const targetWidth = isMobile ? 120 : 300;
            //const scale = targetWidth / img.naturalWidth;
            c.width = img.naturalWidth;// * scale;
            c.height = img.naturalHeight;// * scale;
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, c.width, c.height);
            const imageData = ctx.getImageData(0, 0, c.width, c.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
            }
            ctx.putImageData(imageData, 0, 0);
            invertedSnapshot = c.toDataURL('image/png');
        };
        img.src = src;
    }

    $: invertSnapshot(snapshot);

    function updateMaskAlignment() {
        if (!bgElement || !anchor) return;
        const bgRect = bgElement.getBoundingClientRect();
        const anchorRect = anchor.getBoundingClientRect();
        maskWidth = bgRect.width;
        maskHeight = bgRect.height;
        maskOffsetX = bgRect.left - anchorRect.left;
        maskOffsetY = bgRect.top - anchorRect.top;
    }

    onMount(() => {
        isMobile = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
        updateMaskAlignment();

        const resizeObserver = new ResizeObserver(updateMaskAlignment);
        if (bgElement) resizeObserver.observe(bgElement);
        window.addEventListener('resize', updateMaskAlignment);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateMaskAlignment);
        };
    });

    $: if (bgElement && anchor) updateMaskAlignment();
</script>

<!-- Äußerer Wrapper: nimmt echten Platz im Layout-Fluss ein (Größe kommt vom
     unsichtbaren Platzhalter unten), dadurch verhält sich MaskedText wie ein
     normales Flex-/Block-Element — Geschwister-Elemente (z.B. Buttons) können
     sich per margin/gap relativ dazu positionieren -->
<div class="relative {wrapperClass}">
    <!-- Unsichtbarer Platzhalter: gibt dem Wrapper seine reale Höhe/Breite -->
    <div class="invisible" aria-hidden="true">
        <slot colorClass="" />
    </div>

    <!-- Blaue Ebene: sichtbar, wo der Hintergrund hell ist -->
    <div
        bind:this={anchor}
        class="absolute inset-0"
        style="mask-image: url({snapshot}); -webkit-mask-image: url({snapshot});
               mask-mode: luminance; -webkit-mask-mode: luminance;
               mask-size: {maskWidth}px {maskHeight}px; -webkit-mask-size: {maskWidth}px {maskHeight}px;
               mask-position: {maskOffsetX}px {maskOffsetY}px; -webkit-mask-position: {maskOffsetX}px {maskOffsetY}px;
               mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;"
    >
        <slot colorClass="!text-portfolio-blue" />
    </div>

    <!-- Weiße Ebene: sichtbar, wo der Hintergrund dunkel ist -->
    <div
        class="absolute inset-0"
        style="mask-image: url({invertedSnapshot}); -webkit-mask-image: url({invertedSnapshot});
                mask-mode: luminance; -webkit-mask-mode: luminance;
                mask-size: {maskWidth}px {maskHeight}px; -webkit-mask-size: {maskWidth}px {maskHeight}px;
                mask-position: {maskOffsetX}px {maskOffsetY}px; -webkit-mask-position: {maskOffsetX}px {maskOffsetY}px;
                mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;"
    >
        <slot colorClass="!text-portfolio-white" />
    </div>
</div>