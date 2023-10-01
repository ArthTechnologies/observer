<script lang="ts">
  import { apiurl, createServer } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import Helper from "$lib/components/ui/Helper.svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import Modpacks from "$lib/components/ui/Modpacks.svelte";
  import UploadWorld from "$lib/components/ui/UploadWorld.svelte";
  import Alert from "$lib/components/ui/Alert.svelte";
  let version = "1.19.4";
  export let software = "Paper";
  let name = "";
  let visible = false;
  let msg = "";
  let gamemode: string;
  let admin = "";
  let modpacks = false;
  let modpackURL = "";
  let latestVersion = "1.20.1";
  let index = {};
  let versionOptions = [latestVersion];
  let worldgen = null;
  let jarsList = [];

  if (browser) {
    worldgen = document.getElementById("worldgen");
    let intervalID = setInterval(() => {
      if (worldgen == null) {
        worldgen = document.getElementById("worldgen");
      } else {
        clearInterval(intervalID);
      }
    }, 100);
    latestVersion = localStorage.getItem("latestVersion");
    version = latestVersion;
    fetch("https://api.jarsmc.xyz/jars/arthHosting", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        index = res;
        index["quilt"] = index["paper"];
        findVersions();
      });
    fetch(apiurl + "servers/jars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        jarsList = res;
      });
  }

  function send() {
    let addons = [];
    let cmd = [];
    let sSoftware = software;
    let sVersion: string;
    switch (sSoftware) {
      case "Paper (Reccomended)":
        sSoftware = "paper";
        break;
    }

    sSoftware = sSoftware.charAt(0).toLowerCase() + sSoftware.slice(1);
    sVersion = version.charAt(0).toLowerCase() + version.slice(1);

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

    cmd.push("op " + admin);
    cmd.push("defaultgamemode " + gamemode);

    console.log("cmd = " + cmd);

    console.log(browser && name != "");
    if (browser && name != "") {
      modpackURL = localStorage.getItem("modpackURL");

      console.log("creating" + sSoftware + "server...");
      createServer(name, sSoftware, sVersion, addons, cmd, modpackURL).then(
        (res) => {
          localStorage.setItem("modpackURL", "");
          localStorage.setItem("modpackVersion", "");
          if (res == true) {
            console.log("redricting to homepage...");
            goto("/");
          } else {
            msg = res;
            visible = true;
            setTimeout(() => {
              visible = false;
            }, 3500);
          }
        }
      );
    } else if (browser) {
      alert("Please give your server a name");
    } else {
      alert("Not in browser");
    }
  }
  function checkV() {
    if (browser) {
      version = document.getElementById("versionDropdown").value;
    }

    let worldgenModsAvailable = false;

    if (!modpacks) {
      let worldgenMods = ["terralith", "incendium", "nullscape", "structory"];
      worldgenMods.forEach((item) => {
        let checkbox = document.getElementById(item);
        if (checkbox != null) {
          if (jarsList.includes(item + "-" + version + ".zip")) {
            worldgenModsAvailable = true;
            checkbox.disabled = false;
          } else {
            checkbox.disabled = true;
          }
        }
      });
      if (worldgenModsAvailable) {
        worldgen.classList.remove("hidden");
      } else {
        worldgen.classList.add("hidden");
      }
    } else {
      worldgen.classList.add("hidden");
    }
  }

  function findVersions() {
    let CVS = software.toLowerCase();
    let versionOptions = [];

    index[CVS].forEach((item) => {
      console.log(item.version);
      let option = {
        value: item.version,
        label: item.version,
      };
      versionOptions.push(item.version);
    });

    // Append versions to dropdown
    let versionDropdown = document.getElementById("versionDropdown");
    versionDropdown.innerHTML = "";
    let i = 0;

    versionOptions.forEach((item) => {
      let option = document.createElement("option");
      option.value = item;
      option.text = item;
      versionDropdown.add(option);

      if (i === 0) {
        version = item;
      }
      i++;
    });
  }
  function checkS() {
    findVersions();

    if (software == "Paper") {
      worldgen.classList.remove("hidden");
      modpacks = false; // Reset modpacks to false when switching to Paper
    } else if (
      software == "Quilt" ||
      software == "Fabric" ||
      software == "Forge"
    ) {
      worldgen.classList.add("hidden");

      modpacks = true;
    } else {
      worldgen.classList.add("hidden");
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
          <label class="label" for="softwareDropdown"
            >{$t("newserver.l.software")}</label
          >
          <select
            bind:value={software}
            on:change={checkS}
            id="softwareDropdown"
            name="softwareDropdown"
            tabindex="0"
            class="select select-primary p-2 bg-base-100"
          >
            <option>Paper</option>
            <option>Forge</option>
            <option>Fabric</option>
            <option>Quilt</option>
            <option>Velocity</option>
          </select>

          <label class="label" for="softwareDropdown"
            >{$t("newserver.l.version")}</label
          >
          <select
            on:change={checkV}
            id="versionDropdown"
            name="versionDropdown"
            tabindex="0"
            class="select select-primary p-2 bg-base-100"
          >
            <option>{latestVersion}</option>
            <option>1.19.4</option>
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

          <label class="label" for="1">{$t("newserver.l.name")}</label>
          <input
            bind:value={name}
            id="nameInput"
            class="input-bordered input-primary input bg-base-300"
            type="text"
            placeholder="{$t('general.ex')} My Minecraft Server"
          />

          <div id="worldgen">
            <div class="justify-center flex mt-2 mb-1">
              <p class="label">Worldgen Mods</p>

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
                src="/images/incendium.webp"
                width="80ch"
              />
              <img
                class="mask mask-hexagon"
                src="/images/nullscape.webp"
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
          </div>
          <div class=" justify-evenly mt-5 space-y-5 rounded-xl items-center">
            {#if modpacks}
              <Modpacks />{/if}
          </div>

          <a on:click={send} class="btn mt-4">{$t("button.createServer")}</a>
        </div>
      </form>
    </div>
  </div>
</div>
<Alert detail={msg} {visible} />
