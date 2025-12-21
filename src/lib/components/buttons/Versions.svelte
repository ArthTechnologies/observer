<script lang="ts">
  import { browser } from "$app/environment";
  import { AlertTriangle, ArrowDownCircle } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl, updateServer } from "../../scripts/req";
  import AccountButton from "./AccountButton.svelte";
  let latestUpdate = "";
  let version = "";
  let serverAddons = [];
  let areWorldgenMods = true;
  let updateReady = true;
  let serverVersion = "";
  let serverSoftware = "";
  let jarsList = [];
  let availableVersions = [];

  function update() {
    if (updateReady && browser) {
      updateServer(localStorage.getItem("serverID"), version);
    }
  }
  if (browser) {

    //this interval runs checkV in case the users has gone to a different
    //server, where there might be a different amount of worldgen mods.

    setInterval(() => {
      let page = location.pathname;
      if (page != "/" && serverSoftware != "Forge") {
        checkV();
      }
    }, 500);

    serverVersion = localStorage.getItem("serverVersion");
    serverSoftware = localStorage.getItem("serverSoftware");

    if (localStorage.getItem("serverAddons") != null) {
      serverAddons = localStorage.getItem("serverAddons").split(",");
    }

    if (serverAddons[0] == "") {
      areWorldgenMods = false;
    }

  }
  export function checkV() {
    version = document.getElementById("versionDropdown").value;
    if (localStorage.getItem("serverAddons") != null) {
      serverAddons = localStorage.getItem("serverAddons").split(",");
    }
    areWorldgenMods = true;
    if (serverAddons[0] == "") {
      areWorldgenMods = false;
    }
    updateReady = false;
    if (areWorldgenMods) {
      serverAddons.forEach((item) => {
        // Check if any variant of this mod exists for the selected version
        const modExists = jarsList.some(jar =>
          jar.startsWith(item.toLowerCase() + "-" + version + "-")
        );

        if (modExists) {
          updateReady = true;
        }
      });
    } else {
      updateReady = true;
    }
  }

  function onclick() {
    if (browser) {
      let html = "";
    serverVersion = localStorage.getItem("serverVersion");
    fetch(apiurl + "info/jars")
      .then((x) => x.json())
      .then((x) => {
        jarsList = x;
        for (let i in jarsList) {
          const match = jarsList[i].match(/^([a-zA-Z]+)-(\d+(?:\.\d+)*)-(\w+)\.(jar|zip)$/);
          if (!match) continue;

          const software = match[1];
          const version = match[2];
          const variant = match[3];

          if (software == serverSoftware.toLowerCase()) {
            if (version != serverVersion) {
              const displayText = variant === "release" ? version : `${version} ${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
              html += "<option value=" + version + ">" + displayText + "</option>";
            }
          }
        }
        document.getElementById("versionDropdown").innerHTML = html;
        checkV();
      });
    }
    /*fetch("https://api.jarsmc.xyz/jars/")
      .then((x) => x.json())
      .then((x) => {
        jarsList = x;
        
        if (jarsList[serverSoftware.toLowerCase()] != undefined) {
          jarsList[serverSoftware.toLowerCase()].forEach((x) => {
            if (x.version != serverVersion) {
              html +=
                "<option value=" + x.version + ">" + x.version + "</option>";
            }
          });
          document.getElementById("versionDropdown").innerHTML = html;
          checkV();
        }
      });*/
    }
  
</script>

{#if serverSoftware != "Forge"}
  <label
    for="versionsmodal"
    style="margin:0rem;"
    class="btn btn-outline btn-ms "
    on:click={onclick}
    ><ArrowDownCircle size=20 />
    {$t("button.versions")}</label
  >

  <!-- Put this part before </body> tag -->
  <input
    type="checkbox"
    id="versionsmodal"
    style="margin:0rem;"
    class="modal-toggle"
  />
  <div class="modal" style="margin:0rem;">
    <div class="modal-box bg-opacity-95 backdrop-blur relative">
      <label
        for="versionsmodal"
        style="margin:0rem;"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >

      <h3 class="text-xl font-bold mb-2">{$t("versions.title")}</h3>
      <div class="form-control w-full max-w-xs mb-4">
        <label class="label">{$t("versions.l.pickVersion")}</label>
        <select
          class="select select-bordered"
          id="versionDropdown"
          on:change={checkV}
        >
          <option disabled selected>Loading...</option>
        </select>
      </div>
      <div
        class="bg-warning w-86 rounded-lg text-black p-2 py-0.5 flex items-center mb-3 space-x-2"
      >
        <AlertTriangle size="48" />
        <span class="text-sm">{$t("warning.changeVersion")}</span>
      </div>
      <div class="flex my-2">
        {#if areWorldgenMods}
          {#each serverAddons as addon}
            {#if updateReady}
              <img
                id="{addon}Versions"
                class="mask mask-hexagon"
                src="/images/{addon}.webp"
                width="80ch"
              />
            {:else}
              <img
                id="{addon}Versions"
                class="mask mask-hexagon grayscale"
                src="/images/{addon}.webp"
                width="80ch"
              />
            {/if}
          {/each}
        {/if}
      </div>
      <div class="ml-4 mb-4 mt-1">
        {#if updateReady}
          {$t("changeVersion.readyToUpdate")} {version}.
        {:else}
          {$t("changeVersion.worldgenNotReady")}
          {version}
          {$t("changeVersion.worldgenNotReady2")}
          {version}.
        {/if}
      </div>

      {#if updateReady}
        <label
          on:click={update}
          for="versionsmodal"
          style="margin:0rem;"
          id="confirmBtn"
          class="btn btn-neutral">{$t("versions.title")}</label
        >
      {:else}
        <label
          on:click={update}
          for="versionsmodal"
          style="margin:0rem;"
          id="confirmBtn"
          class="btn btn-disabled">{$t("versions.title")}</label
        >
      {/if}
    </div>
  </div>
{/if}
