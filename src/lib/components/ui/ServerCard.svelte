<script lang="ts">
  import { src_url_equal } from "svelte/internal";
  import { changeServerState } from "$lib/scripts/req";

  import { getServer } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { Loader } from "lucide-svelte";
  //Status variables

  let stopcolor = "info";
  let startcolor = "info";
  let starttext = "Start";
  let starting = false;
  let email = "noemail";
  let softwareType = "server";
  let address;
  if (browser) {
    localStorage.getItem("accountEmail");
  }
  let po = "?";
  let apo = 0;
  let lock = false;
  //Software variables
  type serverType =
    | "paper"
    | "spigot"
    | "bukkit"
    | "waterfall"
    | "velocity"
    | "forge"
    | "fabric"
    | "quilt"
    | "mohist"
    | "vanilla";

  export let name: string;
  export let version: string;
  export let software: string;
  export let state: string;
  export let id: number;

  if (software == "velocity") {
    softwareType = "proxy";
  }
  let restarting = false;

  function uppercaseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  software = uppercaseFirstLetter(software);

  let tname = name.toLowerCase().replace(/ /g, "-");
  function setName() {
    if (browser) {
      localStorage.setItem("serverName", name);
      localStorage.setItem("serverID", id);
      localStorage.setItem("serverSoftware", software);
      localStorage.setItem("serverVersion", version);
      localStorage.setItem("serverCardRedrict", "true");
    }
  }
  function status() {

    if (state == "true") {
      starting = false;
      stopcolor = "error";
      startcolor = "success";
      starttext = $t("button.restart");
    } else if (state == "false") {
      starting = false;
      stopcolor = "disabled";
      startcolor = "success";
      starttext = $t("button.start");
    } else if (state == "starting") {
      starting = true;
      stopcolor = "error";
      startcolor = "success";
      starttext = "Starting";
    } else if (state == "installing") {
      starting = true;
      stopcolor = "error";
      startcolor = "accent";
      starttext = "Installing";
    } else if (state == "stopping") {
      starting = false;
      stopcolor = "error";
      startcolor = "disabled";
      starttext = $t("button.start");

    }
  }
  status();
  function start() {
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
  }

  function getStatus() {
    if (state == "starting") {
      restarting = false;
    }
    getServer(id).then((data) => {
      if (data.state != state) {
        lock = false;
      }
      state = data.state;
      console.log("state " + state);
      status();
    });
  }
  //Run status function every 5 seconds if theyre still on this page
  if (browser) {
    address = localStorage.getItem("address");
    setInterval(function () {
      if (window.location.pathname == "/") {
        getStatus();
      }
    }, 3000);
  }
</script>

<div class="m-3 w-[21rem]">
  <div class="card w-50 bg-neutral shadow-xl image-full">
    <div class="card-body">
      <h2 class="card-title">{name}</h2>
      <p>
        {address}:{10000 + parseInt(id)}
      </p>
      <!-- <div class="card-actions justify-beginning" /> -->
      <div class="card-actions justify-end">
        <!-- placeholder for now? -->
        <div class="grow space-x-1.5 flex">
          <a href="/{softwareType}/{10000 + parseInt(id)}"
            ><button on:click={setName} class="btn btn-primary btn-sm h-9"
              >Info</button
            ></a
          >
          {#if restarting}
            <div
              id="start"
              class="flex w-[7.5rem] bg-success rounded-lg font-semibold uppercase text-base-100 text-[.65rem] tracking-wider px-3 items-center"
            >
              <Loader size="18" class="animate-spin" />
              {$t("button.restarting3")}
            </div>
            <button
              on:click={stop}
              class="btn btn-error btn-{stopcolor} btn-sm h-9 stop-btn btn-disabled"
              >{$t("button.stop")}</button
            >
          {:else}
            {#if !starting}
              <button
                on:click={start}
                id="start"
                type="submit"
                class="btn btn-{startcolor} btn-sm h-9">{starttext}</button
              >
            {:else}
              <div
                on:click={start}
                id="start"
                class="flex w-[7.5rem] bg-{startcolor} rounded-lg font-semibold uppercase text-base-100 text-[.76rem] tracking-wider px-3 items-center"
              >
                <Loader size="18" class="animate-spin" />
                {$t("button.starting3")}
              </div>
            {/if}
            <button
              on:click={stop}
              class="btn btn-error btn-{stopcolor} btn-sm h-9 stop-btn"
              >{$t("button.stop")}</button
            >
          {/if}
        </div>
        <div class="self-center">
          <div class="badge badge-outline right-4 top-4 absolute">
            {software}
            {(version === "latest") | (version === "Latest") ? "" : version}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
