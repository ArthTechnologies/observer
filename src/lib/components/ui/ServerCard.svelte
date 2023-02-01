<script lang="ts">
  import { src_url_equal } from "svelte/internal";
  import { changeServerState } from "$lib/scripts/req.js";

  import { getServer } from "$lib/scripts/req.js";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  //Status variables

  let stopcolor = "info";
  let startcolor = "info";
  let starttext = "Start";
  let starting = false;
  let email = "noemail";
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
    }
  }
  function status() {
    if (state == "true") {
      starting = false;
      stopcolor = "error";
      startcolor = "warning";
      starttext = $t("button.restart");
    } else if (state == "false") {
      starting = false;
      stopcolor = "disabled";
      startcolor = "success";
      starttext = $t("button.start");
    } else if (state == "starting") {
      starting = true;
      stopcolor = "error";
      startcolor = "disabled";
      starttext = "Starting";
    }
  }
  status();
  function start() {
    if (!lock) {
      if (state == "true") {
        changeServerState("restart", id, email);
      } else if (state == "false") {
        changeServerState("start", id, email);
      }
      lock = true;
    }
  }

  function stop() {
    changeServerState("stop", id, email);
  }

  function getStatus() {
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
    setInterval(function () {
      if (window.location.pathname == "/") {
        getStatus();
      }
    }, 5000);
  }
</script>

<div class="m-3 w-[20rem]">
  <div class="card w-50 bg-base-100 shadow-xl image-full">
    <div class="card-body">
      <h2 class="card-title">{name}</h2>
      <p>
        arthmc.xyz:{10000 + parseInt(id)}
      </p>
      <!-- <div class="card-actions justify-beginning" /> -->
      <div class="card-actions justify-end ">
        <!-- placeholder for now? -->
        <div class="grow space-x-1.5 flex">
          <a href="/server/{tname}"
            ><button on:click={setName} class="btn btn-primary btn-sm h-9"
              >Info</button
            ></a
          >
          {#if !starting}
            <button
              on:click={start}
              id="start"
              type="submit"
              class="btn btn-success btn-sm h-9">{starttext}</button
            >
          {:else}
            <div
              on:click={start}
              id="start"
              class="flex w-25 bg-success rounded-lg font-semibold uppercase text-base-100 text-[.79rem] tracking-wider  px-3  items-center"
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
                class="feather feather-loader animate-spin"
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
              {$t("button.starting2")}
            </div>
          {/if}
          <button
            on:click={stop}
            class="btn btn-error btn-{stopcolor} btn-sm h-9 stop-btn"
            >{$t("button.stop")}</button
          >
        </div>
        <div class="self-center">
          <div class="badge badge-outline right-4 top-4 absolute">
            {software}
            {version === "latest" ? "" : version}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style lang="scss">
  //
</style>
