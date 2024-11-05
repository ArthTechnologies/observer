<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { onMount } from "svelte";
  import {
    getPlayers,
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
  import ServerSettings from "$lib/components/ui/ServerSettings.svelte";
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
    Settings,
    ClipboardList,
    ArrowUpSquare,
    ExternalLink,
    Send,
    FileCog,
  } from "lucide-svelte";
  import StorageLimit from "$lib/components/ui/StorageLimit.svelte";
  import Versions from "$lib/components/buttons/Versions.svelte";
  import FullscreenMap from "$lib/components/pages/server/FullscreenMap.svelte";
  import { write } from "fs";
  import { alert } from "$lib/scripts/utils";
  let scrollCorrected = false;
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
  let webmap = false;
  let webmapurl =
    "http://" + apiurl.substring(0, apiurl.length - 1).split("https://")[1];
  let voicechat = false;
  let chunky = false;
  let discordsrv = false;
  let subdomain = undefined;

  if (browser) {
    if (localStorage.getItem("updateAlert") != "dynmap") {
      localStorage.setItem("updateAlert", "dynmap");
      alert(
        "Update: Dynmap & Simple Voice Chat support have been added.",
        "info"
      );
    }

    name = localStorage.getItem("serverName");
    if (localStorage.getItem("serverCardRedrict") != "true") {
      id = parseInt(localStorage.getItem("serverID"));
    } else {
      id = parseInt(window.location.href.split("/")[4]) - 10000;
    }
    if (
      localStorage.getItem("serverSoftware") == "Fabric" ||
      localStorage.getItem("serverSoftware") == "Quilt" ||
      localStorage.getItem("serverSoftware") == "Forge"
    ) {
      modded = true;
    }

    if (localStorage.getItem("serverSubdomain") != undefined) {
      subdomain = localStorage.getItem("serverSubdomain");
    }

    if (localStorage.getItem("serverWebmap") == "true") {
      webmap = true;
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

      //wait 200 ms then read terminal
      setTimeout(() => {
        readCmd();
      }, 200);
    } else {
      getStatus();

      writeTerminal(id, "gamerule doDaylightCycle true");

      document.getElementById("alwaysDay").checked = false;

      //wait 200 ms then read terminal
      setTimeout(() => {
        readCmd();
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
      readCmd();
    }, 200);
  }

  function OpPlayer() {
    let input = document.getElementById("username").value;

    getStatus();

    writeTerminal(id, "op " + input);

    document.getElementById("username").value = "";

    //wait 200 ms then read terminal
    setTimeout(() => {
      readCmd();
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

          //add checked property to toggle

          if (data.proxiesEnabled) {
            document.getElementById("proxiesEnabled").checked = true;
          } else {
            document.getElementById("proxiesEnabled").checked = false;
          }

          if (data.automaticRestart) {
            document.getElementById("automaticRestart").checked = true;
          } else {
            document.getElementById("automaticRestart").checked = false;
          }

          document.getElementById("fSecret").value = data.secret;
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
      localStorage.setItem("serverAddons", response.addons.toString());
      localStorage.setItem("serverVersion", response.version);
      localStorage.setItem("serverWebmap", response.webmap);
      localStorage.setItem("serverVoicechat", response.voicechat);
      localStorage.setItem("serverChunky", response.chunky);
      localStorage.setItem("serverDiscordSRV", response.discordsrv);

      if (response.webmap == true && webmap == false) {
        setTimeout(() => {
          webmap = true;
        }, 5000);
      }
      if (response.voicechat == true && voicechat == false) {
        setTimeout(() => {
          voicechat = true;
        }, 500);
      }

      if (response.chunky == true && chunky == false) {
        setTimeout(() => {
          chunky = true;
        }, 2000);
      }

      if (response.discordsrv == true && discordsrv == false) {
        discordsrv = true;
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

  onMount(() => {
    setTimeout(() => {
      getStatus();
      readCmd();
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

          readCmd();
        }
      }, interval);
    }
    getStatus();
  });

  function writeCmd(event) {
    //take input value
    let input = document.getElementById("input").value;
    //if theres a / at the beginning, remove it
    if (input.startsWith("/")) {
      input = input.substring(1);
    }
    //if key pressed is enter, send alert
    if (event.keyCode == 13) {
      getStatus();
      writeTerminal(id, input);
      //clear input
      document.getElementById("input").value = "";

      //wait 200 ms then read terminal
      setTimeout(() => {
        readCmd();
      }, 200);
    }
  }

  function readCmd() {
    let rt;

    if (browser) {
      readTerminal(id).then((response) => {
        const terminalContainer = document.getElementById("terminalContainer");
        const terminal = document.getElementById("terminal");
        const filteredResponse = response
          .replace(/\x1B\[[0-9;]*[mG]/g, "")
          .replace(/\n/g, "<p>");

        //response replace newlines with <p>, remove things that start with [ and end with m
        if (response.length < 100000) {
          terminalContainer.scrollTop +=
            50 *
            (filteredResponse.split("<p>").length -
              terminal.innerHTML.split("<p>").length);
          if (
            filteredResponse.length - terminal.innerHTML.length !=
            difference
          ) {
            difference = filteredResponse.length - terminal.innerHTML.length;

            terminal.innerHTML = filteredResponse;
          }
        } else {
          terminalContainer.scrollTop +=
            50 *
            (filteredResponse
              .substring(filteredResponse.length - 100000)
              .split("<p>").length -
              terminal.innerHTML.split("<p>").length);
          terminal.innerHTML = filteredResponse.substring(
            filteredResponse.length - 100000
          );
        }

        //scroll down the height of the new lines added
        if (
          terminal.innerHTML.split("<p>").length <
          filteredResponse.split("<p>").length
        ) {
          //adding to scrollTop doesn't get it to the complete bottom,
          //so this remedies that by snapping it to the bottom if needed.
          let difference =
            terminalContainer.scrollHeight - terminalContainer.scrollTop;
          const terminalContainerContainer = document.getElementById(
            "terminalContainerContainer"
          );
          if (difference <= terminalContainerContainer?.clientHeight) {
            setTimeout(() => {
              terminalContainer.scrollTop = terminalContainer.scrollHeight;
            }, 1);
          }
        }

        //if this is the first time the terminal is loaded, this will scroll to the bottom.
        if (scrollCorrected == false) {
          terminalContainer.scrollTop = terminalContainer.scrollHeight;

          scrollCorrected = true;
        }
      });
    }
  }
  readCmd();

  function webmapRender() {
    writeTerminal(id, "dynmap fullrender world");
  }

  function pregen() {
    let radius = document.getElementById("pregenRadius").value;
    writeTerminal(id, "chunky start world circle 0 0 " + radius);
    document.getElementById("pregenRadius").value = "";
  }
</script>

<div class="lg:-mt-10">
  <div class=" flex justify-between mb-2">
    <div class="space-x-2 space-y-2 mb-2 flex flex-col items-center md:block">
      <a href="/" class="btn btn-info"
        ><ArrowLeft class="mr-1.5" />
        {$t("button.back")}</a
      >
      <DeleteServer />
      <Updates />
      <World />
    </div>
    <!-- TODO: these should be on the right, add an if for not reaching the backend -->
    <div class="space-x-2 space-y-2 flex flex-col items-center md:block">
      {#if state == "true"}
        <button on:click={start} class="btn btn-success"
          ><Repeat class="mr-1.5" />{$t("button.restart")}</button
        >
        <button on:click={stop} class="btn btn-error"
          ><StopCircle class="mr-1.5" />{$t("button.stop")}</button
        >
      {:else if state == "false"}
        <button on:click={start} class="btn btn-success"
          ><PlayCircle class="mr-1.5" />{$t("button.start")}</button
        >
        <a href="/" class="btn btn-disabled"
          ><StopCircle class="mr-1.5" />{$t("button.stop")}</a
        >
      {:else if state == "starting"}
        <div
          class="inline-flex pointer-events-none bg-success flex items-center px-4 py-3 text-center text-sm font-semibold text-black uppercase rounded-md"
        >
          <Loader class="animate-spin mr-1.5" />
          {$t("button.starting")}
        </div>
        <button on:click={stop} class="btn btn-error"
          ><StopCircle class="mr-1.5" />{$t("button.stop")}</button
        >
      {:else if state == "installing"}
        <div
          class="inline-flex pointer-events-none bg-accent flex items-center px-4 py-3 text-center text-sm font-semibold text-base-300 uppercase rounded-md"
        >
          <Loader class="animate-spin mr-1.5" />
          {$t("button.installing")}
        </div>
        <button on:click={stop} class="btn btn-error"
          ><StopCircle class="mr-1.5" />{$t("button.stop")}</button
        >
      {:else if state == "stopping"}
        <button class="btn btn-disabled">
          <PlayCircle class="mr-1.5" />{$t("button.start")}
        </button>
        <div
          class="inline-flex pointer-events-none bg-error flex items-center px-4 py-3 text-center text-sm font-semibold text-black uppercase rounded-md"
        >
          <Loader class="animate-spin mr-1.5" />
          {$t("button.stopping")}
        </div>
      {/if}
    </div>
  </div>
  <div class="flex flex-col mt-5 md:mt-0">
    <div
      class="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold divider"
      id="serverName"
    >
      {name}
    </div>
  </div>

  <div
    class="space-x-7 xs:flex xs:flex-col-reverse md:flex justify-between py-10 px-5 md:px-10"
  >
    <div class="flex flex-col items-center space-y-3 md:space-y-0">
      <div id="terminalContainerContainer" class="relative mb-1.5">
        <FullscreenTerminal />
        <div
          id="terminalContainer"
          class="bg-base-300 rounded-xl overflow-auto w-[23rem] lg:w-[30rem] xl:w-[50rem] 2xl:w-[60rem] h-[30rem] 2xl:h-[35rem]"
        >
          <div class="p-5 sm:text-xs xl:text-base font-mono relative">
            <p id="terminal" />
          </div>
        </div>
      </div>
      <input
        on:keypress={writeCmd}
        id="input"
        type="text"
        placeholder={$t("p.enterCommand")}
        class="input input-secondary bg-base-200 w-[23rem] lg:w-[30rem] xl:w-[50rem] 2xl:w-[60rem]"
      />
      <div class="divider md:hidden pt-5 pb-4" />
    </div>

    <div
      class="flex flex-col items-center place-content-end mb-20 pr-6 md:pl-0"
    >
      <div class="space-y-5 mb-4">
        <div
          class="rounded-xl bg-base-200 shadow-xl image-full mt-4 md:mt-0 w-[20rem] md:w-auto"
        >
          <div class="flex relative w-[20rem] md:w-[22.4rem]">
            <div class="p-4 space-x-4 flex">
              <img id="xIcon" src={icon} class="w-[4rem] h-[4rem] rounded-md" />

              <div class="">
                <div class="stat-title">{$t("server.ip")}</div>
                <div class="font-bold sm:text-lg md:text-[1.6rem] mt-1">
                  {#if subdomain == undefined}{address}:{port}{:else}
                    {subdomain}.{address}
                  {/if}
                </div>
                <div id="xDesc" class="text-xs font-light flex mt-1">
                  Description: {@html desc}
                </div>
                <div id="rawDesc" class="hidden"></div>
              </div>
            </div>
            <a
              href="https://arthmc.xyz/docs/how-to-join-servers"
              target="_blank"
              rel="noreferrer"
              class="btn btn-ghost btn-sm md:btn-xs absolute bottom-2 right-2.5 md:top-3 md:right-11 md:-mb-2.5"
            >
              <HelpCircle size="18" class="md:mr-1.5" />
              <p class="hidden md:block">How to join</p></a
            >
            <ServerSettings type="smallBtn" />
          </div>
        </div>
      </div>

      <div class="w-[10.6rem] flex place-content-center space-x-2 mb-2">
        {#if modded}<AddMod /><ManageMods />{:else if !vanilla}
          <Add /><Manage />
        {/if}
      </div>
      {#if webmap}
        <div class=" bg-base-300 rounded-lg mt-3 p-2 flex gap-2 w-[21.75rem]">
          <img
            alt="dynmap-icon"
            class="w-8 h-8 rounded-lg bg-base-100"
            src="/images/dynmap.webp"
          />

          <div class="divider divider-horizontal m-0"></div>
          <div
            style="text-wrap: nowrap;"
            class="tooltip tooltip-top tooltip-info z-50 hidden sm:block"
            data-tip="Only renders overworld. See guide for more info."
          >
            <button
              on:click={webmapRender}
              class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.dynmap.render")}</button
            >
          </div>
          <a
            href="https://arthmc.xyz/docs/using-dynmap"
            target="_blank"
            rel="noreferrer"
            ><button class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.dynmap.guide")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
          <a
            href="{webmapurl}:{parseInt(id) + 10200}"
            target="_blank"
            rel="noreferrer"
          >
            <button class="btn btn-sm items-center hover:bg-base-100"
              >{$t("plugins.dynmap.map")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
        </div>
        <!--<div class="mt-5 relative">
          <iframe
            title="Webmap of the server's world"
            type="text/html"
            src="{webmapurl}:{parseInt(id) + 10200}"
            class="shadow-xl w-full rounded-xl"
            height="300"
          />
          <div
            class="absolute bottom-0 w-full bg-neutral rounded-b-lg bg-opacity-50 backdrop-blur-xl p-2 flex gap-2"
          >
            <button on:click={webmapRender} class="btn btn-sm"
              >Render World</button
            >
            <button
              class="btn btn-sm btn-ghost"
              on:click={() => {
                navigator.clipboard.writeText(
                  `${webmapurl}:${parseInt(id) + 10200}`
                );
              }}
              ><ClipboardList size="16" class="mr-1" />
              Copy Link</button
            >
          </div>
          <FullscreenMap />
        </div>!-->
      {/if}
      {#if voicechat}
        <div class=" bg-base-300 rounded-lg mt-3 p-2 flex gap-2 w-[21.75rem]">
          <div class="dropdown dropdown-hover">
            <img
              alt="dynmap-icon"
              class="w-8 h-8 rounded-lg bg-base-100"
              src="/images/voicechat.webp"
            />
          </div>

          <div class="divider divider-horizontal m-0"></div>
          <a
            href="https://arthmc.xyz/docs/using-simple-voice-chat"
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
        <div class=" bg-base-300 rounded-lg mt-3 p-2 flex gap-2 w-[21.75rem]">
          <div class="dropdown dropdown-hover">
            <img
              alt="dynmap-icon"
              class="w-8 h-8 rounded-lg bg-base-100"
              src="/images/chunky.webp"
            />
          </div>
          <div class="divider divider-horizontal m-0"></div>
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
        <div class=" bg-base-300 rounded-lg mt-3 p-2 flex gap-2 w-[21.75rem]">
          <div class="dropdown dropdown-hover">
            <img
              alt="dynmap-icon"
              class="w-8 h-8 rounded-lg bg-base-100"
              src="/images/discordsrv.webp"
            />
          </div>

          <div class="divider divider-horizontal m-0"></div>
          <a
            href="https://docs.discordsrv.com/installation/initial-setup"
            target="_blank"
            rel="noreferrer"
            ><button class="btn btn-neutral btn-sm items-center"
              >{$t("plugins.discordsrv.guide")}
              <ExternalLink size="18" class="ml-1" /></button
            ></a
          >
        </div>
      {/if}
      <div class=" bg-base-200 mt-5 rounded-xl px-4 py-3 w-[20rem] md:w-auto">
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
      <div class="w-[20rem] flex flex-col items-center">
        <div class="flex space-x-2 mb-2 mt-4">
          <ServerSettings type="fullBtn" /><StorageLimit />
        </div>
        <div class="flex">
          <a
            class="btn btn-primary mr-2"
            href="/server/{parseInt(id) + 10000}/files"
            ><FolderClosed class="mr-1.5" />{$t("button.files")}</a
          ><Versions />
        </div>
      </div>
    </div>
  </div>
</div>
