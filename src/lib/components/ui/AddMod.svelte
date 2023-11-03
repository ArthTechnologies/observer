<script lang="ts">
  import { browser } from "$app/environment";
  import { numShort } from "$lib/scripts/numShort";
  import { searchMods } from "$lib/scripts/req";
  import ModResult from "./ModResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { onMount } from "svelte";
  let promise;
  let cfResults = [];
  let mrResults = [];
  let query = "";
  let software;
  let version;
  let tab = "mr";

  if (browser) {
    software = localStorage.getItem("serverSoftware");
    version = localStorage.getItem("serverVersion");
  }
  onMount(() => {
    if (software.toLowerCase() == "forge") {
      cf();
    }
  });
  search("mr");
  search("cf");
  function search(platform: string) {
    if (platform == undefined) {
      platform = tab;
    }
    console.log("searching" + query);
    if (platform == "cf") cfResults = [];
    else if (platform == "mr") mrResults = [];

    if (browser) {
      if (version == "latest") {
        version = "1.19.4";
      }

      promise = null;

      promise = searchMods(platform, software, version, query, "mod").then(
        (response) => {
          if (platform == "mr") {
            response.hits.forEach((item) => {
              console.log(numShort(item.downloads));
              mrResults.push({
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
          } else if (platform == "cf") {
            response.data.forEach((item) => {
              console.log(item);
              console.log(numShort(item.downloadCount));
              cfResults.push({
                name: item.name,
                desc: item.summary,
                icon: item.logo.thumbnailUrl,
                author: item.authors[0].name,
                id: item.id,
                client: null,
                downloads: numShort(item.downloadCount),
              });
            });
          }
        }
      );
    }
  }

  function mr() {
    if (browser) {
      tab = "mr";
      document.getElementById("mr").classList.add("tab-active");
      document.getElementById("cf").classList.remove("tab-active");
    }
  }
  function cf() {
    if (browser) {
      tab = "cf";
      document.getElementById("cf").classList.add("tab-active");
      document.getElementById("mr").classList.remove("tab-active");
    }
  }
</script>

<label for="my-modal-5" class="btn btn-block" on:click={() => search(tab)}
  >Add Mod</label
>

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
        <button id="mr" class="tab tab-active" on:click={mr}>Modrinth</button>
        <button id="cf" class="tab" on:click={cf}>Curseforge</button>
      </div>
    </div>

    <div>
      <input
        bind:value={query}
        on:keypress={() => search(tab)}
        type="text"
        placeholder={$t("search")}
        class="searchBar input input-bordered input-sm"
        id="search"
      />
    </div>
    <div id="mods" class="space-y-2">
      {#if tab == "mr"}
        {#await promise then}
          {#each mrResults as result}
            <ModResult {...result} />
          {/each}
        {/await}
      {:else if tab == "cf"}
        {#await promise then}
          {#each cfResults as result}
            <ModResult {...result} />
          {/each}
        {/await}
      {/if}
    </div>
  </div>
</div>
