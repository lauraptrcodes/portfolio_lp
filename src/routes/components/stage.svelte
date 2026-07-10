<!--<div class="grid grid-cols-5 gap-4 m-24 relative">-->
<div class="my-24 relative ">
    <div class="h-[480px] overflow-visible w-full lg:max-w-6xl lg:mx-auto">
        <!--info-->
        <Scene/>
        <div class="w-full max-w-6xl flex flex-col relative h-full mx-auto px-24">
            <div  class="absolute top-[50%] -translate-y-1/2 mix-blend-screen">
                <h3 class="mb-4 ">Hi, I'm Laura</h3>
                <h2 class="leading-7 ">Software engineer <br>& creative developer 
                </h2>
        
                <p class="mt-8 ">Wer ich bin, was ich mache, wofür ich mich interessiere.
                    <br> Ich programmiere alles und brauche dringend geld, bla bla.
                </p>
            </div>

            <div  class="absolute top-[50%] -translate-y-1/2 mix-blend-difference">
                
                <h3 class="mb-4 !text-[#d9c395]">Hi, I'm Laura</h3>
                <h2 class="leading-7 !text-[#d9c395]">Software engineer <br>& creative developer 
                </h2>
            
                <p class="mt-8 !text-[#d9c395]">Wer ich bin, was ich mache, wofür ich mich interessiere.
                    <br> Ich programmiere alles und brauche dringend geld, bla bla.
                </p>

            </div>
            <div class="flex gap-3  mt-8 z-10 absolute bottom-8">
                <TextButton text="Say hello" icon="mail"  onclick={() => handleScroll()}/>
                <IconButton icon="github"/>
                <IconButton icon="linkedin"/>
            </div>
        </div>
    </div>
</div>


<script>
    //import { Canvas } from '@threlte/core'
    import Scene from './Scene.svelte';
    import TextButton from './TextButton.svelte';
    import IconButton from './IconButton.svelte';
    import scrollIntoView from 'scroll-into-view-if-needed';


    function handleScroll() {
		const element = document.getElementById('contactform');
// 		element.scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'start' });
		scrollIntoView(element,
		{
			behavior: 'smooth',
			block: 'center',
			//boundary: parent
		});
	}
</script>