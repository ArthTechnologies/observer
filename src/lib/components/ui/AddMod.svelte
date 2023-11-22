<script lang="ts">
  import { browser } from "$app/environment";
  import { numShort } from "$lib/scripts/numShort";
  import { searchMods } from "$lib/scripts/req";
  import ModResult from "./ModResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { onMount } from "svelte";
  import { Plus } from "lucide-svelte";
  import ResultSkele from "./ResultSkele.svelte";
  let promise;
  let cfResults = [];
  let mrResults = [];
  let query = "";
  let software;
  let version;
  let tab = "mr";
  let skeletonsLength = 15;
  let allowLoadMore = true;
  let offset = 0;
  let sortBy = "relevance";

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
  function search(platform: string, loadMore: boolean = false) {
    if (loadMore) {
      skeletonsLength = offset + 15;
      offset += 15;
    } else {
      if (skeletonsLength > 15) skeletonsLength = 15;
      if (platform == "cf") cfResults = [];
      else if (platform == "mr") mrResults = [];
    }
    if (platform == undefined) {
      platform = tab;
    }
    console.log("searching" + query);

    if (browser) {
      if (version == "latest") {
        version = "1.19.4";
      }

      promise = null;
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
        "mod",
        offset,
        sortBy
      ).then((response) => {
        if (platform == "mr") {
          skeletonsLength = response.hits.length;
          allowLoadMore = response.hits.length == 15;
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
          allowLoadMore = response.data.length == 15;
          response.data.forEach((item) => {
            console.log(item);
            console.log(numShort(item.downloadCount));
            let author = "Unknown";
            if (item.authors[0] != undefined) {
              author = item.authors[0].name;
            }
            cfResults.push({
              platform: "cf",
              name: item.name,
              desc: item.summary,
              icon: item.logo.thumbnailUrl,
              author: author,
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

<label
  for="my-modal-5"
  class="btn btn-neutral btn-block"
  on:click={() => search(tab)}>{$t("button.addmod")}</label
>

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
        <button id="mr" class="tab tab-active" on:click={mr}>Modrinth</button>
        <button id="cf" class="tab" on:click={cf}>Curseforge</button>
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
    <div id="mods" class="space-y-2">
      {#await promise}
        {#each Array.from({ length: skeletonsLength }) as _}
          <ResultSkele />
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
</div>
