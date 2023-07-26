<script lang="ts">
  import { browser } from "$app/environment";
  import { getMods } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import ManagePlugin from "./ManagePlugin.svelte";
  let promise;
  let res = { mods: [], modpack: {} };
  let query = "";
  if (browser) {
    //run search upon the "refresh" event
    document.addEventListener("refresh", function () {
      setTimeout(function () {
        search();
      }, 10);
    });
  }
  export function search() {
    console.log("searching" + query);

    if (browser) {
      let id = localStorage.getItem("serverID");

      setTimeout(function () {
        promise = getMods(id, "mods").then((response) => {
          res = response;
          console.log(res);
          if (response.modpack != undefined) {
            console.log(response.modpack.files.length - 1);
            console.log(response.modpack.files[0].downloads[0].split("/")[4]);

            for (let i = 0; i < response.modpack.files.length - 1; i++) {
              res.mods.push({
                id: response.modpack.files[i].downloads[0].split("/")[4],
                platform: "lr",
                name: response.modpack.files[i].downloads[0].split("/")[4],
              });
            }
          }
          console.log(res);
        });
      }, 1);
    }
  }
  search();
</script>

<label for="manage" on:click={search} class="btn btn-block btn-primary"
  >Manage Mods</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="manage" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative w-11/12 max-w-5xl space-y-2 h-[50rem]">
    <div class="md:flex items-center md:space-x-3">
      <p class="font-bold text-2xl">Mods</p>
      {#if res.modpack.name != undefined}
        <p class=" h-15 p-2 bg-base-200 rounded-lg mt-2 md:mt-0">
          Modpack: {res.modpack.name}
        </p>
      {/if}
    </div>
    <div class="flex justify-between">
      <label for="manage" class="btn btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >
    </div>

    <div class="space-y-2">
      {#await promise}
        <div class="bg-base-200 rounded-lg w-full h-[5rem] p-2">
          <div
            class="bg-slate-700 rounded-lg w-[7rem] h-[1rem] animate-pulse mb-2"
          />
          <div
            class="bg-slate-700 rounded-lg w-[30rem] h-[1rem] animate-pulse mt-3"
          />
        </div>
      {:then}
        {#each res.mods as mod}
          <ManagePlugin
            name={mod.name}
            id={mod.id}
            platform={mod.platform}
            modtype="mod"
          />
        {/each}
      {/await}
    </div>
  </div>
</div>
