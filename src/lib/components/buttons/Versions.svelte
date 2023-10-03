<script lang="ts">
  import { browser } from "$app/environment";
  import { ArrowDownCircle } from "lucide-svelte";
  import { apiurl } from "../../scripts/req";
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
    let page = location.pathname;
    setInterval(() => {
      if (page != location.pathname) {
        page = location.pathname;
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
  function checkV() {
    if (localStorage.getItem("serverAddons") != null) {
      serverAddons = localStorage.getItem("serverAddons").split(",");
    }
    areWorldgenMods = true;
    if (serverAddons[0] == "") {
      areWorldgenMods = false;
    }
    updateReady = true;
    version = document.getElementById("versionDropdown").value;
    serverAddons.forEach((item) => {
      let worldgenMod = jarsIndex[item.toLowerCase()];
      if (!JSON.stringify(worldgenMod).includes(version)) {
        updateReady = false;
      } else {
        console.error(document.getElementById(item).classList);
      }
    });
  }
</script>

<label for="versionsModal" class="btn btn-neutral"
  ><ArrowDownCircle class="mr-2.5" />
  Versions</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versionsModal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label
      for="versionsModal"
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
    >

    <h3 class="text-xl font-bold mb-2">Change Version</h3>
    <div class="form-control w-full max-w-xs mb-4">
      <label class="label"> Pick Version </label>
      <select
        class="select select-bordered"
        id="versionDropdown"
        on:change={checkV}
      >
        <option disabled selected>Loading...</option>
      </select>
    </div>
    <div class="flex">
      {#if areWorldgenMods}
        {#each serverAddons as addon}
          {#if updateReady}
            <img
              id={addon}
              class="mask mask-hexagon"
              src="/images/{addon}.webp"
              width="80ch"
            />
          {:else}
            <img
              id={addon}
              class="mask mask-hexagon grayscale"
              src="/images/{addon}.webp"
              width="80ch"
            />
          {/if}
        {/each}
      {/if}
    </div>
    <div class="ml-4 mt-2 mb-4">
      {#if updateReady}
        Your server is ready to update to {version}.
      {:else}
        Worldgen mods are not available on {version} yet. You can reset your world
        to one without worldgen mods in order to change to {version}.
      {/if}
    </div>

    {#if updateReady}
      <label on:click={update} for="versionsModal" id="confirmBtn" class="btn"
        >Change Version</label
      >
    {:else}
      <label
        on:click={update}
        for="versionsModal"
        id="confirmBtn"
        class="btn btn-disabled">Change Version</label
      >
    {/if}
  </div>
</div>
