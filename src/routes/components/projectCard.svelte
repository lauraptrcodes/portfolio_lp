<script>
    //export let title = "default title";
    //export let video = "";
    export let project;
    export let onSelect = () => {};

    /** @type {HTMLVideoElement} */
    let videoEl;

    function handleMouseEnter() {
        videoEl?.play();
    }

    function handleMouseLeave() {
        videoEl?.pause();
        if (videoEl) videoEl.currentTime = 0; // beim nächsten Hover wieder von vorne
    }
</script>

<!-- w-5xl h-140-->
<div
     class="mx-auto md:mx-0 min-w-[320x] md:w-xs w-xs h-80 overflow-hidden transition-all duration-200 hover:translate-2 hover:shadow-[-10px_-10px_20px_rgba(0,0,0,0.15)] rounded-xl bg-portfolio-blue cursor-pointer border border-portfolio-blue"
     onclick={() => onSelect(project)}
     onmouseenter={handleMouseEnter}
     onmouseleave={handleMouseLeave}
     role="button"
     tabindex="0"
     onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(project); }}>    
     <div class="project-card relative h-full">
        {#if project.video}
            <video
                bind:this={videoEl}
                src={project.video}
                muted
                loop
                playsinline
                class="hidden md:block absolute inset-0 w-full h-full object-cover rounded-lg" 
                style="filter: url(#duotone-blue);"
            ></video> <!---->
        {/if}
        {#if project.image}
        <img
            src={project.image}
            alt={project.title}
            class="block md:hidden absolute inset-0 w-full h-full object-cover rounded-lg"
        />
        {/if}
        <div class="absolute bottom-2 p-4">
           <p class=" !text-portfolio-white bg-portfolio-blue">{project.title}</p>
        </div>
    </div>
</div>