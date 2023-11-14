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
  let skeletonsLength = 10;

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
            skeletonsLength = response.hits.length;
            response.hits.forEach((item) => {
              console.log(numShort(item.downloads));
              mrResults.push({
                platform: "mr",
                name: item.title,
                desc: item.description,
                icon: item.icon_url,
                author: item.author,
                id: item.project_id,
                client: item.client_side,
                downloads: numShort(item.downloads),
                versions: [],
                slug: item.slug,
              });
              console.log(item);
            });
          } else if (platform == "cf") {
            skeletonsLength = response.data.length;
            response.data.forEach((item) => {
              console.log(item);
              console.log(numShort(item.downloadCount));
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
                slug: item.slug,
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

<label
  for="my-modal-5"
  class="btn btn-neutral btn-block"
  on:click={() => search(tab)}>Add Mod</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-5" class="modal-toggle" />
<div class="modal">
  <div
    class="modal-box bg-opacity-95 backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-[61.5rem]"
  >
    <div class="flex justify-between">
      <label
        for="my-modal-5"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
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
      {#await promise}
        {#each Array.from({ length: skeletonsLength }) as _}
          <div class="bg-base-200 h-[6.875rem] p-3 rounded-lg flex space-x-3">
            <div
              class="w-14 h-14 md:w-20 md:h-20 bg-slate-700 bg-pulse w-[3.35rem] h-14 rounded-lg"
            />
            <div class="flex flex-col justify-between pt-1.5 pb-0.5">
              <div class="flex space-x-1 items-end">
                <div class="bg-slate-700 bg-pulse w-[10rem] h-4 rounded-lg" />
                <div class="bg-slate-700 bg-pulse w-[5rem] h-3 rounded-lg" />
              </div>
              <div class="bg-slate-700 bg-pulse w-[17.5rem] h-3.5 rounded-lg" />
              <div class="bg-slate-700 bg-pulse w-[5.68rem] h-7 rounded-lg" />
            </div>
          </div>
        {/each}
      {:then}
        {#if tab == "mr"}
          {#each mrResults as result}
            <ModResult {...result} />
          {/each}
        {:else if tab == "cf"}
          {#each cfResults as result}
            <ModResult {...result} />
          {/each}
        {/if}
      {/await}
    </div>
  </div>
</div>
