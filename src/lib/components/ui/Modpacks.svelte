<script lang="ts">
  import { browser } from "$app/environment";
  import { searchMods, searchPlugins } from "$lib/scripts/req";
  import ModpackResult from "./ModpackResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { numShort } from "$lib/scripts/numShort";

  let promise;
  let mrResults = [];
  let cfResults = [];
  let query = "";
  let tab = "cf";

  function search(platform: string) {
    console.error("searching" + platform);
    if (platform != "cf" && platform != "mr") {
      if (tab == "mr") mrResults = [];
      platform = tab;
      if (tab == "cf") cfResults = [];
      platform = tab;
    }
    if (browser) {
      let software = document
        .getElementById("softwareDropdown")
        .value.toLowerCase();
      let version = document.getElementById("versionDropdown").value;

      setTimeout(function () {
        promise = searchMods(
          platform,
          software,
          version,
          query,
          "modpack"
        ).then((response) => {
          if (platform == "mr") {
            response.hits.forEach((item) => {
              mrResults.push({
                name: item.title,
                desc: item.description,
                icon: item.icon_url,
                author: item.author,
                id: item.project_id,
                client: item.client_side,
                downloads: numShort(item.downloads),
                platform: "mr",
              });
              console.log(mrResults);
            });
          } else if (platform == "cf") {
            response.data.forEach((item) => {
              cfResults.push({
                platform: "cf",
                name: item.name,
                desc: item.summary,
                icon: item.logo.thumbnailUrl,
                author: item.authors[0].name,
                id: item.id,
                client: null,
                downloads: numShort(item.downloadCount),
                versions: item.latestFiles,
              });
            });
          }
        });
      }, 1);
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

<label
  for="my-modal-5"
  class="btn btn-block btn-primary"
  on:click={() => {
    search("cf");
    search("mr");
  }}>Use Modpack</label
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
        <button id="mr" on:click={mr} class="tab">Modrinth</button>
        <button id="cf" on:click={cf} class="tab tab-active">Curseforge</button>
      </div>
    </div>
    {#if tab == "mr"}
      <div>
        <input
          bind:value={query}
          on:keypress={() => search(tab)}
          type="text"
          placeholder="{$t('search')} Modrinth"
          class="searchBar input input-bordered input-sm"
          id="search"
        />
      </div>
      <div id="modpacks" class="space-y-2">
        {#await promise then}
          {#each mrResults as result}
            <ModpackResult {...result} />
          {/each}
        {/await}
      </div>
    {:else if tab == "cf"}
      <div class="space-y-2">
        <div>
          <input
            bind:value={query}
            on:keypress={() => search(tab)}
            type="text"
            placeholder="{$t('search')} CurseForge"
            class="searchBar input input-bordered input-sm"
            id="search"
          />
        </div>
        <div id="modpacks" class="space-y-2">
          {#await promise then}
            {#each cfResults as result}
              <ModpackResult {...result} />
            {/each}
          {/await}
        </div>
      </div>
    {/if}
  </div>
</div>
