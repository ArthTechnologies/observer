<script lang="ts">
  import { browser } from "$app/environment";
  import {
    apiurl,
    getMods,
    usingOcelot,
    getServerNode,
  } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";

  import { ChevronUp, Clock, Trash2 } from "lucide-svelte";
    import ManagePlugin from "$lib/components/ui/ManagePlugin.svelte";
    import AddDatapack from "./AddDatapack.svelte";
    import ManagePluginSkele from "$lib/components/ui/ManagePluginSkele.svelte";
  let promise;
  let res = { mods: [] };
  let query = "";
  if (browser) {
    //run search upon the "refresh" event
    document.addEventListener("refresh", function () {
      setTimeout(function () {
        search();
      }, 50);
    });
  }
  export function search() {
    console.log("searching" + query);

    if (browser) {
      let id = localStorage.getItem("serverID");

      setTimeout(function () {
        promise = getMods(id, "datapacks").then((response) => {
          res = response;
          for (let i in res.mods) {
            res.mods[i].time = new Date(res.mods[i].date).toLocaleString();
            //this helps sort this alphabetically
            for (let j in res.mods) {
              if (res.mods[i].name < res.mods[j].name) {
                let temp = res.mods[i];
                res.mods[i] = res.mods[j];
                res.mods[j] = temp;
              }
            }
          }
          console.log(res);
        });
      }, 1);
    }
  }
  search();
  function del(filename) {
    //tell upstream component to refresh
    const event = new CustomEvent("refresh");
    document.dispatchEvent(event);

    let serverId = "";
    if (browser) {
      serverId = localStorage.getItem("serverID");
    }

    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);
    const url = baseurl + "server/" + serverId + "/files/delete/world*datapacks*" + filename;

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
    class="bg-base-300 rounded-xl px-4 py-3 shadow-xl neutralGradietStroke w-full space-y-2 min-h-[30rem]"
  >

<div class="flex justify-between items-center">
  <p class="font-ubuntu text-gray-200 text-lg ml-1">Installed Datapacks</p>
  <AddDatapack />
</div>


    <div class="space-y-2">
      {#await promise}
        {#each Array(3) as _}
          <ManagePluginSkele />
        {/each}
      {:then}
        {#each res.mods as mod}
          {#if mod.id != undefined}
            <ManagePlugin
              name={mod.name.split(".disabled")[0]}
              id={mod.id}
              platform={mod.platform}
              filename={mod.filename.split(".disabled")[0]}
              date={mod.date}
              modtype="datapack"
              disabled={mod.filename.includes(".disabled")}
            />
          {:else}
            <div class="px-3 py-2 rounded-lg bg-base-300 flex justify-between">
              <div class="flex items-center space-x-1 break-all">
                <p>{mod.filename}</p>
                <button
                  on:click={() => {
                    del(mod.filename);
                  }}
                  class="btn btn-xs btn-error mt-0.5 btn-square"
                >
                  <Trash2 size="15" /></button
                >
              </div>
              <div
                class="bg-base-200 flex px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
              >
                <Clock size="16" class="mr-1.5" />
                {mod.time}
              </div>
            </div>
          {/if}
        {/each}
      {/await}
    </div>

</div>
