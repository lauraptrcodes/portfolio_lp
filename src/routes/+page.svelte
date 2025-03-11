<script>
  import '../app.css';

  import Header from "./components/header.svelte";
  import Stage from "./components/stage.svelte";
  import Projects from './components/projects.svelte';
  import Skills from './components/skills.svelte';
  import Contact from './components/contact.svelte';
</script>

<Header/>
<Stage/>
<Projects/>
<Skills/>
<Contact/>

<!--contact form-->
<style lang="postcss">
  @reference "tailwindcss/theme";
  @theme {
    --color-portfolio-blue: #0442BF;
    --color-portfolio-gray: #2c2e33;
    --color-portfolio-dark: #232833;
    --color-portfolio-text: #263C6A;
    --color-portfolio-black: #000000; 
    --color-portfolio-white: #ffffff;

    --font-martian-mono: "Martian Mono", sans-serif;
  }
  :global(html) {
    background-color: theme(--color-portfolio-white);
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
  :global(p){
    font-family: 'Martian Mono', monospace;
    font-size: 18px;
    color: theme(--color-portfolio-text);
  }
  
</style>