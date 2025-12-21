<script lang="ts">
  import { apiurl, createServer, getServers } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import Helper from "$lib/components/ui/Helper.svelte";
  import { goto } from "$app/navigation";
  import { browser } from "$app/environment";
  import Modpacks from "$lib/components/ui/Modpacks.svelte";
  import UploadWorld from "$lib/components/ui/UploadWorld.svelte";

  import { alert } from "$lib/scripts/utils";

  let version = "1.19.4";
  export let software = $t("software.paper");
  let name = "";
  let visible = false;
  let gamemode: string;
  let admin = "";
  let modpacks = false;
  let modpackURL = "";
  let latestVersion = "1.20.1";
  let worldgenMods = [
    { name: "terralith", tooltip: "Terralith - Overworld Evolved" },
    { name: "incendium", tooltip: "Incendium - Nether Expansion" },
    { name: "nullscape", tooltip: "Nullscape - End Expansion" },
    { name: "structory", tooltip: "Structory - New Structures" },
  ];
  let worldgen = null;
  let jarsList = [];
  let id = -1;
  let showGeyserBar = false;

  function parseJarFileName(filename) {
    // Format: software-version-variant.jar
    const match = filename.match(/^([a-zA-Z]+)-(\d+(?:\.\d+)*)-(\w+)\.(jar|zip)$/);
    if (match) {
      return {
        software: match[1],
        version: match[2],
        variant: match[3],
      };
    }
    return null;
  }

  function formatVersionDisplay(version, variant) {
    // Don't show "release" variant in UI
    if (variant === "release") {
      return version;
    }
    return `${version} ${variant.charAt(0).toUpperCase() + variant.slice(1)}`;
  }

  function getLatestVersionForSoftware(softwareName, jars) {
    let CVS = softwareName.split(" - ")[0].toLowerCase();
    let versionOptions = [];

    for (let i in jars) {
      let parsed = parseJarFileName(jars[i]);
      if (parsed && parsed.software === CVS) {
        versionOptions.push({
          version: parsed.version,
          variant: parsed.variant,
          display: formatVersionDisplay(parsed.version, parsed.variant),
        });
      }
    }

    // Sort versions in descending order
    versionOptions.sort((a, b) => {
      const partsA = a.version.split(".").map(p => parseInt(p, 10));
      const partsB = b.version.split(".").map(p => parseInt(p, 10));

      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || 0;
        const partB = partsB[i] || 0;
        if (partA !== partB) {
          return partB - partA;
        }
      }
      return 0;
    });

    return versionOptions.length > 0 ? versionOptions[0].version : "1.20.1";
  }

  $: latestVersion = getLatestVersionForSoftware(software, jarsList);
  $: showGeyserBar = software.split(" - ")[0] === "Paper" && version.split(" ")[0] === latestVersion;

  if (browser) {
    let email = localStorage.getItem("accountEmail");
    if (document.location.href.includes("?id=")) {
      id = parseInt(document.location.href.split("?id=")[1].split("&")[0]);
    } else {
      getServers(email).then((response) => {
        if (browser) {
          for (let i in response) {
            //if it is a string, that means it is not created yet
            if (typeof response[i] == "string") {
              id = i.id;

              break;
            }
          }

          if (id == -1) alert($t("alert.makeANewSubscription"));
        }
      });
    }
    worldgen = document.getElementById("worldgen");
    let intervalID = setInterval(() => {
      if (worldgen == null) {
        worldgen = document.getElementById("worldgen");
      } else {
        clearInterval(intervalID);
      }
    }, 100);

    fetch(apiurl + "info/jars", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        jarsList = res;
        findVersions();
        version = getLatestVersionForSoftware(software, jarsList);
        checkV();
      });

    //this checks if the user has paid for a modded plan
    fetch(apiurl + "info/subscriptions", {
      method: "GET",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        //this makes sure that the backend has multiple plans
        if (
          !(
            json.subscriptions > 0 &&
            json.moddedSubscriptions == 0 &&
            json.basicSubscriptions == 0
          )
        ) {
          let servers = JSON.parse(localStorage.getItem("servers"));
          let moddedServers = 0;
          for (let i in servers) {
            if (typeof servers[i] == "object") {
              switch (servers[i].software.toLowerCase) {
                case "forge":
                case "fabric":
                case "quilt":
                  moddedServers++;
                  break;
              }
            }
          }

        }
      });
  }

  function send() {
    let addons = [];
    let cmd = [];
    let sSoftware = software.toLowerCase().split(" - ")[0];
    let sVersion: string = version.toLowerCase();

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
      let modpackURL = localStorage.getItem("modpackURL");
      let modpackID = localStorage.getItem("modpackID");
      let versionID = localStorage.getItem("modpackVersionID");
      createServer(
        id,
        name,
        sSoftware,
        sVersion,
        addons,
        cmd,
        modpackURL,
        modpackID,
        versionID
      ).then((res) => {
        localStorage.setItem("modpackURL", "");
        localStorage.setItem("modpackID", "");
        localStorage.setItem("modpackVersionID", "");
        localStorage.setItem("serverSoftware", sSoftware);
        if (res == true) {
          console.log("redricting to homepage...");
          goto("/server/"+(10000 + id));
          setTimeout(() => {
      location.reload();
    }, 300); 
          //this tells the navbar to update the icon that is highligted
          window.dispatchEvent(new Event("redrict"));
        } else {
          if (res.includes("Maximum servers"))
            alert($t("alert.maximumServersReached"));
          else if (res.includes("If you want another"))
            alert($t("alert.makeANewSubscription"));
          else if (res.includes("You are not subscribed"))
            alert($t("alert.subscribe"));
          else alert(res);
        }
      });
    } else if (browser) {
      alert($t("alert.enterName"));
    }
  }
  function checkV() {
    if (browser) {
      version = document.getElementById("versionDropdown").value.trim().toLowerCase();
      console.log("version selected: " + version);
    }

    let worldgenModsAvailable = false;

    if (!modpacks) {
      let worldgenMods = ["terralith", "incendium", "nullscape", "structory"];
      worldgenMods.forEach((item) => {
        let checkbox = document.getElementById(item);
        if (checkbox != null) {
          // Check if any variant of this mod exists for the selected version
          const modExists = jarsList.some(jar =>
            jar.startsWith(item + "-" + version + "-")
          );

          if (modExists) {
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
        document.getElementById("terralith").checked = false;
        document.getElementById("incendium").checked = false;
        document.getElementById("nullscape").checked = false;
        document.getElementById("structory").checked = false;
      }
    } else {
      worldgen.classList.add("hidden");
      //modpacks search as soon as the button is loaded, so this search needs to
      //be re-done for the new version.
      const modpacks = document.getElementById("modpacks");
      modpacks.innerHTML = "";
      new Modpacks({
        target: modpacks,
      });
    }
  }

  function findVersions() {
    let CVS = software.split(" - ")[0].toLowerCase();
    let versionOptions = [];

    for (let i in jarsList) {
      let parsed = parseJarFileName(jarsList[i]);
      if (parsed && parsed.software === CVS) {
        versionOptions.push({
          version: parsed.version,
          variant: parsed.variant,
          display: formatVersionDisplay(parsed.version, parsed.variant),
        });
      }
    }

    // Sort versions in descending order
    versionOptions.sort((a, b) => {
      const partsA = a.version.split(".").map(p => parseInt(p, 10));
      const partsB = b.version.split(".").map(p => parseInt(p, 10));

      for (let i = 0; i < Math.max(partsA.length, partsB.length); i++) {
        const partA = partsA[i] || 0;
        const partB = partsB[i] || 0;
        if (partA !== partB) {
          return partB - partA;
        }
      }
      return 0;
    });

    // Append versions to dropdown
    let versionDropdown = document.getElementById("versionDropdown");
    versionDropdown.innerHTML = "";
    let i = 0;

    versionOptions.forEach((item) => {
      let option = document.createElement("option");
      option.value = item.version;
      option.text = item.display;
      versionDropdown.add(option);

      if (i === 0) {
        version = item.display;
      }
      i++;
    });
  }
  function checkS() {
    const modpackElement = document.getElementById("modpacks");
    findVersions();

    if (software.split(" - ")[0] == "Paper") {
      worldgen.classList.remove("hidden");
      modpackElement.classList.add("hidden");
      modpacks = false;
    } else if (
      software.split(" - ")[0] == "Quilt" ||
      software.split(" - ")[0] == "Fabric" ||
      software.split(" - ")[0] == "Forge" ||
      software.split(" - ")[0] == "NeoForge"
    ) {
      worldgen.classList.add("hidden");
      modpackElement.classList.remove("hidden");
      modpacks = true;
    } else {
      worldgen.classList.add("hidden");
      modpackElement.classList.add("hidden");
      modpacks = false;
    }
  }
</script>

<div class="flex place-content-center">
  <div class="flex-col mb-10">
    <div class="divider px-10 text-3xl font-poppins-bold">
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
            <option>{$t("software.paper")}</option>
   
              <option>{$t("software.forge")} </option>
              <option>{$t("software.neoForge")}</option>
              <option>{$t("software.fabric")}</option>
              <option>{$t("software.quilt")}</option>
        
            <option>{$t("software.velocity")}</option>
            <option>{$t("software.vanilla")}</option>
            <option>{$t("software.snapshot")}</option>
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
            {#if JSON.stringify(jarsList).includes(software + "-" + latestVersion)}<option
                >{latestVersion}</option
              >
            {/if}
            <option>1.19.4</option>
            <option>1.18.2</option>
            <option>1.17.1</option>
            <option>1.16.5</option>
            <option>1.12.2</option>
          </select>

          {#if showGeyserBar}
            <div class="alert alert-success mt-3 py-2 px-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current flex-shrink-0 h-5 w-5" fill="none" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <div class="flex-1">
                <p class="text-sm font-medium">Geyser will be automatically installed on this version</p>
              </div>
            </div>
          {/if}

          <label class="label" for="1">{$t("newserver.l.name")}</label>
          <input
            bind:value={name}
            id="nameInput"
            class="input-bordered input-primary input "
            type="text"
            placeholder="{$t('general.ex')} My Minecraft Server"
          />

          <div id="worldgen">
            <div class="justify-center flex mt-2 mb-1">
              <p class="label">Worldgen Mods</p>

              <Helper tooltipText={$t("newserver.t.worldgen")} />
            </div>

            <div class="flex justify-center">
              {#each worldgenMods as item, i}
                <div
                  class="flex flex-col items-center md:tooltip md:tooltip-right"
                  data-tip={item.tooltip}
                >
                  <img
                    class="mask mask-hexagon w-[5rem] h-[5rem] md:w-[5.15rem] md:h-[5.15rem] hover:scale-[1.2] transition-all duration-100 ease-in-out"
                    src={"/images/" + item.name + ".webp"}
                    alt={item.name}
                  />
                </div>
              {/each}
            </div>
            <div class="p-2" />
            <div
              class="flex justify-center space-x-[3.475rem] md:space-x-[3.575rem]"
            >
              {#each worldgenMods as item}
                <input
                  id={item.name}
                  type="checkbox"
                  class="checkbox checkbox-secondary"
                />
              {/each}
            </div>
          </div>
          <div
            id="modpacks"
            class=" justify-evenly mt-4 space-y-5 rounded-xl items-center"
          >
            {#if modpacks}
              <Modpacks />{/if}
          </div>

          <a on:click={send} class="btn btn-neutral mt-4"
            >{$t("button.createServer")}</a
          >
        </div>
      </form>
    </div>
  </div>
</div>
