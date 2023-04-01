<script lang="ts">
  import { browser } from "$app/environment";
  import { getMods } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import ManagePlugin from "./ManagePlugin.svelte";
  let promise;
  let res = { names: [], ids: [], platforms: [] };
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
        promise = getMods(id, "plugins").then((response) => {
          res = response;
        });
      }, 1);
    }
  }
  search();
</script>

<label for="manage" on:click={search} class="btn md:btn-block btn-primary w-24 "
  >{$t("button.manageplugins")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="manage" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative w-11/12 max-w-5xl space-y-2 h-[50rem]">
    <p class="font-bold text-2xl">Plugins</p>
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
        {#each res.names as name, i}
          <ManagePlugin
            {name}
            id={res.ids[i]}
            platform={res.platforms[i]}
            modtype="plugin"
          />
        {/each}
      {/await}
    </div>
  </div>
</div>
