<script lang="ts">
  import { browser } from "$app/environment";
  import { numShort } from "$lib/scripts/numShort";
  import { searchMods } from "$lib/scripts/req";
  import ModResult from "./ModResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  let promise;
  let results = [];
  let query = "";
  search();
  function search() {
    console.log("searching" + query);
    results = [];
    if (browser) {
      let software = localStorage.getItem("serverSoftware");
      let version = localStorage.getItem("serverVersion");
      if (version == "latest") {
        version = "1.19.4";
      }
      promise = null;

      promise = searchMods(software, version, query, "mod").then((response) => {
        response.hits.forEach((item) => {
          console.log(numShort(item.downloads));
          results.push({
            name: item.title,
            desc: item.description,
            icon: item.icon_url,
            author: item.author,
            id: item.project_id,
            client: item.client_side,
            downloads: numShort(item.downloads),
          });
          console.log(item);
        });
      });
    }
  }
  let tab = "mr";
  /*function ft() {
    if (browser) {
      tab = "ft";
      document.getElementById("ft").classList.add("tab-active");
      document.getElementById("mr").classList.remove("tab-active");
    }
  }
  function mr() {
    if (browser) {
      tab = "mr";
      document.getElementById("mr").classList.add("tab-active");
      document.getElementById("ft").classList.remove("tab-active");
    }
  }*/
</script>

<label for="my-modal-5" class="btn btn-block" on:click={search}>Add Mod</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-5" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative w-11/12 max-w-5xl space-y-5 h-[50rem]">
    <div class="flex justify-between">
      <label
        for="my-modal-5"
        class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
      >

      <div class="tabs tabs-boxed">
        <button id="mr" class="tab tab-active">{$t("search")}</button>
      </div>
    </div>

    <div>
      <input
        bind:value={query}
        on:keypress={search}
        type="text"
        placeholder="{$t('search')} Modrinth"
        class="searchBar input input-bordered input-sm"
        id="search"
      />
    </div>
    <div id="mods" class="space-y-2">
      {#await promise then}
        {#each results as result}
          <ModResult {...result} />
        {/each}
      {/await}
    </div>
  </div>
</div>
