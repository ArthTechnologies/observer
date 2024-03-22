<script lang="ts">
  import { browser } from "$app/environment";
  import { numShort } from "$lib/scripts/utils";
  import { searchMods, usingCurseForge } from "$lib/scripts/req";
  import ModResult from "./ModResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { onMount } from "svelte";
  import {
    BookIcon,
    Globe2,
    MapIcon,
    MessageCircle,
    Plus,
  } from "lucide-svelte";
  import ResultSkele from "./ResultSkele.svelte";
  import {
    Archive,
    Award,
    Book,
    Briefcase,
    Bug,
    Carrot,
    CircleOff,
    CloudLightning,
    Compass,
    DollarSign,
    Filter,
    FilterX,
    Globe,
    HardDrive,
    HomeIcon,
    Server,
    SlidersHorizontal,
    Squirrel,
    Swords,
    Truck,
    Wand,
    X,
    Zap,
  } from "lucide-svelte";
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
  let categories = [];

  function toggleCategory(category) {
    let categoryFound = false;
    for (let i in categories) {
      if (categories[i] == category) {
        categories.splice(i, 1);
        categoryFound = true;
      }
    }
    if (!categoryFound) {
      categories.push(category);
    }
    search(tab);
  }

  if (browser) {
    software = localStorage.getItem("serverSoftware");
    version = localStorage.getItem("serverVersion");
  }
  onMount(() => {
    if (browser) {
      //uncheck every checkbox
      let checkboxes = document.getElementsByClassName("checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
    }
    if (software.toLowerCase() == "forge" && usingCurseForge) {
      cf();
    }
  });
  search("mr");
  if (usingCurseForge) search("cf");
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
        "mod",
        offset,
        sortBy,
        categories,
      ).then((response) => {
        if (platform == "mr") {
          skeletonsLength = response.hits.length;
          allowLoadMore = response.hits.length == 15;

          response.hits.forEach((item) => {
            //prevents duplicate results
            let duplicates = false;
            for (let i in mrResults) {
              if (mrResults[i].id == item.id) {
                duplicates = true;
              }
            }
            if (!duplicates) {
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
            }
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
                author: author,
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
      categories = [];
      //uncheck every checkbox
      let checkboxes = document.getElementsByClassName("checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      tab = "mr";
      document.getElementById("mr").classList.add("tab-active");
      document.getElementById("cf").classList.remove("tab-active");
    }
  }
  function cf() {
    if (browser) {
      categories = [];
      //uncheck every checkbox
      let checkboxes = document.getElementsByClassName("checkbox");
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
      }
      tab = "cf";
      document.getElementById("cf").classList.add("tab-active");
      document.getElementById("mr").classList.remove("tab-active");
    }
  }
</script>

<label
  for="addModModal"
  class="btn btn-neutral btn-block"
  on:click={() => search(tab)}>{$t("button.addmod")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="addModModal" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div
    id="addModModalScroll"
    class="modal-box bg-opacity-95 backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-[61.5rem]"
  >
    <div class="flex justify-between">
      <label
        for="addModModal"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >

      <div class="tabs tabs-boxed">
        <button id="mr" class="tab tab-active" on:click={mr}>Modrinth</button>
        {#if usingCurseForge}
          <button id="cf" class="tab" on:click={cf}>Curseforge</button>
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
    {#if tab == "mr"}
      <div class="flex max-md:flex-col md:space-x-4">
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("adventure")}
            />
            <Compass size="18" />
            <p>Adventure</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("cursed")}
            />
            <Bug size="18" />
            <p>Cursed</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("decoration")}
            />
            <HomeIcon size="18" />
            <p>Decoration</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("economy")}
            />
            <DollarSign size="18" />
            <p>Economy</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("social")}
            />
            <MessageCircle size="18" />
            <p>Social</p>
          </div>
        </div>
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("equipment")}
            />
            <Swords size="18" />
            <p>Equipment</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("food")}
            />
            <Carrot size="18" />
            <p>Food</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("game mechanics")}
            />
            <SlidersHorizontal size="18" />
            <p>Game Mechanics</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("library")}
            />
            <Book size="18" />
            <p>Library</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("magic")}
            />
            <Wand size="18" />
            <p>Magic</p>
          </div>
        </div>
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("management")}
            />
            <Server size="18" />
            <p>Management</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("minigame")}
            />
            <Award size="18" />
            <p>Minigame</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("mobs")}
            />
            <Squirrel size="18" />
            <p>Mobs</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("optimization")}
            />
            <Zap size="18" />
            <p>Optimization</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("storage")}
            />
            <Archive size="18" />
            <p>Storage</p>
          </div>
        </div>
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("technology")}
            />
            <HardDrive size="18" />
            <p>Technology</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("transportation")}
            />
            <Truck size="18" />
            <p>Transportation</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("utility")}
            />
            <Briefcase size="18" />
            <p>Utility</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("worldgen")}
            />
            <Globe2 size="18" />
            <p>Worldgen</p>
          </div>
        </div>
      </div>
    {:else if tab == "cf"}
      <div class="flex max-md:flex-col md:space-x-4 hidden">
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("422")}
            />
            <Compass size="18" />
            <p>Adventure</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("423")}
            />
            <MapIcon size="18" />
            <p>Maps & Info</p>
          </div>
        </div>

        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("421")}
            />
            <Book size="18" />
            <p>Library</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("6814")}
            />
            <Zap size="18" />
            <p>Optimization</p>
          </div>
        </div>
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("436")}
            />
            <Carrot size="18" />
            <p>Food</p>
          </div>
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("412")}
            />
            <HardDrive size="18" />
            <p>Technology</p>
          </div>
        </div>
        <div class="flex flex-col items-left">
          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("419")}
            />
            <Wand size="18" />
            <p>Magic</p>
          </div>

          <div class="flex items-center space-x-1">
            <input
              type="checkbox"
              class="checkbox checkbox-xs mr-0.5"
              on:click={() => toggleCategory("406")}
            />
            <Globe2 size="18" />
            <p>Worldgen</p>
          </div>
        </div>
      </div>
    {/if}
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
