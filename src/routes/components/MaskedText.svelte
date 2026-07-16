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

    // Eindeutige ID, damit mehrere <MaskedText>-Instanzen auf derselben Seite
    // sich nicht gegenseitig ihre SVG-Masken überschreiben
    const maskId = `wave-mask-${Math.random().toString(36).slice(2, 9)}`;

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

<!-- Unsichtbares SVG nur für die Masken-Definition dieser Instanz -->
<svg width="0" height="0" class="absolute">
    <filter id="{maskId}-invert">
        <feColorMatrix type="matrix" values="
            -1 0 0 0 1
            0 -1 0 0 1
            0 0 -1 0 1
            0 0 0 1 0" />
    </filter>
    <mask id={maskId} maskUnits="userSpaceOnUse"
        x={maskOffsetX} y={maskOffsetY} width={maskWidth} height={maskHeight}>
        <image href={snapshot} x={maskOffsetX} y={maskOffsetY} width={maskWidth} height={maskHeight}
            preserveAspectRatio="none" filter="url(#{maskId}-invert)" />
    </mask>
</svg>

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
    style="mask: url(#{maskId}); -webkit-mask: url(#{maskId});"
>
    <slot colorClass="!text-portfolio-white" />
</div>