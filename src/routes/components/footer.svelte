<script>
    import IconButton from './IconButton.svelte';
</script>

<div class="w-full">
	<div class="flex mx-22 mt-22 mb-8 justify-between">
	    <div class="flex items-center gap-2">
	        <IconButton icon="mail"/>
	        <IconButton icon="github"/>
	        <IconButton icon="linkedin"/>
	        <IconButton icon="coffee"/>
	    </div>
	    <div class="grid grid-cols-1 text-right justify-items-stretch">
	    	<a href="#" class="underline text-portfolio-white justify-self-end hover:bg-portfolio-blue hover:text-portfolio-white">Imprint</a>
	    	<p class="text-portfolio-white">
	    		© Laura Peter, 2025
	    	</p>
	    </div>
	</div>
</div>
<style scoped>
	a:hover {
		color: var(--color-portfolio-white);
	}
</style>