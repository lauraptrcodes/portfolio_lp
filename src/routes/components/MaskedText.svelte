<script>
    import { onMount } from 'svelte';

    export let snapshot = '';
    export let bgElement = null;
    // Nur noch für Ausrichtungs-Klassen wie "text-right" gedacht — die
    // Positionierung selbst übernimmt die Komponente über den relative-Wrapper
    export let wrapperClass = '';

    let anchor;
    let maskWidth = 0;
    let maskHeight = 0;
    let maskOffsetX = 0;
    let maskOffsetY = 0;
    /*let invertedSnapshot = '';
    let isMobile = false;
    let lastInvertTime = 0;

    function invertSnapshot(src) {
        if (!src || isMobile) return; // Mobile nutzt den günstigeren mix-blend-mode-Pfad, siehe unten

        const now = performance.now();
        if (now - lastInvertTime < 0) return;
        lastInvertTime = now;

        const img = new Image();
        img.onload = () => {
            const c = document.createElement('canvas');
            //const scale = 300 / img.naturalWidth;
            c.width = img.naturalWidth;// * scale;
            c.height = img.naturalHeight; // * scale;
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
            const resultUrl = c.toDataURL('image/png');

            // Vor der Zuweisung fertig decodieren, damit der Browser die neue
            // Maske sofort ohne Verzögerung malen kann (verhindert Flackern
            // durch Decode-während-Paint)
            const verify = new Image();
            verify.src = resultUrl;
            const apply = () => { invertedSnapshot = resultUrl; };
            if (verify.decode) verify.decode().then(apply).catch(apply);
            else { verify.onload = apply; verify.onerror = apply; }
        };
        img.src = src;
    }

    $: invertSnapshot(snapshot);

    // Auch die "blaue" Maskenquelle (roher Snapshot) vor Verwendung decodieren
    let decodedSnapshot = '';
    async function decodeForMask(src) {
        if (!src) return;
        try {
            const img = new Image();
            img.src = src;
            if (img.decode) await img.decode();
            else await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        } catch (e) {
            // egal, trotzdem anzeigen
        }
        decodedSnapshot = src;
    }
    $: decodeForMask(snapshot);*/
    let decodedSnapshot = '';
    let invertedSnapshot = '';
    let isMobile = false;
    let lastProcessTime = 0;
    const minProcessInterval = 400;
    //const minProcessInterval = 800; // ms zwischen zwei Masken-Updates

    async function decodeImage(src) {
        const img = new Image();
        img.src = src;
        try {
            if (img.decode) await img.decode();
            else await new Promise((res, rej) => { img.onload = res; img.onerror = rej; });
        } catch (e) {
            // egal, trotzdem weitermachen
        }
        return img;
    }

    function invertImage(img) {
        const c = document.createElement('canvas');
        //const scale = 300 / img.naturalWidth;
        c.width = img.naturalWidth; //* scale;
        c.height = img.naturalHeight; //* scale;
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
        return c.toDataURL('image/png');
    }

    // Berechnet BEIDE Maskenbilder und aktualisiert beide State-Variablen
    // GEMEINSAM, im selben synchronen Block — verhindert das Flackern durch
    // asynchron auseinanderlaufende Updates der zwei Ebenen
    async function processSnapshot(src) {
        if (!src || isMobile) return;

        const now = performance.now();
        if (now - lastProcessTime < minProcessInterval) return;
        lastProcessTime = now;

        const normalImg = await decodeImage(src);
        const invertedUrl = invertImage(normalImg);
        const invertedImg = await decodeImage(invertedUrl);

        decodedSnapshot = src;
        invertedSnapshot = invertedImg.src;
    }

    $: processSnapshot(snapshot);

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
        //isMobile = true;
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
     unsichtbaren Platzhalter unten) — Geschwister-Elemente (z.B. Buttons)
     können sich per margin/gap relativ dazu positionieren -->
<div class="relative {wrapperClass}">
    <!-- Unsichtbarer Platzhalter: gibt dem Wrapper seine reale Höhe/Breite -->
    <div class="invisible" aria-hidden="true">
        <slot colorClass="" />
    </div>

    {#if isMobile}
        <!-- Mobile: eine einzige Ebene mit mix-blend-mode statt zweier
             gemaskter Ebenen — kein Pixel-Invertieren pro Frame nötig -->
        <div
            bind:this={anchor}
            class="absolute inset-0"
            style="mix-blend-mode: multiply;"
        >
            <slot />
        </div>
    {:else}
        <!-- Desktop: zwei exakt maskierte Ebenen (blau über hellem, weiß
             über dunklem Bereich) -->
        <div
            bind:this={anchor}
            class="absolute inset-0"
            style="mask-image: url({decodedSnapshot}); -webkit-mask-image: url({decodedSnapshot});
                   mask-mode: luminance; -webkit-mask-mode: luminance;
                   mask-size: {maskWidth}px {maskHeight}px; -webkit-mask-size: {maskWidth}px {maskHeight}px;
                   mask-position: {maskOffsetX}px {maskOffsetY}px; -webkit-mask-position: {maskOffsetX}px {maskOffsetY}px;
                   mask-repeat: no-repeat; -webkit-mask-repeat: no-repeat;"
        >
            <slot colorClass="!text-portfolio-blue" />
        </div>

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
    {/if}
</div>