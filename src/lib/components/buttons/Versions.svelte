<script lang="ts">
  import { browser } from "$app/environment";
  import { AlertTriangle, ArrowDownCircle } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import { updateServer } from "../../scripts/req";
  import AccountButton from "./AccountButton.svelte";
  let latestUpdate = "";
  let version = "";
  let serverAddons = [];
  let areWorldgenMods = true;
  let updateReady = true;
  let serverVersion = "";
  let serverSoftware = "";
  let jarsIndex = {};

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
      if (page != "/") {
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

    fetch("https://api.jarsmc.xyz/jars/arthHosting")
      .then((x) => x.json())
      .then((x) => {
        jarsIndex = x;
        let html = "";
        if (jarsIndex[serverSoftware.toLowerCase()] != undefined) {
          jarsIndex[serverSoftware.toLowerCase()].forEach((x) => {
            if (x.version != serverVersion) {
              html +=
                "<option value=" + x.version + ">" + x.version + "</option>";
            }
          });
          document.getElementById("versionDropdown").innerHTML = html;
          checkV();
        }
      });
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
        let worldgenMod = jarsIndex[item.toLowerCase()];
        worldgenMod.forEach((x) => {
          if (x.version == version) {
            updateReady = true;
            /* This doesnt work for some reason if you add the grayscale class to every image by default.
          document
            .getElementById(item + "Versions")
            .classList.remove("grayscale");
            */
          }
        });
      });
    } else {
      updateReady = true;
    }
  }

  function onclick() {
    serverVersion = localStorage.getItem("serverVersion");
    fetch("https://api.jarsmc.xyz/jars/arthHosting")
      .then((x) => x.json())
      .then((x) => {
        jarsIndex = x;
        let html = "";
        if (jarsIndex[serverSoftware.toLowerCase()] != undefined) {
          jarsIndex[serverSoftware.toLowerCase()].forEach((x) => {
            if (x.version != serverVersion) {
              html +=
                "<option value=" + x.version + ">" + x.version + "</option>";
            }
          });
          document.getElementById("versionDropdown").innerHTML = html;
          checkV();
        }
      });
  }
</script>

<label for="versionsModal" class="btn btn-neutral" on:click={onclick}
  ><ArrowDownCircle class="mr-2.5" />
  {$t("button.versions")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versionsModal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label
      for="versionsModal"
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
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
      class="bg-warning w-86 rounded-lg text-black p-2 py-0.5 flex items-center mb-2 space-x-2"
    >
      <AlertTriangle size="48" />
      <span class="text-sm">{$t("warning.changeVersion")}</span>
    </div>
    <div class="flex">
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
        Worldgen mods are not available on {version} yet. You can reset your world
        to one without worldgen mods in order to change to {version}.
      {/if}
    </div>

    {#if updateReady}
      <label on:click={update} for="versionsModal" id="confirmBtn" class="btn"
        >{$t("versions.title")}</label
      >
    {:else}
      <label
        on:click={update}
        for="versionsModal"
        id="confirmBtn"
        class="btn btn-disabled">{$t("versions.title")}</label
      >
    {/if}
  </div>
</div>
