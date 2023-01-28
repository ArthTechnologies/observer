<script>
    import { browser } from "$app/environment";
  import {searchPlugins} from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  let promise;
  let results = [];
      function search() {
        results = [];
  if (browser) {
  
    document.getElementById("plugins").innerHTML = "";
    let query= document.getElementById("search").value;
      let software = localStorage.getItem("serverSoftware");
      let version = localStorage.getItem("serverVersion");
      promise = searchPlugins(software, version, query). then((response) => {
        response.hits.forEach((item) => { 
        results.push({
              name: item.title,
              desc: item.description,
              icon: item.icon_url,
              author: item.author,
              id: item.project_id,
            });
            console.log(results)
          
      });
    });
    

      
  
  
    }
  
  }
      
  
  
  </script>
  
  <label for="my-modal-5" class="btn" on:click={search}>{$t("button.addplugin")}</label>
  
  <!-- Put this part before </body> tag -->
  <input type="checkbox" id="my-modal-5" class="modal-toggle" />
  <div class="modal">
    
    <div class="modal-box relative w-11/12 max-w-5xl space-y-5 ">
  
      <div class="flex justify-between">
              <label for="my-modal-5" class="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
          <h3 class="font-bold text-lg">{$t("server.pluginsFromModrinth")}</h3>
  
  
   
      </div>
  
      <div>
        <input on:keypress={search} type="text" placeholder={$t("search")} class="searchBar input input-bordered input-sm" id="search" />
  
      </div>
      <div id="plugins" class="space-y-2">
        {#await promise}
        
        {:then}
        {#each results as result}
        <PluginResult {...result}/>
    {/each}
    {/await}
      </div>
      
    </div>
  </div>
  
  