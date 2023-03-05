<script>
  import { browser } from "$app/environment";
  import { searchPlugins } from "$lib/scripts/req";
  import ModResult from "./ModResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import FeaturedPlugin from "./FeaturedPlugin.svelte";
  let promise;
  let results = [];
  let query = "";
  function search() {
    console.log("searching" + query);
    results = [];
    if (browser) {
      let software = localStorage.getItem("serverSoftware");
      let version = localStorage.getItem("serverVersion");
      if (version == "latest") {
        version = "1.19.3";
      }

      setTimeout(function () {
        promise = searchPlugins(software, version, query).then((response) => {
          response.hits.forEach((item) => {
            results.push({
              name: item.title,
              desc: item.description,
              icon: item.icon_url,
              author: item.author,
              id: item.project_id,
            });
            console.log(results);
          });
        });
      }, 1);
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

<label for="my-modal-5" class="btn btn-block" on:click={search}>Add Mod</label>

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
      <div id="plugins" class="space-y-2">
        {#await promise then}
          {#each results as result}
            <ModResult {...result} />
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
      </div>
    {/if}
  </div>
</div>
