<script lang="ts">
  import { browser } from "$app/environment";
  import { ArrowDownCircle } from "lucide-svelte";
  import { apiurl } from "../../scripts/req";
  import { updateServer } from "../../scripts/req";
  import AccountButton from "./AccountButton.svelte";
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
  }
  console.log(serverAddons);

  fetch(apiurl + "servers/jars")
    .then((x) => x.json())
    .then((x) => {
      console.log(x);
      if (
        x.includes(
          serverSoftware.toLowerCase() +
            "-" +
            serverVersion.toLowerCase() +
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
      fetch(apiurl + "servers/worldgenMods?version=" + latestUpdate)
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
                  .getElementById(worldgenMods[i])
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

  //reminder to self: use the servers/worldgenMods route to get which mods are ready, display images and make non-ready mods grayscale.
</script>

{#if latestUpdate != serverVersion && jarAvailable}
  <label for="updates" class="btn btn-neutral"
    ><ArrowDownCircle class="mr-2.5" />
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
      {#if areWorldgenMods}
        {#each serverAddons as addon}
          <img
            id={addon}
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
          All of your worldgen mods are ready for {latestUpdate}.
        {:else}
          Your server is ready for {latestUpdate}.
        {/if}
      </p>
    {:else}
      <p class="text-center">
        {#if areWorldgenMods}
          Not all of your worldgen mods have updated to {latestUpdate} yet. Check
          back in a few days.
        {:else}
          Your server can't update to {latestUpdate}.
        {/if}
      </p>
    {/if}
    <label on:click={update} for="updates" id="confirmBtn" class="btn"
      >Update</label
    >
  </div>
</div>
