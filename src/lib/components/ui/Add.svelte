<script>
  import { browser } from "$app/environment";
  import { searchPlugins } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { numShort } from "$lib/scripts/numShort";
  let promise;
  let results = [];
  let query = "";
  let skeletonsLength = 15;
  let resultGroupsLoaded = 0;
  function search() {
    resultGroupsLoaded = 1;
    skeletonsLength = 15;
    console.log("searching" + query);
    results = [];
    if (browser) {
      let software = localStorage.getItem("serverSoftware");
      let version = localStorage.getItem("serverVersion");
      if (software == "Velocity") {
        version = localStorage.getItem("latestVersion");
      }

      setTimeout(function () {
        promise = searchPlugins(software, version, query, 0).then(
          (response) => {
            skeletonsLength = response.hits.length;
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
      }, 1);
      document.getElementById("plugins").innerHTML = "";
    }
  }

  function loadMore() {
    resultGroupsLoaded++;
    skeletonsLength = resultGroupsLoaded * 15;
    console.log("searching" + query);
    if (browser) {
      let software = localStorage.getItem("serverSoftware");
      let version = localStorage.getItem("serverVersion");
      if (software == "Velocity") {
        version = localStorage.getItem("latestVersion");
      }

      setTimeout(function () {
        promise = searchPlugins(
          software,
          version,
          query,
          (resultGroupsLoaded - 1) * 15
        ).then((response) => {
          skeletonsLength = response.hits.length;
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
        });
      }, 1);
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

<label for="my-modal-5" class="btn btn-neutral btn-block" on:click={search}
  >{$t("button.addplugin")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="my-modal-5" class="modal-toggle" />
<div class="modal">
  <div
    class="modal-box bg-opacity-95 backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-[50rem]"
  >
    <div class="flex justify-between">
      <label
        for="my-modal-5"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >

      <div class="tabs tabs-boxed">
        <button id="ft" on:click={ft} class="tab">{$t("featured")}</button>
        <button id="mr" on:click={mr} class="tab tab-active">Modrinth</button>
      </div>
    </div>
    {#if tab == "mr"}
      <div>
        <input
          bind:value={query}
          on:keypress={search}
          type="text"
          placeholder={$t("search")}
          class="searchBar input input-bordered input-sm"
          id="search"
        />
      </div>
      <div id="plugins" class="space-y-2">
        {#await promise}
          {#each Array.from({ length: skeletonsLength }) as _}
            <div class="bg-base-200 h-[6.875rem] p-3 rounded-lg flex space-x-3">
              <div
                class="w-14 h-14 md:w-20 md:h-20 bg-slate-700 animate-pulse w-[3.35rem] h-14 rounded-lg"
              />
              <div class="flex flex-col justify-between pt-1.5 pb-0.5">
                <div class="flex space-x-1 items-end">
                  <div
                    class="bg-slate-700 animate-pulse w-[10rem] h-4 rounded-lg"
                  />
                  <div
                    class="bg-slate-700 animate-pulse w-[5rem] h-3 rounded-lg"
                  />
                </div>
                <div
                  class="bg-slate-700 animate-pulse w-[17.5rem] h-3.5 rounded-lg"
                />
                <div
                  class="bg-slate-700 animate-pulse w-[5.68rem] h-7 rounded-lg"
                />
              </div>
            </div>
          {/each}
        {:then}
          {#each results as result}
            <PluginResult {...result} />
          {/each}
          <div class="flex place-content-center">
            <p on:click={loadMore} class=" hover:link text-primary mt-2">
              {$t("loadMore")}
            </p>
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
          downloads="9.6k"
        />
      </div>
    {/if}
  </div>
</div>
