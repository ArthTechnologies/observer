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
  } from "$lib/scripts/req";
  import { getServer } from "$lib/scripts/req";

  import { t, locale, locales } from "$lib/scripts/i18n";

  import Manage from "$lib/components/ui/Manage.svelte";
  import AddMod from "$lib/components/ui/AddMod.svelte";
  import Add from "$lib/components/ui/Add.svelte";
  import EditInfo from "$lib/components/ui/EditInfo.svelte";
  import DeleteServer from "$lib/components/ui/DeleteServer.svelte";
  import ManageMods from "$lib/components/ui/ManageMods.svelte";
  import Updates from "$lib/components/buttons/Updates.svelte";
  import World from "$lib/components/ui/World.svelte";

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
  let restarting = false;
  let email: string = "";
  let state = "false";
  let icon = "";
  let secret = "";

  if (browser) {
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
    console.log(apiurl + "server/" + id + "/getInfo");
    //GET apiurl/server/id/getInfo
    fetch(apiurl + "server/" + id + "/getInfo", {
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
        console.log(data.secret + "secret");
        secret = data.secret;

        //add checked property to toggle

        if (data.proxiesEnabled) {
          document.getElementById("proxiesEnabled").checked = true;
        } else {
          document.getElementById("proxiesEnabled").checked = false;
        }

        document.getElementById("fSecret").value = data.secret;
        if (data.iconUrl != undefined) {
          console.log("icon is " + data.iconUrl);
          icon = data.iconUrl;
        } else {
          console.log("setting placeholder");
          icon = "/images/placeholder.webp";
        }
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
      console.log(state);
      if (restarting && state == "starting") {
        restarting = false;
        console.log("unlocking");
        lock = false;
      }
    });
  }

  function start() {
    console.log(lock);
    if (!lock) {
      if (state == "true") {
        changeServerState("restart", id, email);

        restarting = true;
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
        if (
          decodeURIComponent(window.location.pathname) ==
          "/server/" + tname
        ) {
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
    readTerminal(id).then((response) => {
      if (browser) {
        //response replace newlines with <p>, remove things that start with [ and end with m
        document.getElementById("terminal").innerHTML = response
          .replace(/\x1B\[[0-9;]*[mG]/g, "")
          .replace(/\n/g, "<p>");
        setTimeout(() => {
          const terminal = document.getElementById("terminal");
          terminal.scrollTop = terminal.scrollHeight;
        }, 20);
      }
    });
    //set terminal's text to rt
  }
  readCmd();
</script>

<div class="h-[75vh]">
  <div class=" flex justify-between">
    <div class="space-x-2 space-y-2 mb-2 flex flex-col items-center md:block">
      <a href="/" class="btn btn-info"
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
          class="feather feather-arrow-left mr-1.5"
          ><line x1="19" y1="12" x2="5" y2="12" /><polyline
            points="12 19 5 12 12 5"
          /></svg
        >
        {$t("button.back")}</a
      >
      <DeleteServer />
      <Updates />
      <World />
    </div>
    <!-- TODO: these should be on the right, add an if for not reaching the backend -->
    <div class="space-x-2 space-y-2 flex flex-col items-center md:block">
      {#if state == "true" && !restarting}
        <button on:click={start} class="btn btn-success"
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
            class="feather feather-repeat mr-1.5"
            ><polyline points="17 1 21 5 17 9" /><path
              d="M3 11V9a4 4 0 0 1 4-4h14"
            /><polyline points="7 23 3 19 7 15" /><path
              d="M21 13v2a4 4 0 0 1-4 4H3"
            /></svg
          >{$t("button.restart")}</button
        >
        <button on:click={stop} class="btn btn-error"
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
            class="feather feather-stop-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><rect
              x="9"
              y="9"
              width="6"
              height="6"
            /></svg
          >{$t("button.stop")}</button
        >
      {:else if restarting}
        <button class="btn btn-success"
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
            class="feather feather-loader animate-spin mr-1.5"
            ><line x1="12" y1="2" x2="12" y2="6" /><line
              x1="12"
              y1="18"
              x2="12"
              y2="22"
            /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line
              x1="16.24"
              y1="16.24"
              x2="19.07"
              y2="19.07"
            /><line x1="2" y1="12" x2="6" y2="12" /><line
              x1="18"
              y1="12"
              x2="22"
              y2="12"
            /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line
              x1="16.24"
              y1="7.76"
              x2="19.07"
              y2="4.93"
            /></svg
          >
          {$t("button.restarting")}</button
        >

        <button class="btn btn-disabled"
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
            class="feather feather-stop-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><rect
              x="9"
              y="9"
              width="6"
              height="6"
            /></svg
          >{$t("button.stop")}</button
        >
      {:else if state == "false"}
        <button on:click={start} class="btn btn-success"
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
            class="feather feather-play-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><polygon
              points="10 8 16 12 10 16 10 8"
            /></svg
          >{$t("button.start")}</button
        >
        <a href="/" class="btn btn-disabled"
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
            class="feather feather-stop-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><rect
              x="9"
              y="9"
              width="6"
              height="6"
            /></svg
          >{$t("button.stop")}</a
        >
      {:else if state == "starting"}
        <button class="btn btn-success"
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
            class="feather feather-loader animate-spin mr-1.5"
            ><line x1="12" y1="2" x2="12" y2="6" /><line
              x1="12"
              y1="18"
              x2="12"
              y2="22"
            /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line
              x1="16.24"
              y1="16.24"
              x2="19.07"
              y2="19.07"
            /><line x1="2" y1="12" x2="6" y2="12" /><line
              x1="18"
              y1="12"
              x2="22"
              y2="12"
            /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line
              x1="16.24"
              y1="7.76"
              x2="19.07"
              y2="4.93"
            /></svg
          >
          {$t("button.starting")}</button
        >
        <button on:click={stop} class="btn btn-error"
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
            class="feather feather-stop-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><rect
              x="9"
              y="9"
              width="6"
              height="6"
            /></svg
          >{$t("button.stop")}</button
        >
      {:else if state == "installing"}
        <button class="btn btn-accent"
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
            class="feather feather-loader animate-spin mr-1.5"
            ><line x1="12" y1="2" x2="12" y2="6" /><line
              x1="12"
              y1="18"
              x2="12"
              y2="22"
            /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line
              x1="16.24"
              y1="16.24"
              x2="19.07"
              y2="19.07"
            /><line x1="2" y1="12" x2="6" y2="12" /><line
              x1="18"
              y1="12"
              x2="22"
              y2="12"
            /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line
              x1="16.24"
              y1="7.76"
              x2="19.07"
              y2="4.93"
            /></svg
          >
          Installing</button
        >
        <button on:click={stop} class="btn btn-error"
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
            class="feather feather-stop-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><rect
              x="9"
              y="9"
              width="6"
              height="6"
            /></svg
          >Stop</button
        >
      {:else if state == "stopping"}
        <button class="btn btn-disabled"
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
            class="feather feather-play-circle mr-1.5"
            ><circle cx="12" cy="12" r="10" /><polygon
              points="10 8 16 12 10 16 10 8"
            /></svg
          >{$t("button.start")}</button
        >
        <button class="btn btn-error"
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
            class="feather feather-loader animate-spin mr-1.5"
            ><line x1="12" y1="2" x2="12" y2="6" /><line
              x1="12"
              y1="18"
              x2="12"
              y2="22"
            /><line x1="4.93" y1="4.93" x2="7.76" y2="7.76" /><line
              x1="16.24"
              y1="16.24"
              x2="19.07"
              y2="19.07"
            /><line x1="2" y1="12" x2="6" y2="12" /><line
              x1="18"
              y1="12"
              x2="22"
              y2="12"
            /><line x1="4.93" y1="19.07" x2="7.76" y2="16.24" /><line
              x1="16.24"
              y1="7.76"
              x2="19.07"
              y2="4.93"
            /></svg
          >
          Stopping</button
        >
      {/if}
    </div>
  </div>
  <div class="flex flex-col mt-5 md:mt-0">
    <div class="text-5xl font-bold divider">{name}</div>
  </div>

  <div
    class="space-x-7 xs:flex xs:flex-col-reverse md:flex justify-between p-10"
  >
    <div class="flex flex-col items-center space-y-3 md:space-y-0">
      <div
        class="bg-base-300 w-[19rem] h-96 lg:h-[30rem] rounded-xl shadow-xl overflow-auto lg:w-[30rem] xl:w-[50rem]"
      >
        <p class="p-5 sm:text-xs xl:text-base font-mono" id="terminal" />
      </div>
      <input
        on:keypress={writeCmd}
        id="input"
        type="text"
        placeholder={$t("p.enterCommand")}
        class="input input-secondary bg-base-200 w-64 lg:w-[30rem] xl:w-[50rem]"
      />
      <div class="divider md:hidden pt-5 pb-4" />
    </div>

    <div
      class="flex flex-col items-center place-content-end mb-20 pr-6 md:pl-0"
    >
      <div class="space-y-5 mb-4">
        <div
          class="rounded-xl bg-base-200 shadow-xl image-full mt-4 md:mt-0 w-56 md:w-auto"
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
              class="btn btn-ghost btn-xs absolute bottom-2 right-0.5 md:top-3 md:right-11 -mb-2.5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class=" feather feather-help-circle md:mr-1"
                ><circle cx="12" cy="12" r="10" /><path
                  d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
                /><line x1="12" y1="17" x2="12.01" y2="17" /></svg
              >
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
        class=" bg-base-200 mt-4 rounded-xl px-4 py-3 shadow-xl w-64 md:w-auto"
      >
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
      <p class="text-xl font-bold mt-4 mb-2">Advanced</p>
      <div class="flex space-x-2" />
    </div>
  </div>
</div>
