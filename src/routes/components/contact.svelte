<script>
    import TextButton from './TextButton.svelte';
</script>

<div class="mx-24">
<div class="w-full text-center">
    <h1> Get in touch!</h1>
    <p class="mt-6">I'd love to here your ideas and would be excited to start a new project and perhaps learn something new</p>
</div>

<form method="POST" >
    <div class="grid grid-cols-1 gap-y-6">
        
        
        <div class="space-y-6">
            <div>
                <label for="name" class="block font-semibold text-portfolio-text">Name</label>

                <input required type="text" name="name" id="name" autocomplete="given-name" 
                placeholder="(optional)" 
                class="block w-full rounded-md bg-portfolio px-3.5 py-2 text-base 
                text-portfolio-gray -outline-offset-2 outline-portfolio-text outline-2
                focus:outline-2 focus:-outline-offset-2 focus:outline-portfolio-blue"/>
            </div>
            <div>
                <label for="email" class="block font-semibold text-portfolio-text">Email</label>

                <input required type="text" name="email" id="email" autocomplete="email" 
                class="block w-full rounded-md bg-portfolio px-3.5 py-2 text-base 
                text-portfolio-gray -outline-offset-2 outline-portfolio-text outline-2
                focus:outline-2 focus:-outline-offset-2 focus:outline-portfolio-blue"/>
            </div>
            <div>
                <label for="message" class="block font-semibold text-portfolio-text">Message</label>

                <textarea required rows="4" name="message" id="message"
                class="block w-full rounded-md bg-portfolio px-3.5 py-2 text-base 
                text-portfolio-text -outline-offset-2 outline-portfolio-text outline-2
                focus:outline-2 focus:-outline-offset-2 focus:outline-portfolio-blue"></textarea>
            </div>
            <TextButton text="Submit"/>
        </div>
    </div>
</form>
</div>