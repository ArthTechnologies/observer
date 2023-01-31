<script lang="ts">
	import {t} from "../../scripts/i18n"
	export let address;
	let edition = "je";
	function je() {
		    document.getElementById("bm").classList.remove("tab-active");
				    document.getElementById("bc").classList.remove("tab-active");
		    document.getElementById("je").classList.add("tab-active");
		edition = "je";
	}
		function bm() {
				    document.getElementById("bm").classList.add("tab-active");
				    document.getElementById("bc").classList.remove("tab-active");
		    document.getElementById("je").classList.remove("tab-active");
					edition = "bm";
	}
		function bc() {
				    document.getElementById("bm").classList.remove("tab-active");
				    document.getElementById("bc").classList.add("tab-active");
		    document.getElementById("je").classList.remove("tab-active");
					edition = "bc";
	}
</script>

<!-- The button to open modal -->
<label for="HowToJoin" class="link link-primary"> {$t("server.howtojoin2")}</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="HowToJoin" class="modal-toggle" />
<label for="HowToJoin" class="modal cursor-pointer">
  <div class="modal-box relative flex-col w-11/12 max-w-5xl space-y-5">

		
		 <div class="flex-row justify-between">
			 		<label for="HowToJoin" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
<div class="tabs tabs-boxed w-fit">
	  <button class="tab tab-active" id="je" on:click={je}>Java Edition (Computers)</button> 
  <button class="tab" id="bm" on:click={bm}>Bedrock (Mobile)</button> 
	<button class="tab" id="bc" on:click={bc}>Bedrock (Consoles)</button> 


</div>
{#if edition == "je"}
	<p></p>
{:else if edition == "bm"}
	<div class="flex justify-around mt-3">
	<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
	
</div>
			 <div class="flex justify-around mt-3">
	<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
	
</div>
	{:else if edition == "bc"}
		<div class="flex justify-around mt-3">
	<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
	
</div>
			 <div class="flex justify-around mt-3">
	<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
		<img src="https://www.wikihow.com/images/thumb/a/ad/Join-a-Minecraft-Server-Step-5-Version-3.jpg/aid3784657-v4-728px-Join-a-Minecraft-Server-Step-5-Version-3.jpg.webp" width="300" height="175">
	
</div>
{/if}
  </div>
</label>