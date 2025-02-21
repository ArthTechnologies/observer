<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";


    import { t } from "$lib/scripts/i18n";
    import { MapPin, ShoppingCart, User } from "lucide-svelte";
    let nodeInfo = [];
    let selectedNode = "";

    if (browser) {
        fetch('https://ocelot.arthmc.xyz/nodeInfo')
            .then(response => response.json())
            .then(data => {
                nodeInfo = data;
            });
    }
</script>
<div
style="background-size: cover;"
class="bg-[url('/images/hostingbg3.png')] 0 hero min-h-screen"
>
<div
class=" absolute h-screen w-full bg-gradient-to-b from-[#1a141c] to-[#99402b] z-[-1]"
></div>
<div
class="relative bg-base-100 rounded-xl shadow-xl  flex flex-col items-center h-[83%] w-[95%] md:w-[48rem]"
>
<ul class="steps scale-90 mt-5 w-2/3 mb-5">
  <li class="step step-neutral step-primary" data-content="">
    <MapPin size="18" class="-mt-10 z-50 text-gray-200" />
  </li>
  <li class="step step-neutral" data-content="">
    <User size="18" class="-mt-10 z-50 text-gray-200" />
  </li>


  <li class="step step-neutral" data-content="">
    <ShoppingCart size="18" class="-mt-10 z-50" />
  </li>
</ul>
<!-- Signup Section-->
<div class="flex z-10 -mt-6">
    <div class="w-[47.5%] md:w-96 pb-6">
    
        <p class="text-[1.4rem] font-poppins-bold -mb-3 px-5 md:px-8 xl:px-12 text-center mt-2 invisible">Locations</p>
      
            
              <img src="/images/world-map.svg" class=" opacity-90 md:w-[95%]" />
             
    
      

        

      </div>
      <div class="max-md:w-[47.5%] flex flex-col justify-between items-center">
        <div class="w-full md:w-96 rounded-xl flex flex-col items-center">
          
            <p class="text-[1.4rem] font-poppins-bold mb-2 mt-12 px-5 md:px-8 xl:px-12 text-center ">Pick a location</p>
    
            <div class="flex flex-col gap-2 w-3/4">
              {#each nodeInfo as node}
              <div class="flex gap-2.5 bg-neutral bg-opacity-75 px-2 p-1 rounded-xl items-center">
                {#if parseInt(node[1]) >= parseInt(node[2])}
                <input type="radio" name="radio-2" class="radio pointer-events-none opacity-50" />
                {:else}
                  <input type="radio" name="radio-2" class="radio"  id={node[0]} value={node[0]} on:change={() => {
                    let nodeurl = node[0];
                    //add the / to the end of the url
                    if (!nodeurl.endsWith("/")) {
                        nodeurl += "/";
                    }
                      localStorage.setItem("userNode", nodeurl);
                        selectedNode = node[0].split("https://")[1].split(".")[0];
                  }} />{/if}
    <span class="text-4xl max-md:hidden">
      {#if node[0].includes("us")}
    &#127482;&#127480;
    {:else if node[0].includes("germany")}
    &#127465;&#127466;
    {/if}
    </span>
                  <div class="flex flex-col mb-1">
                  
                   <p class="font-bold">     <span class="md:hidden"> {#if node[0].includes("us")}
                    &#127482;&#127480;
                    {:else if node[0].includes("germany")}
                    &#127465;&#127466;
                    {/if}</span>  {node[0].split("https://")[1].split(".")[0]}</p>
                   <div class="flex gap-2">
                      
                      {#if parseInt(node[1]) >= parseInt(node[2])}
                      <div class="bg-error text-black border border-black rounded-lg md:rounded-full text-xs px-1.5">At Capacity</div>
                      {:else if parseInt(node[2]) - parseInt(node[1]) < 5 }
                      <div class="bg-warning text-black border border-black rounded-lg md:rounded-full text-xs px-1.5">Only {parseInt(node[2]) - parseInt(node[1]) } Servers Left</div>
                      {:else}
                      <div class="bg-success
                      text-black border border-black rounded-full text-xs px-1.5">Available</div>
                      {/if}
                  
                   </div>
                  </div>
                  
                  </div>
              {/each}
           
            </div>
           
      </div>
      <div class="mb-32 w-3/4">
{#if selectedNode}
<div class="max-md:mt-12 flex justify-between gap-2.5 bg-neutral bg-opacity-75 px-2 p-1 rounded-md">
    
    <p class="text-xl flex items-center gap-1.5 ml-0.5">      {#if selectedNode.includes("us")}
        &#127482;&#127480;
        {:else if selectedNode.includes("germany")}
        &#127465;&#127466;
        {/if} <span class="text-base font-poppins-bold">{selectedNode}</span></p>

    <a href="/signup/account" class="btn btn-base-200 btn-sm" on:click={() => {
      
    }}>Continue</a>
 
   
</div>
{:else}
<div class="max-md:mt-1 flex justify-between gap-2.5 bg-neutral opacity-50 disabled bg-opacity-75 px-2 py-1.5 rounded-md">
    <p class="text-xl flex items-center gap-1.5 ml-0.5">   
        &#127470;&#127465;
      <span class="text-base font-poppins-bold">No location selected</span></p>
   
 
</div>
{/if}
        
            
        </div>
</div>
</div>
</div>
</div>