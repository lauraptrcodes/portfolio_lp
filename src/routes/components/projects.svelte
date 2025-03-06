<script>
    import ProjectCard from "./projectCard.svelte";

    let projects = ['Web Dev with Vue.js', 'AnnieBox with Angular and Django', 'Device Wall with ASP.Net and Angular'];
</script>

<div class="relative my-24 mx-24 flex gap-4">
    {#each projects as project}
        <ProjectCard title={project}></ProjectCard>
    {/each}
</div>