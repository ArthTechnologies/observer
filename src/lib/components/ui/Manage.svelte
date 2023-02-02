<script>
  import { browser } from "$app/environment";
  import { getPlugins } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import ManagePlugin from "./ManagePlugin.svelte";
  let promise;
  let res = { names: [], ids: [], platforms: [] };
  let query = "";
  function search() {
    console.log("searching" + query);

    if (browser) {
      let id = localStorage.getItem("serverID");

      setTimeout(function () {
        promise = getPlugins(id).then((response) => {
          res = response;
        });
      }, 1);
    }
  }
  search();
</script>

<label for="manage" on:click={search} class="btn btn-block btn-primary"
  >Manage Plugins</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="manage" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative w-11/12 max-w-5xl space-y-5 h-[50rem]">
    <div class="flex justify-between">
      <label for="manage" class="btn btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >
    </div>

    <div id="plugins" class="space-y-2">
      {#await promise then}
        {#each res.names as name, i}
          <ManagePlugin {name} id={res.ids[i]} platform={res.platforms[i]} />
        {/each}
      {/await}
    </div>
  </div>
</div>
