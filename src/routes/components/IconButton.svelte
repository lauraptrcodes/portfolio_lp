<script>
    import Icon from "./Icon.svelte";
    export let icon;
    export let tailwindClasses = "stroke-portfolio-blue fill-portfolio-white";
 </script>
 
 <button class="bg-portfolio-blue rounded-full px-2 py-2 size-10 relative">
     <Icon iconName={icon} {tailwindClasses}></Icon>
 </button>