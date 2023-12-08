<script>
  import { browser } from "$app/environment";
  import { searchPlugins } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { numShort } from "$lib/scripts/utils";
  import { onMount } from "svelte";
  import ResultSkele from "$lib/components/ui/ResultSkele.svelte";
  let promise;
  let results = [];
  let query = "";
  let skeletonsLength = 15;
  let allowLoadMore = true;
  let offset = 0;
  let sortBy = "relevance";
  onMount(() => {
    if (browser) {
      search(false);
    }
  });

  function search(loadMore = false) {
    if (loadMore) {
      skeletonsLength = offset + 15;
      offset += 15;
    } else {
      if (skeletonsLength > 15) skeletonsLength = 15;
      results = [];
      offset = 0;
    }
    console.log("searching" + query);

    if (browser) {
      let software = localStorage.getItem("serverSoftware");
      let version = localStorage.getItem("serverVersion");
      if (software == "Velocity") {
        version = localStorage.getItem("latestVersion");
      }
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

      promise = searchPlugins(software, version, query, offset, sortBy).then(
        (response) => {
          skeletonsLength = response.hits.length;
          allowLoadMore = response.hits.length == 15;
          response.hits.forEach((item) => {
            results.push({
              name: item.title,
              desc: item.description,
              icon: item.icon_url,
              author: item.author,
              id: item.project_id,
              downloads: numShort(item.downloads),
            });
            console.log(results);
          });
        }
      );

      document.getElementById("plugins").innerHTML = "";
    }
  }

  let tab = "mr";
  function ft() {
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
  }
</script>

<label for="addPluginModal" class="btn btn-neutral btn-block" on:click={search}
  >{$t("button.addplugin")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="addPluginModal" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div
    id="addPluginModalScroll"
    class="modal-box bg-opacity-95 backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-[50rem]"
  >
    <div class="flex justify-between">
      <label
        for="addPluginModal"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >

      <div class="tabs tabs-boxed">
        <button id="ft" on:click={ft} class="tab">{$t("featured")}</button>
        <button id="mr" on:click={mr} class="tab tab-active">Modrinth</button>
      </div>
    </div>
    {#if tab == "mr"}
      <div class="flex justify-between space-x-2">
        <input
          bind:value={query}
          on:input={() => {
            search(false);
          }}
          type="text"
          placeholder={$t("search")}
          class="searchBar input input-bordered input-sm max-sm:w-32"
          id="search"
        />
        <div class="flex items-center">
          {$t("sortBy")}<select
            id="sortByDropdown"
            class="select select-sm ml-2 bg-base-300"
            on:change={() => {
              search(false);
            }}
          >
            <option>{$t("dropdown.sortBy.relevance")}</option>
            <option>{$t("dropdown.sortBy.downloads")}</option>
            <option>{$t("dropdown.sortBy.lastUpdated")}</option></select
          >
        </div>
      </div>
      <div id="plugins" class="space-y-2">
        {#await promise}
          {#each Array.from({ length: skeletonsLength }) as _}
            <ResultSkele />
          {/each}
        {:then}
          {#each results as result}
            <PluginResult {...result} />
          {/each}
          <div class="flex place-content-center">
            {#if allowLoadMore}
              <p
                on:click={() => {
                  search(true);
                }}
                class=" hover:link text-primary mt-2"
              >
                {$t("loadMore")}
              </p>
            {/if}
          </div>
        {/await}
      </div>
    {:else if tab == "ft"}
      <div class="space-y-2">
        <FeaturedPlugin
          icon="https://www.spigotmc.org/data/resource_icons/34/34315.jpg?1483592228"
          name="Vault"
          desc="Vault is a Permissions, Chat, & Economy API required by many plugins."
          author="milkbowl"
          authorLink="https://github.com/MilkBowl"
          pluginId="MilkBowl/Vault"
          link="https://github.com/MilkBowl/Vault/releases/download/1.7.3/Vault.jar"
          disclaimer="This plugin has not been tested on minecraft versions before 1.13."
        />

        <PluginResult
          name="WorldEdit (FAWE)"
          author="NotMyFault"
          desc="Blazingly fast world manipulation for artists, builders and everyone else."
          icon="https://cdn.modrinth.com/data/z4HZZnLr/1dab3e5596f37ade9a65f3587254ff61a9cf3c43.svg"
          id="z4HZZnLr"
          downloads="null"
        />
      </div>
    {/if}
  </div>
</div>
