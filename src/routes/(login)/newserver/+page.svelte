<script lang="ts">
  import { createServer } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import Helper from "$lib/components/ui/Helper.svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import Modpacks from "$lib/components/ui/Modpacks.svelte";
  import ModpackVersion from "$lib/components/ui/ModpackVersion.svelte";
  let version = "Latest";
  export let software = "Paper (Reccomended)";
  export let snapshot = false;
  let name = "";
  let gamemode: string;
  let admin = "";
  let modpacks = false;
  let modpackURL = "";
  function send() {
    let addons = [];
    let cmd = [];
    let sSoftware = software;
    let sVersion: string;
    switch (sSoftware) {
      case "Paper (Reccomended)":
        sSoftware = "paper";
        break;
      case "Latest Snapshot":
        sSoftware = "snapshot";
        break;
    }

    sSoftware = sSoftware.charAt(0).toLowerCase() + sSoftware.slice(1);
    sVersion = version.charAt(0).toLowerCase() + version.slice(1);

    if (worldgen) {
      //for all 3 checkboxes, if checked, add their ids to the addons array
      if (document.getElementById("terralith").checked) {
        addons.push("terralith");
      }
      if (document.getElementById("incendium").checked) {
        addons.push("incendium");
      }
      if (document.getElementById("nullscape").checked) {
        addons.push("nullscape");
      }
      if (document.getElementById("structory").checked) {
        addons.push("structory");
      }
    }

    cmd.push("op " + admin);
    cmd.push("defaultgamemode " + gamemode);

    console.log("cmd = " + cmd);

    console.log(browser && name != "");
    if (browser && name != "") {
      modpackURL = localStorage.getItem("modpackURL");

      console.log("creating" + sSoftware + "server...");
      createServer(name, sSoftware, sVersion, addons, cmd, modpackURL);
      //wait 1 second
      setTimeout(function () {
        localStorage.setItem("modpackURL", "");
        localStorage.setItem("modpackVersion", "");
        //if x in localstorage is false, run code
        if (localStorage.getItem("x") == "false") {
          //set localStorage z to true
          localStorage.setItem("z", "true");
          //go to the servers page
          console.log("redricting...");
          goto("/");
        } else {
          //set it to false
          localStorage.setItem("x", "false");
        }
      }, 1000);
    } else if (browser) {
      alert("Please give your server a name");
    } else {
      alert("Not in browser");
    }
  }
  let worldgen = true;
  function checkV() {
    if (version != "Latest" && snapshot == false) {
      worldgen = false;
    } else {
      worldgen = true;
    }
  }

  function checkS() {
    if (software == "Latest Snapshot") {
      worldgen = false;
      snapshot = true;
      modpacks = false;
    } else if (software == "Paper (Reccomended)" || software == "Spigot") {
      worldgen = true;
      snapshot = false;
      modpacks = false;
    } else if (
      software == "Quilt" ||
      software == "Fabric" ||
      software == "Forge"
    ) {
      worldgen = false;
      snapshot = false;
      modpacks = true;
    } else {
      worldgen = false;
      snapshot = false;
      modpacks = false;
    }
  }
</script>

<div class="flex place-content-center">
  <div class="flex-col mb-10">
    <div class="divider px-10 text-3xl font-semibold">
      {$t("newserver.title")}
    </div>

    <div id="serverForm">
      <form>
        <div class="flex flex-col w-[22rem] xl:w-[30rem]">
          <!-- svelte-ignore a11y-label-has-associated-control -->
          <label class="label" for="softwareDropdown">Server Software</label>
          <select
            bind:value={software}
            on:change={checkS}
            id="softwareDropdown"
            name="softwareDropdown"
            tabindex="0"
            class="select select-primary p-2 bg-base-100"
          >
            <option>Paper (Reccomended)</option>
            <option>Vanilla</option>
            <option>Spigot</option>
            <option>Quilt</option>
            <option>Fabric</option>
            <option>Forge</option>
          </select>

          {#if snapshot == false}
            <label class="label" for="softwareDropdown">Minecraft Version</label
            >
            <select
              bind:value={version}
              on:change={checkV}
              id="versionDropdown"
              name="versionDropdown"
              tabindex="0"
              class="select select-primary p-2 bg-base-100"
            >
              <option>Latest</option>

              <option>1.19.3</option>
              <option>1.18.2</option>
              <option>1.17.1</option>
              <option>1.16.5</option>
              {#if software != "Forge"}
                <option>1.15.2</option>
                <option>1.14.4</option>
                <option>1.13.2</option>
              {/if}
              <option>1.12.2</option>
              {#if software != "Forge"}
                <option>1.11.2</option>
                <option>1.10.2</option>
                <option>1.9.4</option>
                <option>1.8.8</option>
              {/if}
            </select>
          {/if}

          <label class="label" for="1">{$t("newserver.l.name")}</label>
          <input
            bind:value={name}
            id="nameInput"
            class="input-bordered input-primary input w-full bg-base-300"
            type="text"
            placeholder="{$t('general.ex')} My Minecraft Server"
          />

          {#if worldgen}
            <div class="justify-center flex mt-2 mb-1">
              <p class="label ">Worldgen Mods</p>

              <Helper tooltipText={$t("newserver.t.worldgen")} />
            </div>

            <div class="flex justify-center">
              <img
                class="mask mask-hexagon"
                src="/images/terralith.webp"
                width="80ch"
              />

              <img
                class="mask mask-hexagon"
                src="/images/nullscape.webp"
                width="80ch"
              />
              <img
                class="mask mask-hexagon"
                src="/images/incendium.webp"
                width="80ch"
              />
              <img
                class="mask mask-hexagon"
                src="/images/structory.webp"
                width="80ch"
              />
            </div>
            <div class="p-2" />
            <div class="flex justify-center space-x-14">
              <input
                id="terralith"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
              <input
                id="incendium"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
              <input
                id="nullscape"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
              <input
                id="structory"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
            </div>
          {/if}
          {#if modpacks}
            <Modpacks />{/if}

          <a on:click={send} class="btn mt-4">{$t("button.createServer")}</a>
        </div>
      </form>
    </div>
  </div>
</div>
