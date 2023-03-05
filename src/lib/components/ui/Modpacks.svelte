<script>
  import { browser } from "$app/environment";
  import { searchMods, searchPlugins } from "$lib/scripts/req";
  import ModpackResult from "./ModpackResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  import { numShort } from "$lib/scripts/numShort";

  let promise;
  let results = [];
  let query = "";
  function search() {
    console.log("searching" + query);
    results = [];
    if (browser) {
      let software = document
        .getElementById("softwareDropdown")
        .value.toLowerCase();
      let version = "1.19.3";

      setTimeout(function () {
        promise = searchMods(software, version, query, "modpack").then(
          (response) => {
            response.hits.forEach((item) => {
              results.push({
                name: item.title,
                desc: item.description,
                icon: item.icon_url,
                author: item.author,
                id: item.project_id,
                client: item.client_side,
                downloads: numShort(item.downloads),
              });
              console.log(results);
            });
          }
        );
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

<label for="my-modal-5" class="btn btn-block mt-5" on:click={search}
  >Use Modpack</label
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
        <button id="mr" on:click={mr} class="tab tab-active"
          >{$t("search")}</button
        >
      </div>
    </div>
    {#if tab == "mr"}
      <div>
        <input
          bind:value={query}
          on:keypress={search}
          type="text"
          placeholder="{$t('search')} Modrinth"
          class="searchBar input input-bordered input-sm"
          id="search"
        />
      </div>
      <div id="modpacks" class="space-y-2">
        {#await promise then}
          {#each results as result}
            <ModpackResult {...result} />
          {/each}
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
        <FeaturedPlugin
          icon="https://media.forgecdn.net/avatars/thumbnails/493/419/64/64/637803056128514812.png"
          name="Squaremap"
          desc="
  
            A minimalistic and lightweight world map viewer for Minecraft servers, using the vanilla map rendering style "
          author="jpenilla"
          authorLink="https://github.com/jpenilla"
          pluginId="jpenilla/squaremap"
          link="https://github.com/jpenilla/squaremap/releases/download/v1.1.9/squaremap-paper-mc1.19.3-1.1.9.jar"
          disclaimer="This plugin only supports the latest minecraft version."
        />
        <ModpackResult
          name="WorldEdit (FAWE)"
          author="NotMyFault"
          desc="Blazingly fast world manipulation for artists, builders and everyone else."
          icon="https://cdn.modrinth.com/data/z4HZZnLr/1dab3e5596f37ade9a65f3587254ff61a9cf3c43.svg"
          id="z4HZZnLr"
        />
      </div>
    {/if}
  </div>
</div>
