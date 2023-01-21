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



<label for="howToJoin" class="link link-accent">{$t("server.howtojoin2")}</label>


<input type="checkbox" id="howToJoin" class="modal-toggle" />
<div class="modal">
  
  <div class="modal-box w-11/12 max-w-5xl space-y-5">

    <div class="flex justify-between modal-action">
        <h3 class="font-bold text-lg">How To Join</h3>
<div class="tabs tabs-boxed">
	  <a class="tab tab-active" id="je" on:click={je}>Java Edition (Computers)</a> 
  <a class="tab" id="bm" on:click={bm}>Bedrock (Mobile)</a> 
	<a class="tab" id="bc" on:click={bc}>Bedrock (Consoles)</a> 


</div>
        <label for="howToJoin" class="btn btn-circle btn-sm btn-ghost "><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></label>
 
    </div>

{#if edition == "je"}
		    <div class="flex">
      
<ul class="steps steps-vertical">
  <li class="step step-primary">Open Minecraft</li>
  <li class="step step-primary">Click "Multiplayer"</li>
  <li class="step">Click "Add Server"</li>
  <li class="step">Type in {address}</li>
	<li class="step">Click Save</li>
</ul>
    </div>
{:else if edition == "bc"}
			    <div class="flex">
      
<ul class="steps steps-vertical">
  <li class="step step-primary">Download the Bedrock Together App on your phone.</li>
  <li class="step step-primary">Press Play</li>
  <li class="step">Press "Servers"</li>
  <li class="step">Receive Product</li>
</ul>
    </div>
{:else}
			    <div class="flex">
      
<ul class="steps steps-vertical">
  <li class="step step-primary">Open Minecraft</li>
  <li class="step step-primary">Choose plan</li>
  <li class="step">Purchase</li>
  <li class="step">Receive Product</li>
</ul>
    </div>
{/if}
    <div id="plugins" class="space-y-2">
      
    </div>
    
  </div>
</div>