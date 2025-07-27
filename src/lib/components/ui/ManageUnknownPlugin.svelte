<script>
    import { browser } from "$app/environment";
    import { t } from "$lib/scripts/i18n";
    import { apiurl, usingOcelot } from "$lib/scripts/req";
    import { BoxIcon, Trash2 } from "lucide-svelte";
 export let filename;
 export let modtype;
 let serverId = "";
 if (browser) {
    serverId = localStorage.getItem("serverID");
 }
  export function del(filename) {
    //tell upstream component to refresh
    const event = new CustomEvent("refresh");
    document.dispatchEvent(event);

    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);
    const url =
      baseurl + "server/" + serverId + "/files/delete/" + modtype + "s*" + filename;
    fetch(url, {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    });
  }
</script>
  <div
    class="p-2 rounded-lg bg-base-200 flex justify-between items-center h-16"
  >
    <div class="flex items-center justify-between gap-1 break-all w-full">
      <div class="flex gap-2 mr-1 items-center max-md:mb-1">
  
        <div class="h-12 w-12 flex-shrink-0 bg-base-100 rounded-md flex items-center justify-center">
          <BoxIcon size=32/>
        </div>
   
        <div class="flex flex-col">
          <div class=""><span class="font-bold text-gray-200 font-ubuntu">{filename}</span>
           
          <div  class="text-xs text-gray-400 font-mono overflow-hidden text-ellipsis w-[100%] h-3">
      
          Unknown Details
          </div>
        </div>
        
      </div>

    
    </div>

    <div class="flex items-center">
           

      <button
       class="btn btn-square btn-ghost btn-sm"
        on:click={() => del(filename)}
        title={$t("delete")}
      >
        <Trash2 size="16" />
      </button>
                
     
  

      

    </div>
  </div></div>