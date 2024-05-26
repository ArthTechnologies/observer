<script lang="ts">
  import { browser } from "$app/environment";
  import { AlertTriangle, ArrowDownCircle } from "lucide-svelte";
  import { apiurl } from "../../scripts/req";
  import { updateServer } from "../../scripts/req";
  import { t } from "$lib/scripts/i18n";
  let latestUpdate = "";
  let worldgenMods = [];
  let serverAddons = [];
  let areWorldgenMods = true;
  let updateReady = true;
  let serverVersion = "";
  let serverSoftware = "";
  let jarAvailable = false;

  function update() {
    if (updateReady && browser) {
      updateServer(localStorage.getItem("serverID"), latestUpdate);
      setTimeout(function () {
        serverVersion = localStorage.getItem("serverVersion");
      }, 1000);
    }
  }
  if (browser) {
    serverVersion = localStorage.getItem("serverVersion");
    serverSoftware = localStorage.getItem("serverSoftware");
    if (localStorage.getItem("serverAddons") != null) {
      serverAddons = localStorage.getItem("serverAddons").split(",");
    }

    if (serverAddons[0] == "") {
      areWorldgenMods = false;
    }

    console.log(serverAddons);

    fetch(apiurl + "info/jars")
      .then((x) => x.json())
      .then((x) => {
        console.log(x);
        if (
          x.includes(
            serverSoftware.toLowerCase() +
              "-" +
              latestUpdate.toLowerCase() +
              ".jar"
          )
        ) {
          jarAvailable = true;
        }
      });
    //fetch https://launchermeta.mojang.com/mc/game/version_manifest.json
    //get latest release version

    fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
      .then((x) => x.json())
      .then((x) => {
        latestUpdate = x.latest.release;
        fetch(apiurl + "info/worldgenMods?version=" + latestUpdate)
          .then((x) => x.json())
          .then((x) => {
            console.log("x" + x);
            worldgenMods = x;
            //for each worldgen mod
            if (areWorldgenMods) {
              for (var i = 0; i < worldgenMods.length; i++) {
                //display the mod's image
                if (browser && serverAddons.includes(worldgenMods[i])) {
                  console.log(worldgenMods[i]);
                  console.log(worldgenMods);
                  document
                    .getElementById(worldgenMods[i] + "Updates")
                    .classList.remove("grayscale");
                }
              }
              for (var i = 0; i < serverAddons.length; i++) {
                console.log(
                  "worldgenb" +
                    worldgenMods +
                    worldgenMods.includes(serverAddons[i])
                );
                if (!worldgenMods.includes(serverAddons[i])) {
                  updateReady = false;
                  //add class disabled to id "confirmBtn"
                  if (browser) {
                    document
                      .getElementById("confirmBtn")
                      .classList.add("btn-disabled");
                  }
                }
              }
            }
          });
      });
  }

  function onclick() {
    serverVersion = localStorage.getItem("serverVersion");
  }
</script>

{#if latestUpdate != serverVersion && jarAvailable && serverSoftware != "Forge"}
  <label for="updates" class="btn btn-neutral" on:click={onclick}
    ><ArrowDownCircle class="mr-2.5" />
    {$t("button.update")}</label
  >
{/if}
<!-- Put this part before </body> tag -->
<input type="checkbox" id="updates" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="updates"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-xl font-bold mb-2">{latestUpdate} {$t("update")}</h3>
    {#if serverSoftware == "Forge" || serverSoftware == "Quilt" || serverSoftware == "Fabric"}
      <div
        class="bg-warning w-86 rounded-lg text-black p-2 py-0.5 flex items-center space-x-2"
      >
        <AlertTriangle size="48" />
        <span class="text-sm">{$t("warning.updateModded")}</span>
      </div>
    {/if}
    <div class="flex justify-center">
      {#if areWorldgenMods}
        {#each serverAddons as addon}
          <img
            id="{addon}Updates"
            class="mask mask-hexagon grayscale"
            src="/images/{addon}.webp"
            width="80ch"
          />
        {/each}
      {/if}
    </div>

    {#if updateReady}
      <p class="text-center my-3">
        {#if areWorldgenMods}
          {$t("update.worldgenReady")} {latestUpdate}.
        {:else}
          {$t("changeVersion.readyToUpdate")} {latestUpdate}.
        {/if}
      </p>
    {:else}
      <p class="text-center">
        {#if areWorldgenMods}
          {$t("update.worldgenNotReady")}
          {latestUpdate}
          {$t("update.worldgenNotReady2")}
        {:else}
          {$t("update.cantUpdate")} {latestUpdate}.
        {/if}
      </p>
    {/if}
    <label
      on:click={update}
      for="updates"
      id="confirmBtn"
      class="btn btn-neutral">{$t("button.update")}</label
    >
  </div>
</div>
