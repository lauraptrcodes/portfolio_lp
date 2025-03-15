<script>
    import Icon from "./Icon.svelte";
    export let icon;
    export let tailwindClasses = "stroke-portfolio-white";
    export let link = "#";
 </script>
 
 
 <a href={link} class="bg-portfolio-blue hover:bg-[#212B40] rounded-full px-2 py-2 size-10 relative">
     <Icon iconName={icon} {tailwindClasses}></Icon>
 </a>
