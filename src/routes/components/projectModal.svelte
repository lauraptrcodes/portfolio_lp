<script>
// @ts-nocheck

    export let project = null;
    export let onClose = () => {};

    // Klick auf den Hintergrund (nicht auf das Popup selbst) schließt das Modal
    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }

    function handleKeydown(e) {
        if (e.key === 'Escape') onClose();
    }
</script>
<svelte:window onkeydown={handleKeydown} />


{#if project}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
        onclick={handleOverlayClick}
    >
        <div
            class="relative w-full bg-portfolio-white rounded-lg shadow-2xl overflow-y-auto"
            style="max-width: min(1440px, 92vw); max-height: min(1440px, 90vh);"
        >
            <button
                class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-portfolio-dark text-portfolio-white text-2xl leading-none opacity-80 hover:opacity-70 transition cursor-pointer"
                onclick={onClose}
                aria-label="Schließen"
            >   
                <div class="-translate-y-1">
                    &times;
                </div>
                
            </button>

            <div class="w-full h-64 md:h-96 bg-portfolio-gray overflow-hidden">
                {#if project.video}
                    <video
                        src={project.video}
                        autoplay
                        muted
                        loop
                        playsinline
                        class="w-full h-full object-cover"
                    ></video>
                {:else if project.image}
                    <img src={project.image} alt={project.title} class="w-full h-full object-cover" />
                {/if}
            </div>

            <div class="p-6 md:p-10">
                <h2 class="mb-4">{project.title}</h2>
                <p class="mb-6">{project.description}</p>
                <div class="flex flex-wrap gap-2">
                    {#each project.technologies ?? [] as tech}
                        <span class="px-3 py-1 rounded-full text-sm bg-portfolio-blue text-portfolio-white">{tech}</span>
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}