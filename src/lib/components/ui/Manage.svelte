<script lang="ts">
  import { browser } from "$app/environment";
  import { getMods } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import ManagePlugin from "./ManagePlugin.svelte";
    import { Trash2 } from "lucide-svelte";
  let promise;
  let res = { mods: [] };
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

          console.log(res);
        });
      }, 1);
    }
  }
  search();
</script>

<label for="manage" on:click={search} class="btn btn-block btn-primary"
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
        {#each res.mods as mod}
        {#if mod.id != undefined}
        <ManagePlugin
          name={mod.name}
          id={mod.id}
          platform={mod.platform}
          filename={mod.filename}
          modtype="plugin"
        />
      {:else}
        <div class="px-3 py-2 rounded-lg bg-base-300 flex justify-between">
          <div class="flex items-center space-x-1">
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
        </div>
      {/if}
        {/each}
      {/await}
    </div>
  </div>
</div>
