<script>
    import IconButton from './IconButton.svelte';
</script>

<div class="w-full lg:max-w-6xl lg:mx-auto px-(--spacing-page-x) md:px-(--spacing-page-x-md) lg:px-(--spacing-page-x-lg)">
	<div class="flex mt-22 mb-8 justify-between sm:flex-row flex-col">
	    <div class="flex items-center gap-2">
	        <IconButton icon="mail"/>
	        <IconButton icon="github" link="https://github.com/lauraptrcodes"/>
	        <IconButton icon="linkedin" link="https://www.linkedin.com/in/laura-peter-53a28123a/"/>
	        <!--<IconButton icon="coffee"/>-->
	    </div>
	    <div class="grid grid-cols-1 sm:text-right text-left justify-items-stretch">
	    	<a href="#" class="underline text-portfolio-white sm:justify-self-end sm:pt-0 pt-2 hover:bg-portfolio-blue hover:text-portfolio-white">Imprint</a>
	    	<p class="text-portfolio-white">
	    		© Laura Peter, 2026
	    	</p>
	    </div>
	</div>
</div>
<style scoped>
	a:hover {
		color: var(--color-portfolio-white);
	}
</style>