<script lang="ts">
  import { browser } from "$app/environment";
  import { searchMods, searchPlugins, usingCurseForge } from "$lib/scripts/req";
  import ModpackResult from "./ModpackResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { numShort } from "$lib/scripts/utils";
  import { onMount } from "svelte";
  import { Plus } from "lucide-svelte";
  import { apiurl } from "$lib/scripts/req";
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
  let modpackImageUrl = "/images/placeholder.webp";
  let modpackName = "";
  let modpackVersion = "";
  onMount(() => {
    if (browser) {
      search("mr");
      if (usingCurseForge) search("cf");
      else document.getElementById("mr").classList.add("tab-active");
    }
  });
  if (browser) {
    if (!usingCurseForge) tab = "mr";
    //event listener for 'versionSet', which means a modpack has been selected
    window.addEventListener("versionSet", (e) => {
      if (e.detail != undefined) {
        console.log("detail", e.detail);
        let id = e.detail.id;
        if (e.detail.platform == "cf") {
          fetch(apiurl + "curseforge/" + id, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((res) => {
              modpackImageUrl = res.logo.thumbnailUrl;
              modpackName = res.name;
              modpackVersion = res.latestFiles[0].displayName;
            });
        } else if (e.detail.platform == "mr") {
          fetch("https://api.modrinth.com/v2/project/" + id, {
            method: "GET",
          })
            .then((res) => res.json())
            .then((res) => {
              modpackImageUrl = res.icon_url;
              modpackName = res.title;
              modpackVersion = res.versions[0].version;
            });
        }
        document.getElementById("setModpack").classList.add("hidden");
        document.getElementById("changeModpack").classList.remove("hidden");
      }
    });
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
        .value.split(" - ")[0]
        .toLowerCase();
      let version = document.getElementById("versionDropdown").value;
      if (document.getElementById("sortByDropdown") != null) {
        sortBy = document.getElementById("sortByDropdown").value;
      }
      switch (sortBy) {
        case $t("dropdown.sortBy.relevance"):
          sortBy = "relevance";
          break;

        case $t("dropdown.sortBy.downloads"):
          sortBy = "downloads";
          break;

        case $t("dropdown.sortBy.lastUpdated"):
          sortBy = "updated";
          break;
      }

      promise = searchMods(
        platform,
        software,
        version,
        query,
        "modpack",
        offset,
        sortBy,
        []
      ).then((response) => {
        if (platform == "mr") {
          skeletonsLength = response.hits.length;
          let results = [];

          response.hits.forEach((item) => {
            //prevents duplicate results
            let duplicates = false;
            for (let i in mrResults) {
              if (mrResults[i].id == item.id) {
                duplicates = true;
              }
            }
            if (!duplicates) {
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
            }
          });
          mrResults = results;
          console.log(mrResults);
        } else if (platform == "cf") {
          skeletonsLength = response.data.length;
          response.data.forEach((item) => {
            //prevents duplicate results
            let duplicates = false;
            for (let i in cfResults) {
              if (cfResults[i].id == item.id) {
                duplicates = true;
              }
            }
            if (!duplicates) {
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
            }
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

<div id="changeModpack" class="hidden flex space-x-2.5 w-[30rem]">
  <div class="flex">
    <img src={modpackImageUrl} class="w-12 h-12 rounded-l-lg bg-base-300" />
    <div
      class="rounded-r-lg bg-base-200 h-12 flex flex-col justify-between pl-2 pb-1.5 pt-0.5 pr-1"
    >
      <p class="truncate w-[10.65rem]">{modpackName}</p>
      <p class="text-xs text-gray-600 truncate w-[10.65rem]">
        {modpackVersion}
      </p>
    </div>
  </div>
  <label for="modpacksModal" class="btn btn-primary w-[15rem]"
    >Change Modpack</label
  >
</div>

<label id="setModpack" for="modpacksModal" class="btn btn-primary btn-block"
  >{$t("button.modpacks")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="modpacksModal" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div
    id="addModpackModalScroll"
    class="modal-box bg-opacity-95 backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-[61.5rem]"
  >
    <div class="flex justify-between">
      <label
        for="modpacksModal"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >

      <div class="tabs tabs-boxed">
        <button id="mr" on:click={mr} class="tab">Modrinth</button>
        {#if usingCurseForge}
          <button id="cf" on:click={cf} class="tab tab-active"
            >Curseforge</button
          >
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
        {$t("sortBy")}<select
          id="sortByDropdown"
          class="select select-sm ml-2 bg-base-300"
          on:change={() => search(tab)}
        >
          <option>{$t("dropdown.sortBy.relevance")}</option>
          <option>{$t("dropdown.sortBy.downloads")}</option>
          <option>{$t("dropdown.sortBy.lastUpdated")}</option></select
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
