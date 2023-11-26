<script lang="ts">
  import { browser } from "$app/environment";
  import { searchMods, searchPlugins, usingCurseForge } from "$lib/scripts/req";
  import ModpackResult from "./ModpackResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { numShort } from "$lib/scripts/utils";
  import { onMount } from "svelte";
  import { Plus } from "lucide-svelte";
  import ResultSkele from "./ResultSkele.svelte";

  let promise;
  let mrResults = [];
  let cfResults = [];
  let query = "";
  let tab = "cf";
  let skeletonsLength = 15;
  let allowLoadMore = true;
  let offset = 0;
  let sortBy = "relevance";
  onMount(() => {
    if (browser) {
      search("mr");
      if (usingCurseForge) search("cf");
      else document.getElementById("mr").classList.add("tab-active");
    
    }
  });
  if (browser) {
    if (!usingCurseForge) tab="mr";
  }
  function search(platform: string, loadMore: boolean = false) {
    console.error("searching" + platform);
    if (platform != "cf" && platform != "mr") {
      platform = tab;
    }
    offset = 0;
    if (loadMore) {
      skeletonsLength = offset + 15;
      offset += 15;
    } else {
      if (skeletonsLength > 15) skeletonsLength = 15;
      if (platform == "cf") cfResults = [];
      else if (platform == "mr") mrResults = [];
    }
    if (browser) {
      let software = document
        .getElementById("softwareDropdown")
        .value.toLowerCase();
      let version = document.getElementById("versionDropdown").value;
      if (document.getElementById("sortByDropdown") != null) {
        sortBy = document.getElementById("sortByDropdown").value.toLowerCase();
      }
      if (sortBy == "last update") {
        sortBy = "updated";
      }

      promise = searchMods(
        platform,
        software,
        version,
        query,
        "modpack",
        offset,
        sortBy
      ).then((response) => {
        if (platform == "mr") {
          skeletonsLength = response.hits.length;
          let results = []
          response.hits.forEach((item) => {
            results.push({
              name: item.title,
              desc: item.description,
              icon: item.icon_url,
              author: item.author,
              id: item.project_id,
              client: item.client_side,
              downloads: numShort(item.downloads),
              platform: "mr",
              versions: [],
              slug: item.slug,
            });

          });
          mrResults = results;
          console.log(mrResults);
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
              slug: item.slug,
            });
          });
        }
      });
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

<label for="my-modal-5" class="btn btn-block btn-primary">Use Modpack</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-5" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
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

        <button id="mr" on:click={mr} class="tab">Modrinth</button>
        {#if usingCurseForge}
        <button id="cf" on:click={cf} class="tab tab-active">Curseforge</button>
        {/if}
      </div>

    </div>
    <div class="flex justify-between space-x-2">
      <input
        bind:value={query}
        on:input={() => search(tab)}
        type="text"
        placeholder={$t("search")}
        class="searchBar input input-bordered input-sm max-sm:w-32"
        id="search"
      />
      <div class="flex items-center">
        Sort By<select
          id="sortByDropdown"
          class="select select-sm ml-2 bg-base-300"
          on:change={() => search(tab)}
        >
          <option>Relevance</option>
          <option>Downloads</option>
          <option>Last Update</option></select
        >
      </div>
    </div>


      {#await promise}
      <div class="space-y-2">
      {#each Array.from({ length: skeletonsLength }) as _}
        <ResultSkele />
      {/each}
      </div>
    {:then}
    <div id="modpacks" class="space-y-2">
 
      {#if tab == "mr"}

          {#each mrResults as result}
            <ModpackResult {...result} />
          {/each}

      {:else if tab == "cf"}


            {#each cfResults as result}
              <ModpackResult {...result} />
            {/each}


      {/if}

      </div>
      <div class="flex place-content-center">
        {#if allowLoadMore}
          <p
            on:click={() => {
              search(tab, true);
            }}
            class=" hover:link text-primary mt-2"
          >
            {$t("loadMore")}
          </p>
        {/if}
      </div>
      {/await}
 
  </div>
</div>
