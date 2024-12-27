<script lang="ts">
  import { browser } from "$app/environment";
  import { AlertTriangle, ArrowDownCircle } from "lucide-svelte";
  import { apiurl } from "../../scripts/req";
  import { updateServer } from "../../scripts/req";
  import { t } from "$lib/scripts/i18n";
  let worldgenMods = [];
  let latestUpdate = "1.19.4";
  let serverAddons = [];
  let areWorldgenMods = true;
  let updateReady = true;
  let serverVersion = "";
  let serverSoftware = "";
  let newerVersionAvailable = false;

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
        let worldgenModsAvailable = 0;
        for (let i in x) {
          let software = x[i].split("-")[0];
          let version = x[i].split("-")[1].split(".jar")[0].split("*")[0].split(".zip")[0];
          if (software == serverSoftware.toLowerCase()) {
            if (version != serverVersion) {
              let versionPart1 = version.split(".")[0];
              let versionPart2 = version.split(".")[1];
              let versionPart3 = version.split(".")[2];
              let serverVersionPart1 = serverVersion.split(".")[0];
              let serverVersionPart2 = serverVersion.split(".")[1];
              let serverVersionPart3 = serverVersion.split(".")[2];
              
              let part1diff = versionPart1 - serverVersionPart1;
              let part2diff = versionPart2 - serverVersionPart2;
              let part3diff = versionPart3 - serverVersionPart3;
              if (
                part1diff > 0 ||
                (part1diff == 0 && part2diff > 0) ||
                (part1diff == 0 && part2diff == 0 && part3diff > 0)
              ) {
                latestUpdate = version;
                newerVersionAvailable = true;
              }
            }
          }
          //Worldgen Check
          if (areWorldgenMods) {
            serverAddons.forEach((item) => {
              console.log(item + " " + software + version);
              if (software == item.toLowerCase()) {
                if (version == serverVersion) {
                  worldgenModsAvailable++;
                  //remove grayscale
                  document
                    .getElementById(item + "Updates")
                    .classList.remove("grayscale");
                }
              }
            });
          }
        }
        console.log(worldgenModsAvailable + " " + serverAddons.length);
        updateReady = serverAddons.length == worldgenModsAvailable;

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
    
    
  }

  function onclick() {
    serverVersion = localStorage.getItem("serverVersion");
  }
</script>
{#if newerVersionAvailable && serverSoftware != "Forge"}
  <label for="updates" class="btn btn-neutral btn-sm" on:click={onclick}
    ><ArrowDownCircle class="mr-1.5" size=18/>
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
