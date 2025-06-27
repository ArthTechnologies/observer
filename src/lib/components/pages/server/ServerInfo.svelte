<script>
    import CopyButton from "$lib/components/buttons/CopyButton.svelte";
    import Versions from "$lib/components/buttons/Versions.svelte";
    import StorageLimit from "$lib/components/ui/StorageLimit.svelte";
    import World from "$lib/components/ui/World.svelte";
    import { BookOpen, CameraIcon, PenLine } from "lucide-svelte";
    let icon = "/images/placeholder.webp";
    export let name = "Server Name";
    export let address = "127.0.0.1";
    export let port = 25565;
    export let subdomain = undefined;
    export let modded = false;
</script>
    <div
          class=" bg-base-300 w-full shadow-xl rounded-xl px-4 py-3 neutralGradientStroke"
        >
        <p class=" font-bold font-ubuntu text-gray-100 mb-3">Server Info</p>
          <div class="flex flex-col items-center w-full md:w-[19.8rem]">
         
<div class="flex items-center gap-3.5 w-full">
  <div class="w-[3.5rem] h-[3.5rem] relative group">
    <img
      id="xIcon"
      src={icon}
      class="rounded-lg transition-all cursor-pointer"
    />
    <div class="absolute top-0 left-0 w-full h-full cursor-poiter bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-0 transition-opacity">
      <CameraIcon />
    </div>
  </div>

              <div class="flex flex-col">
                <div class="text-sm font-light flex font-poppins">
                Name:
                </div>
                <div class="font-poppins-bold text-sm md:text-lg -mt-1">
                  {name} <button class="btn bg-base-100 bg-opacity-75 btn-xs btn-circle">
                    <PenLine size=12 /></button>
                </div>

                <div id="rawDesc" class="hidden"></div>
              </div>
              
            </div>
                  <div class="flex items-center gap-3.5 w-full">
           

           <div class="flex">
               <div class="flex flex-col">
               <span class="text-sm font-light  font-poppins mt-3">
                  IP Address
                </span>
                <div class="flex justify-between">
                  <div class="font-mono text-sm  text-white  rounded flex gap-1 items-center -mt-1">
                  {#if subdomain == undefined}{address}:{port}{:else}
                    {subdomain}.{address}
                  {/if}
                  <CopyButton text={subdomain == undefined ? address + ":" + port : subdomain + "." + address} size="16" class="cursor-pointer"
                  />
            
                </div>
                <a href="https://arthmc.xyz/knowledgebase/how-to-join-servers/" target="_blank" class="btn btn-xs  bg-slate-900 bg-opacity-80"><BookOpen size=16 class="mr-1.5"/> How to Join</a>
                </div>
<div class="divider my-2"></div>
              <StorageLimit {modded}/>
                <div id="rawDesc" class="hidden"></div>
                  <div class="flex flex-col gap-2 items-center mt-4 mb-1.5">
        <div class="flex space-x-2 w-full justify-center">
          <div class="w-[45%]">
          <Versions />
          </div>
          <div class="w-[45%]">
          <World /></div>
        </div>
    
      </div>
              </div>


    
              
                  
           </div>
              
            </div>
          </div>
        </div>