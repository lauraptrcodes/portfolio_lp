<script>
   import Icon from "./Icon.svelte";
   export let icon;
   export let text;
   export let tailwindClasses = "stroke-portfolio-blue mr-2";
</script>

<button class="bg-portfolio-white border-3 border-portfolio-blue rounded-full px-3 py-1 flex items-center">
    <Icon iconName={icon} {tailwindClasses}></Icon>
    <p>{text}</p>
</button>
