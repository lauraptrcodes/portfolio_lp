<script>
    export let title = "default title";
    export let video = "";
</script>

<div class="w-xs h-80 overflow-hidden transition-all duration-200 hover:translate-2 hover:shadow-[-10px_-10px_20px_rgba(0,0,0,0.15)] rounded-lg bg-portfolio-blue">
    <div class="project-card relative w-full h-full">
    {#if video}
         <video
             src={video}
             autoplay
             muted
             loop
             playsinline
             class="absolute inset-0 w-full h-full object-cover"
             style="filter: url(#duotone-blue);"
         ></video>
     {/if}
        <p class="absolute bottom-2 p-4 text-portfolio-white">{title}</p>
    </div>
</div>