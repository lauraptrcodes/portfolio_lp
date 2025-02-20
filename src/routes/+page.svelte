<script>
  import Header from "./components/header.svelte";
  import Stage from "./components/stage.svelte";
</script>

<Header/>
<Stage/>


<style lang="postcss">
  @reference "tailwindcss/theme";
  @theme {
    --color-portfolio-blue: #0442BF;
    --color-portfolio-gray: #2c2e33;
    --color-portfolio-dark: #232833;
    --color-portfolio-text: #263C6A;
    --color-portfolio-black: #000000; 
    --color-portfolio-white: #ffffff:
  }
  :global(html) {
    background-color: theme(--color-portfolio-white);
  }
  :global(h1){
    font-size: 40px;
  	color: theme(--color-portfolio-blue);
  }
  :global(h2){
    font-size: 32px;
  	color: theme(--color-portfolio-dark);
  }
  :global(h3){
    font-size: 28px;
  	color: theme(--color-portfolio-gray);
  }
  :global(p){
    font-size: 18px;
    color: theme(--color-portfolio-text);
  }
</style>