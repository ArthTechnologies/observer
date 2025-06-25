<script lang="ts">
  import { onMount, src_url_equal } from "svelte/internal";
  import { changeServerState } from "$lib/scripts/req";

  import { getServer } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { Loader } from "lucide-svelte";
  //Status variables

  let startcolor = "accent";
  let starttext = "Start";
  let loading = false;
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
  let version2;
  if (version.includes("*")) {
    let array = version.split("*");
    version2 = array[0] + " " + array[1].charAt(0).toUpperCase() + array[1].slice(1);
  } else {
    version2 = version;
  }
  export let software: string;
  export let state: string;
  export let id: number;
  export let dynmap: boolean;
  export let voicechat: boolean;
  export let subdomain;

  if (software == "velocity") {
    softwareType = "proxy";
  }
  let restarting = false;

  function uppercaseFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  $: software = uppercaseFirstLetter(software);

  function status() {
    if (state == "true") {
      loading = false;
      startcolor = "success";
      starttext = $t("button.restart");
    } else if (state == "false") {
      loading = false;
      startcolor = "success";
      starttext = $t("button.start");
    } else if (state == "starting") {
      loading = true;
      startcolor = "success";
      starttext = $t("button.starting");
    } else if (state == "installing") {
      console.error("installing");
      loading = true;
      startcolor = "accent";
      starttext = $t("button.installing");
    } else if (state == "stopping") {
      loading = false;
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
      status();
    });
  }
  //Run status function every 5 seconds if theyre still on this page
  if (browser) {
    address = localStorage.getItem("address");
    setTimeout(function () {
      if (window.location.pathname == "/") {
        getStatus();
      }
    }, 100);
    setInterval(function () {
      if (window.location.pathname == "/") {
        getStatus();
      }
    }, 3000);
  }
</script>

<!--
<div class="m-3 w-[21rem]">
  <div class="card w-50 bg-neutral shadow-xl image-full">
    <div class="card-body pr-0">
      <h2 class="card-title">{name}</h2>
      <p>
        {#if subdomain == undefined}
          {address}:{10000 + parseInt(id)}
        {:else}
          {subdomain}.{address}
        {/if}
      </p>
      <div class="card-actions justify-beginning" />
      <div class="card-actions justify-end">
        placeholder for now? 
        <div class="grow space-x-1.5 flex">
          <a href="/{softwareType}/{10000 + parseInt(id)}"
            ><button on:click={setName} class="btn btn-primary btn-sm h-9"
              >Info</button
            ></a
          >
          {#if state == "starting" || state == "installing"}
            <div
              id="start"
              class="no-hover-effect flex bg-{startcolor} rounded-lg font-semibold uppercase text-base-200 text-xs tracking-wider px-3 items-center"
            >
              <Loader size="18" class="animate-spin mr-1.5" />
              {starttext}
            </div>
          {:else}
            <button
              id="start"
              on:click={start}
              class="btn btn-{startcolor} btn-sm h-9"
            >
              {starttext}
            </button>
          {/if}
          {#if state == "stopping"}
            <div
              id="start"
              class="no-hover-effect flex btn-error rounded-lg font-semibold uppercase text-black text-xs tracking-wider px-3 items-center"
            >
              <Loader size="18" class="animate-spin mr-1.5" />
              {$t("button.stopping")}
            </div>
          {:else}
            <button
              on:click={stop}
              class="btn btn-error btn-sm h-9"
              class:btn-disabled={state != "true"}>{$t("button.stop")}</button
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
-->

<img
  src="/images/placeholder.webp"
  class="w-[3.75rem] h-[3.75rem] rounded-lg max-lg:hidden"
/>
<div class="-mt-1">
  <p class="font-poppins-bold text-gray-200 text-sm md:text-lg truncate">{name}</p>
  <!-- Only shows in sidebar mode-->
  <div class="max-md:hidden">
    <p class="font-poppins text-xs mb-0.5 -mt-1">
      {#if subdomain == undefined}
        {address}:{10000 + parseInt(id)}
      {:else}
        {subdomain}.{address}
      {/if}
    </p>
    <div class="flex gap-2">
      <p class="bg-base-200 px-1.5 rounded text-xs font-poppins">{software}</p>
      <p class="bg-base-200 px-1.5 rounded text-xs font-poppins">{version2}</p>
    </div>
  </div>
</div>

<style>
  .primaryGradientStroke {
    position: relative;

    z-index: 1;
  }

  .primaryGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #135664, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }

  .neutralGradientStroke {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStroke:hover::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>
