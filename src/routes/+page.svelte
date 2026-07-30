<script>
  import '../app.css';

  import Header from "./components/header.svelte";
  import Stage from "./components/stage.svelte";
  import Projects from './components/projects.svelte';
  import Skills from './components/skills.svelte';
  import Contact from './components/contact.svelte';
  import Noise from './components/noise.svelte';
  import Footer from './components/footer.svelte';

  import Section from './components/Section.svelte';
  export let form;
</script>

<!--<Header/>-->
<Stage/>
<Section> <Projects/> </Section>
<!--<Skills/>-->
<Noise/>
<Section> <Contact {form}/> </Section>
<Footer/>

<!--contact form-->
<style lang="postcss">
  
  /*:global(html) {
    background-color: theme(--color-portfolio-white); 
    font-size: 16px;
    @font-face {
      font-family: "Martian Mono", monospace;
    }
  }
  :global(h1){
    font-family: 'Martian Mono', monospace;
    font-size: 40px;
  	color: theme(--color-portfolio-blue);
  }
  :global(h2){
    font-family: 'Martian Mono', monospace;
    font-size: 32px;
  	color: theme(--color-portfolio-dark);
  }
  :global(h3){
    font-family: 'Martian Mono', monospace;
    font-size: 28px;
  	color: theme(--color-portfolio-gray);
  }
  :global(button > p){
    font-family: 'Martian Mono', monospace;
    font-size: 18px;
    color: theme(--color-portfolio-blue);
  }
  :global(.project-card > p){
    font-family: 'Martian Mono', monospace;
    font-size: 18px;
    color: theme(--color-portfolio-white);
  }
  :global(p, label, input, textarea, a){
    font-family: 'Martian Mono', monospace;
    font-size: 18px;
    color: theme(--color-portfolio-text);
  }
  :global(a){
    font-family: 'Martian Mono', monospace;
    font-size: 18px;
    color: theme(--color-portfolio-text);

  }*/

  @media(min-width: 768px){
    :global(h2){
      font-size: 64px;
    }
  }

</style>