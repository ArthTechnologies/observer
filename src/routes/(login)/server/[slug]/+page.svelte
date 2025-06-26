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
    PencilIcon,
    CopyIcon,
    FileQuestion,
    ShieldQuestion,
    Book,
    BookOpen,
    CameraIcon,
    PenLine,
    TerminalIcon,
    Plug,
    Braces,
    Box,
    FilesIcon,
    FileIcon,
    DatabaseBackup,
    Database,
    CogIcon,
    SettingsIcon,
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
  import CpuUsageChart from "$lib/components/pages/dashboard/CpuUsageChart.svelte";
  import Backups from "$lib/components/pages/server/Backups.svelte";
    import CopyButton from "$lib/components/buttons/CopyButton.svelte";

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
      alert("Update: BlueMap (3D Webmap) support has been added.", "info");
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
      localStorage.setItem(
        "serverAddons",
        response.specialDatapacks.toString()
      );
      localStorage.setItem("serverVersion", response.version);
      if (response.specialPlugins != undefined) {
        localStorage.setItem(
          "serverDynmap",
          response.specialPlugins.includes("dynmap")
        );
        localStorage.setItem(
          "serverBluemap",
          response.specialPlugins.includes("bluemap")
        );
        localStorage.setItem(
          "serverChunky",
          response.specialPlugins.includes("chunky")
        );
        localStorage.setItem(
          "serverDiscordSRV",
          response.specialPlugins.includes("discordsrv")
        );
        localStorage.setItem(
          "serverVoicechat",
          response.specialPlugins.includes("voicechat")
        );
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
      if (
        response.specialPlugins.includes("discordsrv") &&
        discordsrv == false
      ) {
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
      if (tab == "terminal") {
        readCmd();
      }
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

          if (tab == "terminal") {
            readCmd();
          }
        }
      }, interval);
    }
    getStatus();
  });

  if (tab == "terminal") {
    readCmd();
  }

  function dynmapRender() {
    writeTerminal(id, "dynmap fullrender world");
  }

  function pregen() {
    let radius = document.getElementById("pregenRadius").value;
    writeTerminal(id, "chunky start world circle 0 0 " + radius);
    document.getElementById("pregenRadius").value = "";
  }

  let ramUsage = "0.000/0GB";
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
              item.memory.used = (
                parseInt(item.memory.used) /
                1024 /
                1024
              ).toFixed(2);
              item.memory.total = (
                parseInt(item.memory.total) /
                1024 /
                1024
              ).toFixed(2);
            });
            let currentRam = parseInt(data[data.length - 1].memory.used) / 1024;
            let maxRam = parseInt(data[data.length - 1].memory.total) / 1024;
            currentRam = parseFloat(currentRam.toFixed(3));
            maxRam = Math.floor(maxRam);
            if (currentRam > maxRam) {
              currentRam = maxRam;
            }
            ramUsage = currentRam + "/" + maxRam + "GB";
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

  let tabs = [
    "terminal",
    "plugins",
    "datapacks",
    "files",
    "backups",
    "settings",
  ];
  if (modded) {
    tabs = ["terminal", "mods", "datapacks", "files", "backups", "settings"];
  }
  if (vanilla) {
    tabs = ["terminal", "datapacks", "files", "backups", "settings"];
  }
</script>

<div class="lg:-mt-5">
  <!-- Start Top Section-->
  <div class="flex justify-between mb-2 items-center">
    <div>
      <div class="mb-2 flex items-end gap-1">
        <span
          class="font-poppins-bold text-gray-200 text-3xl mr-0.5"
          id="serverName">{name}</span
        >
        

<div>
  {#if state == "true" }
<div class="badge badge-neutral gap-1 font-ubuntu text-[.8rem] flex items-center mb-0.5">
  <span class="mb-[0.2rem] text-success">●</span> Online
</div>
{:else if state == "false"}
<div class="badge badge-neutral gap-1 font-ubuntu text-[.8rem] flex items-center mb-0.5">
  <span class="mb-[0.2rem] text-error">●</span> Offline
</div>
 
{:else if state == "starting" || state == "installing" || state == "stopping"}
<div class="badge badge-neutral bg-neutral gap-1 skeleton font-ubuntu text-[.8rem] flex items-center mb-0.5">
  <span class="mb-[0.2rem]">●</span> Loading
  </div>
  {/if}
</div>
      </div>
      <div class="flex gap-2">
        {#if state == "true"}
          <button on:click={start} class="btn btn-sm btn-success"
            ><Repeat size="18" class="mr-1.5" />{$t("button.restart")}</button
          >
          <button on:click={stop} class="btn btn-sm btn-error"
            ><StopCircle size="18" class="mr-1.5" />{$t("button.stop")}</button
          >
        {:else if state == "false"}
          <button on:click={start} class="btn btn-sm btn-success"
            ><PlayCircle size="18" class="mr-1.5" />{$t("button.start")}</button
          >
          <a href="/" class="btn btn-sm btn-disabled"
            ><StopCircle size="18" class="mr-1.5" />{$t("button.stop")}</a
          >
        {:else if state == "starting"}
          <div
            class="inline-flex pointer-events-none bg-success flex items-center px-3 py-1 text-center text-sm font-semibold text-black uppercase rounded-lg"
          >
            <Loader size="18" class="animate-spin mr-1.5" />
            {$t("button.starting")}
          </div>
          <button class="btn btn-sm btn-neutral" on:click={kill}>
            <Unplug size="18" class="mr-1.5" />Kill
          </button>
        {:else if state == "installing"}
          <div
            class="inline-flex pointer-events-none bg-accent flex items-center px-3 py-1 text-center text-sm font-semibold text-base-300 uppercase rounded-lg"
          >
            <Loader size="18" class="animate-spin mr-1.5" />
            {$t("button.installing")}
          </div>
          <button on:click={stop} class="btn btn-sm btn-error"
            ><StopCircle size="18" class="mr-1.5" />{$t("button.stop")}</button
          >
        {:else if state == "stopping"}
          <button class="btn btn-sm btn-neutral" on:click={kill}>
            <Unplug size="18" class="mr-1.5" />Kill
          </button>
          <div
            class="inline-flex pointer-events-none bg-error flex items-center px-3 py-1 text-center text-sm font-semibold text-black uppercase rounded-lg"
          >
            <Loader size="18" class="animate-spin mr-1.5" />
            {$t("button.stopping")}
          </div>
        {/if}
        <Updates />
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
  <div class="divider" />

  <!-- Start Bottom Section-->
  <div
    class="md:space-x-7 flex xs:flex-col-reverse max-xl:flex-col max-xl:items-center gap-0 justify-between px-5"
  >
    <!-- Start Left Side-->
    <div class="flex flex-col space-y-3 w-full">
      <div role="tablist" class="tabs font-ubuntu tabs-boxed bg-base-300  w-fit  p-2 flex flex-wrap p-0 gap-1">
        {#each tabs as label, index}
          {#if label == "mods"}
            <a
              role="tab"
              class="tab hover:text-primary gap-1.5 px-3.5 {tab === 'plugins' ? 'tab-active' : ''}"
              on:click={() => (tab = "plugins")}
            >
        <Box size=18/>
              {label[0].toUpperCase() + label.slice(1)}
            </a>
          {:else}
            <a
              role="tab"
              class="tab hover:text-primary gap-1.5 px-3.5 {tab === label ? 'tab-active' : ''}"
              on:click={() => (tab = label)}
            >
                {#if label == "terminal"}
               <TerminalIcon size=18/>
               {:else if label == "plugins"}
               <Plug size=18 />
               {:else if label == "datapacks"}
               <Braces size=18 />
               {:else if label == "files"}
               <FileIcon size=18 />
                {:else if label == "backups"}
                <Database size=18 />
                {:else if label == "settings"}
                <SettingsIcon size=18 />
               {/if}
           
              {label[0].toUpperCase() + label.slice(1)}
            </a>
          {/if}
        {/each}
      </div>

      <div>
        {#if tab == "terminal"}
          <Terminal />
        {:else if tab == "plugins"}
          {#if modded}
            <Mods />
          {:else if !vanilla}
            <Plugins />
          {/if}
        {:else if tab == "datapacks"}
          <Datapacks />
        {:else if tab == "files"}
          <Files />
        {:else if tab == "backups"}
          <Backups />{:else if tab == "settings"}
          <Settings />
        {/if}
      </div>

      <div class="divider md:hidden pt-5 pb-4" />
    </div>
    <!-- End Left Side-->
    <!-- Start Right Side-->
    <div
      class="flex flex-col items-center place-content-start mb-20 md:pl-0 mt-[3.75rem] gap-5 w-full md:w-[19.75rem]"
    >
      <div class="space-y-5 w-full">
        <div
          class=" bg-base-300 w-full shadow-xl rounded-xl px-4 py-3 neutralGradientStroke"
        >
        <p class=" font-bold font-ubuntu text-gray-100 mb-3">Server Info</p>
          <div class="flex flex-col items-center w-full md:w-[19.8rem]">
         
<div class="flex items-center gap-3.5 w-full">
  <div class="w-[3.5rem] h-[3.5rem] relative group">
    <img
      id="xIcon"
      src={icon}
      class="rounded-lg transition-all cursor-pointer"
    />
    <div class="absolute top-0 left-0 w-full h-full cursor-pointer bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <CameraIcon />
    </div>
  </div>

              <div class="flex flex-col">
                <div class="text-sm font-light flex font-poppins">
                Name:
                </div>
                <div class="font-poppins-bold text-sm md:text-lg -mt-1">
                  {name} <button class="btn bg-base-100 bg-opacity-75 btn-xs btn-circle">
                    <PenLine size=12 /></button>
                </div>

                <div id="rawDesc" class="hidden"></div>
              </div>
              
            </div>
                  <div class="flex items-center gap-3.5 w-full">
           

           <div class="flex">
               <div class="flex flex-col">
               <span class="text-sm font-light  font-poppins mt-3">
                  IP Address
                </span>
                <div class="flex justify-between">
                  <div class="font-mono text-sm  text-white  rounded flex gap-1 items-center -mt-1">
                  {#if subdomain == undefined}{address}:{port}{:else}
                    {subdomain}.{address}
                  {/if}
                  <CopyButton text={subdomain == undefined ? address + ":" + port : subdomain + "." + address} size="16" class="cursor-pointer"
                  />
            
                </div>
                <button class="btn btn-xs"><BookOpen size=16 class="mr-1.5"/> How to Join</button>
                </div>
<div class="divider my-2"></div>
              <StorageLimit {modded}/>
                <div id="rawDesc" class="hidden"></div>
                  <div class="flex flex-col gap-2 items-center mt-4 mb-1.5">
        <div class="flex space-x-2 w-full justify-center">
          <div class="w-[45%]">
          <Versions />
          </div>
          <div class="w-[45%]">
          <World /></div>
        </div>
    
      </div>
              </div>


    
              
                  
           </div>
              
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full">
        <div class="scale-95 w-full -ml-1.5">
          {#await memoryReq}
            <div class="flex gap-12">
              <div
                class="w-[12rem] h-[8.3rem] bg-gradient-to-t from-[#152036] to-[#2c2a27] rounded-xl"
              ></div>
              <div
                class="w-[12rem] h-[8.3rem] bg-gradient-to-t from-[#152036] to-[#152436] rounded-xl"
              ></div>
            </div>
          {:then}
            {#if memoryStats != undefined && memoryStats.length > 0}
              <MemoryChart performance={memoryStats} type="2" />
              <CpuUsageChart performance={memoryStats} type="2" />
            {/if}
          {:catch}
            <div class="flex gap-12">
              <div
                class="w-[12rem] h-[8.3rem] bg-gradient-to-t from-[#152036] to-[#2c2a27] rounded-xl"
              ></div>
              <div
                class="w-[12rem] h-[8.3rem] bg-gradient-to-t from-[#152036] to-[#152436] rounded-xl"
              ></div>
            </div>
          {/await}
        </div>
      </div>

      {#if dynmap}
        <div
          class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]"
        >
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
        <div
          class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]"
        >
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
        <div
          class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]"
        >
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
        <div
          class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]"
        >
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
        <div
          class=" bg-base-100 rounded-lg mt-3 p-2 flex items-center gap-2 w-[20.75rem]"
        >
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
    

    </div>
    <!-- End Right Side-->
  </div>
  <!-- End Bottom Section-->
</div>


<style>
   .neutralGradientStroke {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 3px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>