<script lang="ts">
  import { browser } from "$app/environment";
  import { apiurl } from "../../scripts/req";
  import { updateServer } from "../../scripts/req";
  import AccountButton from "./AccountButton.svelte";
  let latestUpdate = "";
  let worldgenMods = [];
  let serverAddons = [];
  let updateReady = true;
  let serverVersion = "";

  function update() {
    if (updateReady && browser) {
      updateServer(localStorage.getItem("serverID"), latestUpdate);
    }
  }
  if (browser) {
    serverVersion = localStorage.getItem("serverVersion");
    serverAddons = localStorage.getItem("serverAddons").split(",");
  }
  console.log(serverAddons);
  //fetch https://launchermeta.mojang.com/mc/game/version_manifest.json
  //get latest release version

  fetch("https://launchermeta.mojang.com/mc/game/version_manifest.json")
    .then((x) => x.json())
    .then((x) => {
      latestUpdate = x.latest.release;
      fetch(apiurl + "servers/worldgenMods?version=" + latestUpdate)
        .then((x) => x.json())
        .then((x) => {
          console.log(x);
          worldgenMods = x;
          //for each worldgen mod
          for (var i = 0; i < worldgenMods.length; i++) {
            //display the mod's image
            if (browser && serverAddons.includes(worldgenMods[i])) {
              console.log(worldgenMods[i]);
              console.log(worldgenMods);
              document
                .getElementById(worldgenMods[i])
                .classList.remove("grayscale");
            }
          }
          for (var i = 0; i < serverAddons.length; i++) {
            console.log(worldgenMods.includes(serverAddons[i]));
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
        });
    });

  //reminder to self: use the servers/worldgenMods route to get which mods are ready, display images and make non-ready mods grayscale.
</script>

{#if latestUpdate != serverVersion}
  <label for="updates" class="btn btn-neutral"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-arrow-down-circle mr-2.5"
      ><circle cx="12" cy="12" r="10" /><polyline
        points="8 12 12 16 16 12"
      /><line x1="12" y1="8" x2="12" y2="16" /></svg
    >
    Update</label
  >
{/if}
<!-- Put this part before </body> tag -->
<input type="checkbox" id="updates" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="updates" class="btn btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <h3 class="text-xl font-bold mb-2">{latestUpdate} Update</h3>
    <div class="flex justify-center">
      <img
        id="terralith"
        class="mask mask-hexagon grayscale"
        src="/images/terralith.webp"
        width="80ch"
      />
      <img
        id="incendium"
        class="mask mask-hexagon grayscale"
        src="/images/incendium.webp"
        width="80ch"
      />
      <img
        id="nullscape"
        class="mask mask-hexagon grayscale"
        src="/images/nullscape.webp"
        width="80ch"
      />
      <img
        id="structory"
        class="mask mask-hexagon grayscale"
        src="/images/structory.webp"
        width="80ch"
      />
    </div>
    {#if updateReady}
      <p class="text-center my-3">
        All of your worldgen mods are ready for {latestUpdate}.
      </p>
    {:else}
      <p class="text-center">
        Not all of your worldgen mods have been updated to {latestUpdate} yet. Check
        back in a few days.
      </p>
    {/if}
    <label on:click={update} for="updates" id="confirmBtn" class="btn"
      >Update</label
    >
  </div>
</div>
