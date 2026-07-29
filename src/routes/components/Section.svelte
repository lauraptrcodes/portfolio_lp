<script>
    export let className = ''; // für sonderfälle
</script>

<div
    class="relative w-full lg:max-w-6xl lg:mx-auto
           px-(--spacing-page-x) md:px-(--spacing-page-x-md) lg:px-(--spacing-page-x-lg)
           my-(--spacing-section-y) md:my-(--spacing-section-y-md) lg:my-(--spacing-section-y-lg)
           {className}"
>
    <slot />
</div>