<script>
    import ProjectCard from "./projectCard.svelte";
    import ProjectModal from "./projectModal.svelte";

    let selectedProject = null;
    let projects = [
        { title: 'Web Dev with Vue.js', video: '/assets/videos/metallicDelay.mp4', image:'', description: 'djhfksdhfjskdh', technologies: ['svelte', 'C#'] },
        { title: 'AnnieBox with Angular and Django', video: '/assets/videos/webdevvue.mp4', image:'', description: 'djhfksdhfjskdh', technologies: ['svelte', 'C#'] },
        { title: 'Device Wall with ASP.Net and Angular', video: '', image:'', description: 'djhfksdhfjskdh', technologies: ['svelte', 'C#'] }
    ];
    function openProject(project) {
    selectedProject = project;
    }
    function closeProject() {
        selectedProject = null;
    }
</script>


 <!-- Duotone-Filter: Graustufen des Videos werden zwischen portfolio-blue (#0442BF) und Weiß gemappt -->
 <svg width="0" height="0" class="absolute">
     <filter id="duotone-blue" color-interpolation-filters="sRGB">
         <feColorMatrix type="matrix"
             values="0.2126 0.7152 0.0722 0 0
                     0.2126 0.7152 0.0722 0 0
                     0.2126 0.7152 0.0722 0 0
                     0      0      0      1 0" />
         <feComponentTransfer>
             <feFuncR type="table" tableValues="0.0157 1" />
             <feFuncG type="table" tableValues="0.2588 1" />
             <feFuncB type="table" tableValues="0.7490 1" />
         </feComponentTransfer>
     </filter>
 </svg>

<div class="w-full px-24">
    <div class="relative my-24 mx-auto flex flex-col md:flex-row flex-wrap gap-4 w-full max-w-6xl justify-items-center justify-center">
        {#each projects as project}
            <ProjectCard {project} onSelect={openProject}></ProjectCard>
        {/each}
    </div>
</div>

<ProjectModal project={selectedProject} onClose={closeProject} />