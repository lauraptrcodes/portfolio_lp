<script>
    import { onMount } from 'svelte';

    // Data-URL eines Hintergrund-Snapshots (z.B. von einer Three.js-Canvas)
    export let snapshot = '';
    // DOM-Element des sichtbaren Hintergrunds, an dem sich die Maske ausrichtet
    // (kann eine andere Größe/Position haben als diese Komponente selbst)
    export let bgElement = null;
    // Positionierungs-Klassen, die BEIDE Textebenen bekommen (Ausrichtung liegt beim Aufrufer)
    export let wrapperClass = '';

    let anchor;
    let maskWidth = 0;
    let maskHeight = 0;
    let maskOffsetX = 0;
    let maskOffsetY = 0;
    let invertedSnapshot = '';

    // Eindeutige ID, damit mehrere <MaskedText>-Instanzen auf derselben Seite
    // sich nicht gegenseitig ihre SVG-Masken überschreiben
    const maskId = `wave-mask-${Math.random().toString(36).slice(2, 9)}`;

    function invertSnapshot(src) {
        if (!src) return;
        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            const scale = 300 / img.naturalWidth;
            c.width = Math.round(img.naturalWidth * scale);
            c.height = Math.round(img.naturalHeight * scale);
            const ctx = c.getContext('2d');
            ctx.drawImage(img, 0, 0, c.width, c.height);
            const imageData = ctx.getImageData(0, 0, c.width, c.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
                data[i] = 255 - data[i];
                data[i + 1] = 255 - data[i + 1];
                data[i + 2] = 255 - data[i + 2];
                // Alpha (data[i+3]) bleibt unverändert
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
        updateMaskAlignment();

        const resizeObserver = new ResizeObserver(updateMaskAlignment);
        if (bgElement) resizeObserver.observe(bgElement);
        window.addEventListener('resize', updateMaskAlignment);

        return () => {
            resizeObserver.disconnect();
            window.removeEventListener('resize', updateMaskAlignment);
        };
    });

    // Neu ausrichten, sobald beide Referenzen (nach dem ersten Render) verfügbar sind
    $: if (bgElement && anchor) updateMaskAlignment();
</script>
<!-- Blaue Ebene: sichtbar, wo der Snapshot hell ist. Gibt per normalem Textfluss
     gleichzeitig die reale Größe/Position vor, an der sich die Maske orientiert -->
<div
    bind:this={anchor}
    class={wrapperClass}
    style="mask-image: url({snapshot}); -webkit-mask-image: url({snapshot});
           mask-mode: luminance; -webkit-mask-mode: luminance;
           mask-size: {maskWidth}px {maskHeight}px; -webkit-mask-size: {maskWidth}px {maskHeight}px;
           mask-position: {maskOffsetX}px {maskOffsetY}px; -webkit-mask-position: {maskOffsetX}px {maskOffsetY}px;
           mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;"
>
    <slot />
</div>

<!-- Weiße Ebene: identisch positioniert, per invertierter Maske sichtbar wo der Snapshot dunkel ist -->
<div
    class={wrapperClass}
    style="mask-image: url({invertedSnapshot}); -webkit-mask-image: url({invertedSnapshot});
            mask-mode: luminance; -webkit-mask-mode: luminance;
            mask-size: {maskWidth}px {maskHeight}px; -webkit-mask-size: {maskWidth}px {maskHeight}px;
            mask-position: {maskOffsetX}px {maskOffsetY}px; -webkit-mask-position: {maskOffsetX}px {maskOffsetY}px;
            mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;"
>
    <slot colorClass="!text-portfolio-white" />
</div>