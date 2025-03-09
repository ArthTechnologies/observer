<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { onMount } from "svelte";
  import { readCmd } from "$lib/components/pages/server/Terminal.svelte";
  import {
    changeServerState,
    deleteServer,
    writeTerminal,
    readTerminal,
    apiurl,
    usingOcelot,
  } from "$lib/scripts/req";
  import { getServer } from "$lib/scripts/req";

  import { t, locale, locales } from "$lib/scripts/i18n";

  import Manage from "$lib/components/ui/Manage.svelte";
  import AddMod from "$lib/components/ui/AddMod.svelte";
  import Add from "$lib/components/ui/Add.svelte";
  import Settings from "$lib/components/pages/server/Settings.svelte";
  import DeleteServer from "$lib/components/ui/DeleteServer.svelte";
  import ManageMods from "$lib/components/ui/ManageMods.svelte";
  import Updates from "$lib/components/buttons/Updates.svelte";
  import World from "$lib/components/ui/World.svelte";
  import FullscreenTerminal from "$lib/components/buttons/FullscreenTerminal.svelte";
  import {
    ArrowLeft,
    FolderClosed,
    HelpCircle,
    Loader,
    PlayCircle,
    Repeat,
    StopCircle,

    ExternalLink,
    Send,
    FileCog,
    MemoryStick,
    Users,
    Unplug,

  } from "lucide-svelte";
  import StorageLimit from "$lib/components/ui/StorageLimit.svelte";
  import Versions from "$lib/components/buttons/Versions.svelte";
  import FullscreenMap from "$lib/components/pages/server/FullscreenMap.svelte";
  import { write } from "fs";
  import { alert } from "$lib/scripts/utils";
    import UploadWorld from "$lib/components/ui/UploadWorld.svelte";
    import Terminal from "$lib/components/pages/server/Terminal.svelte";
    import Files from "$lib/components/pages/server/Files.svelte";
    import Plugins from "$lib/components/pages/server/Plugins.svelte";
    import Mods from "$lib/components/pages/server/Mods.svelte";
    import Datapacks from "$lib/components/pages/server/Datapacks.svelte";
    import MemoryChart from "$lib/components/pages/dashboard/MemoryChart.svelte";


  let tab = "terminal";
  let modded = false;
  let vanilla = false;
  let name: string = "-";
  let address: string;

  let url: string;
  let apo = 0;
  let po = 0;
  let port = 10000;
  let id = 0;
  let desc: string = "";
  let email: string = "";
  let state = "false";
  let icon = "/images/placeholder.webp";
  let secret = "";
  let difference = -1;
  let baseurl = apiurl;
  let dynmap = false;
  let bluemap = false;
  let webmapurl =
    "http://" + apiurl.substring(0, apiurl.length - 1).split("https://")[1];
  let voicechat = false;
  let chunky = false;
  let discordsrv = false;
  let subdomain = undefined;
  let memoryStats = [];
  let memoryReq = null;

  if (browser) {
    if (localStorage.getItem("updateAlert") != "bluemap") {
      localStorage.setItem("updateAlert", "bluemap");
      alert(
        "Update: BlueMap (3D Webmap) support has been added.",
        "info",
      );
    }

    name = localStorage.getItem("serverName");
    if (localStorage.getItem("serverCardRedrict") != "true") {
      id = parseInt(localStorage.getItem("serverID"));
    } else {
      id = parseInt(window.location.href.split("/")[4]) - 10000;
    }

    if (
      localStorage.getItem("serverSoftware") == "fabric" ||
      localStorage.getItem("serverSoftware") == "quilt" ||
      localStorage.getItem("serverSoftware") == "forge" ||
      localStorage.getItem("serverSoftware") == "neoforge"
    ) {
      modded = true;
    }

    if (localStorage.getItem("serverSubdomain") != undefined) {
      subdomain = localStorage.getItem("serverSubdomain");
    }

    if (localStorage.getItem("serverDynmap") == "true") {
      dynmap = true;
    }

    if (localStorage.getItem("serverBluemap") == "true") {
      bluemap = true;
    }

    if (localStorage.getItem("serverVoicechat") == "true") {
      voicechat = true;
    }

    if (localStorage.getItem("serverChunky") == "true") {
      chunky = true;
    }

    if (localStorage.getItem("serverDiscordSRV") == "true") {
      discordsrv = true;
    }

    if (usingOcelot) {
      baseurl = JSON.parse(localStorage.getItem("serverNodes"))[id.toString()];
    }
    if (localStorage.getItem("serverSoftware") == "Vanilla") {
      vanilla = true;
    }
  }
  function alwaysDay() {
    let input = document.getElementById("alwaysDay").checked;
    if (input) {
      getStatus();

      writeTerminal(id, "time set day");
      writeTerminal(id, "gamerule doDaylightCycle false");

      document.getElementById("alwaysDay").checked = false;

    } else {
      getStatus();

      writeTerminal(id, "gamerule doDaylightCycle true");

      document.getElementById("alwaysDay").checked = false;

      //wait 200 ms then read terminal
      setTimeout(() => {
        if(tab=="terminal"){readCmd();}
      }, 200);
    }
  }

  function gamemode() {
    let input = document.getElementById("gamemode").value;

    getStatus();

    writeTerminal(id, "defaultgamemode " + input);

    document.getElementById("gamemode").value = "";

    //wait 200 ms then read terminal
    setTimeout(() => {
      if(tab=="terminal"){readCmd();}
    }, 200);
  }

  function OpPlayer() {
    let input = document.getElementById("username").value;

    getStatus();

    writeTerminal(id, "op " + input);

    document.getElementById("username").value = "";

    //wait 200 ms then read terminal
    setTimeout(() => {
      if(tab=="terminal"){readCmd();}
    }, 200);
  }

  if (browser) {
    email = localStorage.getItem("accountEmail");
    address = localStorage.getItem("address");
    //hide horizontal scrollbar
    document.body.style.overflowX = "hidden";
  }

  onMount(() => {
    if (browser) {
      localStorage.setItem("serverCardRedrict", "false");
      port += parseInt(id);
      //GET apiurl/server/id/getInfo
      fetch(baseurl + "server/" + id + "/getInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("rawDesc").innerText = data.desc;
          //displays bold, italic formatings
          //removes all other formating codes
          desc = data.desc
            .replace(/§l/g, "<b>")
            .replace(/§o/g, "<i>")
            .replace(/§r/g, "</b></i>")
            .replace(/§./g, "");

          secret = data.secret;

        
          if (data.iconUrl != undefined) {
            icon = data.iconUrl;
          } else {
            icon = "/images/placeholder.webp";
          }
        });
    }
  });

  function getStatus() {
    //get server status
    getServer(id).then((response) => {
      //convert addons array to string, save it to "serverAddons" array
      localStorage.setItem("serverAddons", response.specialDatapacks.toString());
      localStorage.setItem("serverVersion", response.version);
      if (response.specialPlugins != undefined) {
        localStorage.setItem("serverDynmap", response.specialPlugins.includes("dynmap"));
      localStorage.setItem("serverBluemap", response.specialPlugins.includes("bluemap"));
      localStorage.setItem("serverChunky", response.specialPlugins.includes("chunky"));
      localStorage.setItem("serverDiscordSRV", response.specialPlugins.includes("discordsrv"));
      localStorage.setItem("serverVoicechat", response.specialPlugins.includes("voicechat"));
      }

      if (response.specialPlugins.includes("dynmap") && dynmap == false) {  
        setTimeout(() => {
          dynmap = true;
        }, 5000);
      }
      if (response.specialPlugins.includes("bluemap") && bluemap == false) {
        setTimeout(() => {
          bluemap = true;
        }, 5000);
      } 
      if (response.specialPlugins.includes("voicechat") && voicechat == false) {
        setTimeout(() => {
          voicechat = true;
        }, 5000);
      }
      if (response.specialPlugins.includes("chunky") && chunky == false) {
        setTimeout(() => {
          chunky = true;
        }, 5000);
      }
      if (response.specialPlugins.includes("discordsrv") && discordsrv == false) {
        setTimeout(() => {
          discordsrv = true;
        }, 5000);
      }

      //set state to response
      state = response.state;
    });
  }

  function start() {
    if (state == "true") {
      changeServerState("restart", id, email);
    } else if (state == "false") {
      changeServerState("start", id, email);
    }
  }

  function stop() {
    changeServerState("stop", id, email);
  }

  function kill() {
    changeServerState("kill", id, email);
  }

  onMount(() => {
    setTimeout(() => {
      getStatus();
      if(tab=="terminal"){readCmd();}
    }, 200);
    if (browser) {
      let count = 0;
      let interval = 500;
      setInterval(function () {
        count++;
        if (count > 5) {
          interval = 1000;
        }
        if (count > 20) {
          interval = 2000;
        }
        let path = decodeURIComponent(window.location.pathname);
        // if there is a / at the end, this removes it
        if (path.endsWith("/")) {
          path = path.substring(0, path.length - 1);
        }
        if (path == "/server/" + (10000 + parseInt(id))) {
          getStatus();

          if(tab=="terminal"){readCmd();}
        }
      }, interval);
    }
    getStatus();
  });


  if(tab=="terminal"){readCmd();}

  function dynmapRender() {
    writeTerminal(id, "dynmap fullrender world");
  }

  function pregen() {
    let radius = document.getElementById("pregenRadius").value;
    writeTerminal(id, "chunky start world circle 0 0 " + radius);
    document.getElementById("pregenRadius").value = "";
  }

  let ramUsage = "1.024GB";
  let players = 0;
  let maxPlayers = 20;

  if (browser) {
    fetchRam();
    fetchPlayers();
    setInterval(() => {
      fetchPlayers();
      fetchRam();
    }, 15000);

    function fetchRam() {
      memoryReq = fetch(apiurl + "server/" + id + "/liveStats", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          try {
            memoryStats = data; 
            // for reach item in the array change memory.used and memory.total from byes to mb
            data.forEach((item) => {
              item.memory.used = (parseInt(item.memory.used) / 1024 / 1024).toFixed(2);
              item.memory.total = (parseInt(item.memory.total) / 1024 / 1024).toFixed(2);
            });
          ramUsage = (parseInt(data[data.length-1].memory.used) / 1024).toFixed(3) +"/"+(parseInt(data[data.length-1].memory.total) / 1024 / 1024 / 1024).toFixed(0)+ "GB";
          } catch (e) {
            //console.log(e);
          }
        });
    }

    function fetchPlayers() {
      fetch("https://api.mcsrvstat.us/3/arthmc.xyz:" + port)
        .then((response) => response.json())
        .then((data) => {
          try {
          players = data.players.online;
          maxPlayers = data.players.max;
          } catch (e) {
            //console.log(e);
          }
        });
    }
  }

  let tabs = ["terminal", "plugins", "datapacks", "files", "settings"];
  if (modded) {
    tabs = ["terminal", "mods", "datapacks", "files", "settings"];
  }
  if (vanilla) {
    tabs = ["terminal", "datapacks", "files", "settings"];
  }
</script>

<div class="lg:-mt-5">
<!-- Start Top Section-->
  <div class="flex justify-between mb-2 items-center">
    <div>
<div class="mb-2">
  <span class="font-poppins-bold text-gray-200 text-3xl mr-0.5" id="serverName">{name}</span>

</div>
      <div class="flex gap-2">
        {#if state == "true"}
        <button on:click={start} class="btn btn-sm btn-success"
          ><Repeat size=18 class="mr-1.5" />{$t("button.restart")}</button
        >
        <button on:click={stop} class="btn btn-sm btn-error"
          ><StopCircle size=18 class="mr-1.5" />{$t("button.stop")}</button
        >
      {:else if state == "false"}
        <button on:click={start} class="btn btn-sm btn-success"
          ><PlayCircle size=18 class="mr-1.5" />{$t("button.start")}</button
        >
        <a href="/" class="btn btn-sm btn-disabled"
          ><StopCircle size=18 class="mr-1.5" />{$t("button.stop")}</a
        >
      {:else if state == "starting"}
        <div
          class="inline-flex pointer-events-none bg-success flex items-center px-3 py-1 text-center text-sm font-semibold text-black uppercase rounded-lg"
        >
          <Loader size=18 class="animate-spin mr-1.5" />
          {$t("button.starting")}
        </div>
        <button class="btn btn-sm btn-neutral" on:click={kill}>
          <Unplug size=18 class="mr-1.5" />Kill
        </button>
      {:else if state == "installing"}
        <div
          class="inline-flex pointer-events-none bg-accent flex items-center px-3 py-1 text-center text-sm font-semibold text-base-300 uppercase rounded-lg"
        >
          <Loader size=18 class="animate-spin mr-1.5" />
          {$t("button.installing")}
        </div>
        <button on:click={stop} class="btn btn-sm btn-error"
          ><StopCircle size=18 class="mr-1.5" />{$t("button.stop")}</button
        >
      {:else if state == "stopping"}
        <button class="btn btn-sm btn-neutral" on:click={kill}>
          <Unplug size=18 class="mr-1.5" />Kill
        </button>
        <div
          class="inline-flex pointer-events-none bg-error flex items-center px-3 py-1 text-center text-sm font-semibold text-black uppercase rounded-lg"
        >
          <Loader size=18 class="animate-spin mr-1.5" />
          {$t("button.stopping")}
        </div>
      {/if}
      <Updates/>
      </div>
    </div>

<div class="flex flex-col gap-1.5">
  <div
  class="flex bg-neutral px-2 p-1.5 rounded-lg items-center text-sm font-bold gap-1 h-fit"
>
  <MemoryStick size="16" />
  {ramUsage}
</div>
<div
class="flex bg-neutral px-2 p-1.5 rounded-lg items-center text-sm font-bold gap-1 h-fit"
>
<Users size="16" />
{players}/{maxPlayers} Players
</div>
</div>

  </div>
  <!-- End Top Section-->
  <div
  class="divider"
/>

<!-- Start Bottom Section-->
  <div
    class="md:space-x-7 flex xs:flex-col-reverse max-xl:flex-col max-xl:items-center gap-0 justify-between px-5"
  >
        <!-- Start Left Side-->
    <div class="flex flex-col space-y-5 w-full">


  <div role="tablist" class="tabs tabs-boxed flex flex-wrap p-0 gap-1">
    {#each tabs as label, index}
{#if label == "mods"}
<a
role="tab"
class="tab px-3.5 {tab === "plugins" ? 'tab-active' : ''}"
on:click={() => (tab = "plugins")}
>
{label[0].toUpperCase() + label.slice(1)}
</a>
{:else}
<a
role="tab"
class="tab px-3.5 {tab === label ? 'tab-active' : ''}"
on:click={() => (tab = label)}
>
{label[0].toUpperCase() + label.slice(1)}
</a>
{/if}

    {/each}
  </div>

<div>
  {#if tab == "terminal"}
  <Terminal/>
  {:else if tab == "plugins"}
  {#if modded}
  <Mods/>
  {:else if !vanilla}
  <Plugins/>
  {/if}
  {:else if tab == "datapacks"}
  <Datapacks/>
  {:else if tab == "files"}
  <Files/>
  {:else if tab == "settings"}
  <Settings/>
  {/if}
</div>


<div class="divider md:hidden pt-5 pb-4" />

</div>
<!-- End Left Side-->
<!-- Start Right Side-->
    <div
      class="flex flex-col items-center place-content-start mb-20 md:pl-0 mt-[3.25rem] gap-5 w-full md:w-[19.75rem]"
    >
      <div class="space-y-5 w-full">
        <div
          class="rounded-xl bg-base-100 bg-opacity-75 shadow-sm image-full mt-4 md:mt-0 w-full"
        >
          <div class="flex items-center w-full md:w-[19.8rem]">
            <div class="p-4 flex  items-center gap-3.5 w-full">
              <img id="xIcon" src={icon} class="w-[3.65rem] h-[3.65rem] rounded-lg" />

              <div class="flex flex-col -mt-1.5">

                <div class="font-poppins-bold sm:text-lg md:text-[1.25rem]">
                  {#if subdomain == undefined}{address}:{port}{:else}
                    {subdomain}.{address}
                  {/if}
                </div>
                <div id="xDesc" class="text-xs font-light flex ">
                  Description: {@html desc}
                </div>
                <div id="rawDesc" class="hidden"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
<div class="flex w-full hidden">
<div class="hidden">
  {#await memoryReq}
d
  {:then}
  <MemoryChart performance={memoryStats} type=2/>
  {/await}</div>
</div>

      {#if dynmap}
        <div class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]">
          <img
            alt="dynmap-icon"
            class="w-8 h-8 rounded-lg bg-base-200"
            src="/images/dynmap.webp"
          />

          <div class="w-0.5 h-8 bg-base-300 opacity-75 m-0"></div>
          <div
            style="text-wrap: nowrap;"
            class="tooltip tooltip-top tooltip-info z-50 hidden sm:block"
            data-tip="Only renders overworld. See guide for more info."
          >
            <button
              on:click={dynmapRender}
              class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.dynmap.render")}</button
            >
          </div>
          <a
            href="https://arthmc.xyz/knowledgebase/using-dynmap"
            target="_blank"
            rel="noreferrer"
            ><button class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.dynmap.guide")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
          <a
            href="{webmapurl}:{parseInt(id) + 10066}"
            target="_blank"
            rel="noreferrer"
          >
            <button class="btn btn-sm items-center hover:bg-base-100"
              >{$t("plugins.dynmap.map")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
        </div>
      {/if}
      {#if bluemap}
      <div class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]">
        <div class="dropdown dropdown-hover">
          <img
            alt="bluemap-icon"
            class="w-8 h-8 rounded-lg bg-base-200"
            src="/images/bluemap.webp"
          />
        </div>

        <div class="w-0.5 h-8 bg-base-300 opacity-75 m-0"></div>
        <a
          href="https://arthmc.xyz/knowledgebase/using-bluemap"
          target="_blank"
          rel="noreferrer"
          ><button class="btn btn-neutral btn-sm items-center"
            >{$t("plugins.voicechat.guide")}
            <ExternalLink size="18" class="ml-1" /></button
          ></a
        >
        <a
        href="{webmapurl}:{parseInt(id) + 10066}"
        target="_blank"
        rel="noreferrer"
      >
        <button class="btn btn-sm items-center hover:bg-base-100"
          >Open Webmap
          <ExternalLink size="18" class="ml-1" /></button
        ></a
      >
      </div>
    {/if}
      {#if voicechat}
        <div class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]">
          <div class="dropdown dropdown-hover">
            <img
              alt="dynmap-icon"
              class="w-8 h-8 rounded-lg bg-base-200"
              src="/images/voicechat.webp"
            />
          </div>

          <div class="w-0.5 h-8 bg-base-300 opacity-75 m-0"></div>
          <a
            href="https://arthmc.xyz/knowledgebase/using-simple-voice-chat"
            target="_blank"
            rel="noreferrer"
            ><button class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.voicechat.guide")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
          <a
            href="https://modrinth.com/plugin/simple-voice-chat/versions?l=fabric"
            target="_blank"
            rel="noreferrer"
          >
            <button class="btn btn-sm items-center hover:bg-base-100"
              >{$t("plugins.voicechat.downloadMod")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
        </div>
      {/if}
      {#if chunky}
        <div class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]">
          <div class="dropdown dropdown-hover">
            <img
              alt="dynmap-icon"
              class="w-8 h-8 rounded-lg bg-base-200"
              src="/images/chunky.webp"
            />
          </div>
          <div class="w-0.5 h-8 bg-base-300 opacity-75 m-0"></div>
          <input
            id="pregenRadius"
            class="input input-sm w-32 input-bordered"
            placeholder={$t("plugins.chunky.l.radius")}
            type="text"
          />
          <button on:click={pregen} class="btn btn-secondary btn-sm btn-square"
            ><Send size="18" /></button
          >

          <a
            href="https://github.com/pop4959/Chunky/wiki/Commands"
            target="_blank"
            rel="noreferrer"
            ><button class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.voicechat.guide")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
        </div>
      {/if}
      {#if discordsrv}
        <div class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]">
          <div class="dropdown dropdown-hover">
            <img
              alt="dynmap-icon"
              class="w-8 h-8 rounded-lg bg-base-200"
              src="/images/discordsrv.webp"
            />
          </div>

          <div class="w-0.5 h-8 bg-base-300 opacity-75 m-0"></div>
          <a
            href="https://knowledgebase.discordsrv.com/installation/initial-setup"
            target="_blank"
            rel="noreferrer"
            ><button class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.discordsrv.guide")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
        </div>
      {/if}
      <div class=" bg-base-100 rounded-xl px-4 py-3 ">
        <p class="text-xl font-bold">{$t("shortcuts.title")}</p>
        <div class="space-x-1.5 space-y-1.5">
          <label class="label" for="username">{$t("shortcuts.l.cheats")}</label>

          <input
            id="username"
            class="input input-sm w-1/2 md:w-auto input-bordered"
            placeholder={$t("shortcuts.p.cheats")}
            type="text"
          />
          <button on:click={OpPlayer} class="btn btn-secondary btn-sm"
            >{$t("button.send")}</button
          >
        </div>
        <div class="space-x-1.5 space-y-1.5">
          <label class="label" for="gamemode"
            >{$t("shortcuts.l.gamemode")}</label
          >

          <input
            id="gamemode"
            class="input input-sm w-1/2 md:w-auto input-bordered"
            placeholder={$t("shortcuts.p.gamemode")}
            type="text"
          />
          <button on:click={gamemode} class="btn btn-secondary btn-sm"
            >{$t("button.send")}</button
          >
        </div>

        <label class="label" for="alwaysDay"
          >{$t("shortcuts.l.alwaysDay")}</label
        >
        <div class="flex items-center space-x-2 ml-2">
          <input id="alwaysDay" type="checkbox" class="toggle" />
          <button on:click={alwaysDay} class="btn btn-secondary btn-sm"
            >{$t("button.send")}</button
          >
        </div>
      </div>
      <StorageLimit />  
      <div class="flex flex-col gap-2 items-center">
        <div class="flex  space-x-2">
          <Versions /> <World />
                  </div>
                  <DeleteServer/>
                  </div>	
       
       


    
    </div>
    <!-- End Right Side-->	
  </div>
  <!-- End Bottom Section-->
</div>
