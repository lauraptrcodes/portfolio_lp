<script>
   import Icon from "./Icon.svelte";
   export let icon;
   export let text;
   export let tailwindClasses = "stroke-portfolio-blue mr-2 group-hover:stroke-portfolio-white";

    let pressed = false;
</script>

<button on:click on:mousedown={()=>pressed = true } on:mouseup={() => pressed = false} 
    class="
        group border-3
        hover:bg-[#212B40] 
        border-portfolio-blue
        hover:border-portfolio-white rounded-full 
        {pressed ? '!bg-portfolio-black' : 'bg-portfolio-white'}
        px-3 py-1 flex z-10 items-center">
    <Icon iconName={icon} {tailwindClasses}></Icon>
    <p class="group-hover:!text-portfolio-white">{text}</p>
</button>
