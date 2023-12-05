<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { onMount } from "svelte";
  import {
    getPlayers,
    changeServerState,
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
  import EditInfo from "$lib/components/ui/EditInfo.svelte";
  import DeleteServer from "$lib/components/ui/DeleteServer.svelte";
  import ManageMods from "$lib/components/ui/ManageMods.svelte";
  import FullscreenTerminal from "$lib/components/buttons/FullscreenTerminal.svelte";
  import {
    ArrowLeft,
    FolderClosed,
    HelpCircle,
    Info,
    Loader,
    PlayCircle,
    Repeat,
    StopCircle,
    Trash2,
  } from "lucide-svelte";
  import StorageLimit from "$lib/components/ui/StorageLimit.svelte";
  import Versions from "$lib/components/buttons/Versions.svelte";

  let servers = [
    { name: "hub", ip: "arthmc.xyz:10000", isMain: true },
    { name: "survival", ip: "arthmc.xyz:11000", isMain: false },
  ];
  let scrollCorrected = false;
  let difference = -1;
  let fSecret = "rewdw";
  let lobbyName = "hub";
  let modded = false;
  let vanilla = false;
  let name: string = "-";
  let address: string;
  let tname: string;
  let url: string;
  let apo = 0;
  let po = 0;
  let port = 10000;
  let id = 0;
  let lock = false;
  let desc: string = "";

  let email: string = "";
  let state = "false";
  let icon = "";
  let hostName;

  let baseurl = apiurl;

  if (browser) {
    name = localStorage.getItem("serverName");
    hostName = localStorage.getItem("address");
    if (localStorage.getItem("serverCardRedrict") != "true") {
      id = parseInt(localStorage.getItem("serverID"));
    } else {
      id = parseInt(window.location.href.split("/")[4]) - 10000;
    }
    if (usingOcelot) {
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    }
    if (
      localStorage.getItem("serverSoftware") == "Fabric" ||
      localStorage.getItem("serverSoftware") == "Quilt" ||
      localStorage.getItem("serverSoftware") == "Forge"
    ) {
      modded = true;
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

  function addServer() {
    let subServerName = document.getElementById("subServerName").value;
    console.error(subServerName);
    let ip = document.getElementById("serverIP").value;

    if (subServerName != "" && ip != "") {
      fetch(
        baseurl +
          "server/" +
          id +
          "/proxy/servers?name=" +
          subServerName +
          "&ip=" +
          ip +
          "&secret=" +
          fSecret,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token"),
            email: localStorage.getItem("accountEmail"),
          },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          servers = data;
        });

      console.log(servers);
      document.getElementById("subServerName").value = "";
      document.getElementById("serverIP").value = "";
    }
  }

  function deleteServer(name) {
    console.log(baseurl + "server/" + id + "/proxy/servers?=" + name);
    fetch(baseurl + "server/" + id + "/proxy/servers?name=" + name, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        servers = data;
      });
  }

  if (browser) {
    email = localStorage.getItem("accountEmail");
    address = localStorage.getItem("address");
    //hide horizontal scrollbar
    document.body.style.overflowX = "hidden";
  }

  onMount(() => {
    name = localStorage.getItem("serverName");
    if (localStorage.getItem("serverCardRedrict") != "true") {
      id = parseInt(localStorage.getItem("serverID"));
    } else {
      if (browser) {
        id = parseInt(window.location.href.split("/")[4]) - 10000;
      }
    }
    localStorage.setItem("serverCardRedrict", "false");
    port += parseInt(id);

    //GET baseurl/server/id/getInfo
    fetch(baseurl + "server/" + id + "/getInfo", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        desc = data.desc;
        console.log(data.iconUrl + "icon");
        if (data.iconUrl != undefined) {
          console.log("icon is " + data.iconUrl);
          icon = data.iconUrl;
        } else {
          console.log("setting placeholder");
          icon = "/images/placeholder.webp";
        }
      });

    fetch(baseurl + "server/" + id + "/proxy/servers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        servers = data;
      });

    //fetch baseurl+server/id/proxy/secret

    fetch(baseurl + "server/" + id + "/proxy/info", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        fSecret = data.secret;
        lobbyName = data.lobbyName;
      });
    //wait half a second
    setTimeout(() => {
      //get players and store amount in a variable
      const gp = getPlayers("arthmc.xyz:" + port).then((response) => {
        if (browser) {
          console.log("port is " + port);
          apo = response;
        }
      });
    }, 500);
    //increase po evey second until it reaches apo
    setInterval(() => {
      if (po < apo) {
        po++;
      }
    }, 50);
  });
  //grab window url
  if (browser) {
    url = window.location.href;
    //set tname to url after the last slash
    tname = url.substring(url.lastIndexOf("/") + 1);
    //if tname has character encoding, decode it
    if (tname.includes("%")) {
      tname = decodeURIComponent(tname);
    }
  }
  function getStatus() {
    //get server status
    getServer(id).then((response) => {
      //convert addons array to string, save it to "serverAddons" array
      localStorage.setItem("serverAddons", response.addons.toString());

      //set state to response
      state = response.state;
      if (state == "starting") {
        console.log("unlocking");
        lock = false;
      }
    });
  }

  function setLobbyName() {
    console.log("setting lobby name");
    lobbyName = document.getElementById("lobbyName").value;
    console.log(lobbyName);
    fetch(baseurl + "server/" + id + "/proxy/info?lobbyName=" + lobbyName, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("lobbyName").value = "";
      });
  }

  function start() {
    console.log(lock);
    if (!lock) {
      if (state == "true") {
        changeServerState("restart", id, email);
      } else if (state == "false") {
        changeServerState("start", id, email);
      }
    }
  }

  function stop() {
    changeServerState("stop", id, email);
    lock = false;
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
        if (decodeURIComponent(window.location.pathname) == "/proxy/" + tname) {
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
      console.log("sending " + input + " to " + id);
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

        //scroll down the height of the new lines added
        if (
          terminal.innerHTML.split("<p>").length <
          filteredResponse.split("<p>").length
        ) {
          terminalContainer.scrollTop +=
            12 *
            (filteredResponse.split("<p>").length -
              terminal.innerHTML.split("<p>").length);
        }

        //response replace newlines with <p>, remove things that start with [ and end with m
        if (response.length < 100000) {
          if (
            filteredResponse.length - terminal.innerHTML.length !=
            difference
          ) {
            difference = filteredResponse.length - terminal.innerHTML.length;

            terminal.innerHTML = filteredResponse;
          }
        } else {
          terminal.innerHTML = filteredResponse;
        }
        if (scrollCorrected == false) {
          terminalContainer.scrollTop = terminalContainer.scrollHeight;
          if (
            terminalContainer.scrollHeight - terminalContainer.scrollTop <=
            384
          ) {
            scrollCorrected = true;
          }
        }
      });
    }
    //set terminal's text to rt
  }
  readCmd();
</script>

<div class="lg:-mt-10">
  <div class=" flex justify-between mb-2">
    <div class="space-x-2 space-y-2 mb-2 flex flex-col items-center md:block">
      <a href="/" class="btn btn-info"
        ><ArrowLeft class="mr-1.5" />
        {$t("button.back")}</a
      >
      <DeleteServer />
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
          class="inline-flex pointer-events-none bg-accent flex items-center px-4 py-3 text-center text-sm font-semibold text-white uppercase rounded-md"
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
    class="space-x-7 xs:flex xs:flex-col-reverse md:flex justify-between p-10"
  >
    <div class="flex flex-col items-center space-y-3 md:space-y-0">
      <div id="terminalContainerContainer" class="relative">
        <FullscreenTerminal />
        <div
          id="terminalContainer"
          class="bg-base-300 h-96 rounded-xl shadow-xl overflow-auto w-[20rem] lg:w-[30rem] xl:w-[50rem] 2xl:w-[60rem]"
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
        class="input input-secondary bg-base-200 w-[19rem] lg:w-[22.5rem] lg:w-[30rem] xl:w-[50rem] 2xl:w-[60rem]"
      />
      <div class="divider md:hidden pt-5 pb-4" />
    </div>

    <div
      class="flex flex-col items-center place-content-end mb-20 pr-6 md:pl-0"
    >
      <div class="space-y-5 mb-4">
        <div
          class="rounded-xl bg-base-200 shadow-xl image-full mt-4 md:mt-0 w-[19rem] lg:w-[22.5rem] md:w-auto"
        >
          <div class="flex relative">
            <div class="p-4 space-x-4 flex">
              <img id="xIcon" src={icon} class="w-[4rem] h-[4rem] rounded-md" />

              <div class="">
                <div class="stat-title">{$t("server.ip")}</div>
                <div class="font-bold text-sm sm:text-lg md:text-3xl">
                  {address}:{port}
                </div>
                <div id="xDesc" class="text-xs font-light flex justify-between">
                  Description: {desc}
                </div>
              </div>
            </div>
            <a
              href="https://arthmc.xyz/docs/how-to-join-servers"
              target="_blank"
              rel="noreferrer"
              class="btn btn-ghost btn-sm md:btn-xs absolute bottom-2 right-2.5 md:top-3 md:right-11 md:-mb-2.5"
            >
              <HelpCircle size="18" class="md:mr-1" />
              <p class="hidden md:block">How to join</p></a
            >
            <EditInfo />
          </div>
        </div>
      </div>

      <div class="flex place-content-center w-[10.6rem] space-x-2">
        {#if modded}<AddMod /><ManageMods />{:else if !vanilla}
          <Add /><Manage />
        {/if}
      </div>
      <div
        class=" bg-base-200 mt-4 rounded-xl px-4 py-3 shadow-xl w-[19rem] lg:w-[22.5rem]"
      >
        <p class="text-xl font-bold">{$t("subservers.title")}</p>

        <div class="p-2 flex flex-col space-y-2" id="servers">
          {#each servers as server}
            <div class="flex space-x-1">
              <div
                class="p-1 bg-base-300 rounded-lg px-2 flex justify-between space-x-10 w-full"
              >
                <b>{server.name}</b>
                <p>{server.ip}</p>
              </div>
              <div
                class="p-1 btn btn-sm btn-error rounded-lg px-2 flex justify-between items-center"
                on:click={() => deleteServer(server.name)}
              >
                <Trash2 size="18" />
              </div>
            </div>
          {/each}
        </div>
        <div class="space-x-1.5 space-y-1.5">
          <label class="label" for="username"
            >{$t("subservers.h.addServer")}</label
          >

          <input
            id="subServerName"
            class="input input-sm input-bordered"
            placeholder={$t("subservers.p.name")}
            type="text"
          />
          <input
            id="serverIP"
            class="input input-sm input-bordered"
            placeholder={$t("subservers.p.ip")}
            type="text"
          />
          <button class="btn btn-sm btn-secondary" on:click={addServer}>
            {$t("subservers.button.add")}
          </button>
        </div>
        <div class="space-x-1.5 space-y-1.5">
          <label class="label" for="lobbyName"
            >{$t("subservers.h.sendPlayersTo")}</label
          >

          <input
            id="lobbyName"
            class="input input-sm w-1/2 md:w-auto input-bordered"
            placeholder="{$t('currently')} '{lobbyName}'"
            type="text"
          />
          <button class="btn btn-neutral btn-sm" on:click={setLobbyName}>
            {$t("sumbit")}
          </button>
        </div>
      </div>
      <div
        class="bg-primary w-[19rem] lg:w-[22.5rem] rounded-lg text-black p-2 flex items-center mb-2 space-x-2 mt-4"
      >
        <Info />
        <span class="text-sm w-[19rem] lg:w-[22.5rem] flex flex-wrap"
          >{$t("proxy.forwardingSecret1")}
          <code class="bg-gray-500 rounded p-0.5 flex ml-1"
            ><div class="dropdown">
              <label tabindex="0" class="">{$t("proxy.showSecret")}</label>
              <div
                tabindex="0"
                class="dropdown-content bg-gray-600 rounded p-1"
              >
                {fSecret}
              </div>
            </div></code
          >{$t("proxy.forwardingSecret2")}{hostName}{$t(
            "proxy.forwardingSecret3"
          )}
          <code class="bg-gray-500 rounded p-0.5 mr-1"
            >config/paper-global.yml</code
          >
          {$t("proxy.forwardingSecret4")}</span
        >
      </div>

      <div class="w-[20rem] flex flex-col items-center">
        <div class="flex space-x-2 mb-2 mt-4">
          <EditInfo type="fullBtn" /><StorageLimit />
        </div>
        <div class="flex space-x-2">
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
