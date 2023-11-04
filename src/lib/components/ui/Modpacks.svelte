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
  let skeletonsLength = 10;

  function search(platform: string) {
    console.error("searching" + platform);
    if (platform != "cf" && platform != "mr") {
      platform = tab;
    }
    if (platform == "cf") cfResults = [];
    else if (platform == "mr") mrResults = [];
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
            skeletonsLength = response.hits.length;
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
                versions: [],
              });
              console.log(mrResults);
            });
          } else if (platform == "cf") {
            skeletonsLength = response.data.length;
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
    {#await promise}
      {#each Array.from({ length: skeletonsLength }) as _}
        <div class="bg-base-200 h-[7rem] p-3 rounded-lg flex space-x-3">
          <div
            class="w-14 h-14 md:w-20 md:h-20 bg-slate-700 bg-pulse w-[3.35rem] h-14 rounded-lg"
          />
          <div class="flex flex-col justify-between pt-1.5">
            <div class="flex space-x-1 items-end">
              <div class="bg-slate-700 bg-pulse w-[10rem] h-4 rounded-lg" />
              <div class="bg-slate-700 bg-pulse w-[5rem] h-3 rounded-lg" />
            </div>
            <div
              class="bg-slate-700 bg-pulse w-[17.5rem] h-3.5 rounded-lg mb-0.5"
            />
            <div class="bg-slate-700 bg-pulse w-[5.68rem] h-7 rounded-lg" />
          </div>
        </div>
      {/each}
    {:then}
      {#if tab == "mr"}
        <div id="modpacks" class="space-y-2">
          {#each mrResults as result}
            <ModpackResult {...result} />
          {/each}
        </div>
      {:else if tab == "cf"}
        <div class="space-y-2">
          <div id="modpacks" class="space-y-2">
            {#each cfResults as result}
              <ModpackResult {...result} />
            {/each}
          </div>
        </div>
      {/if}
    {/await}
  </div>
</div>
