<script>
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import { AlertTriangle, InfoIcon } from "lucide-svelte";

  let network;
  let hosting;
  let quartz;
  let observer = "Online";
  let frontend;
  let backend;
  let website;
  let jarsmcf;
  let jarsmcb;
  let jarsmc;
  let atCapacity = false;
  let numServers = -16;
  let maxServers = 16;
  if (browser) {
    fetch(apiurl + "info/capacity", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        atCapacity = res.atCapacity;
        numServers = res.numServers;
        maxServers = res.maxServers;
      });
    const response = fetch("https://backend.arthmc.xyz/status")
      .then((response) => response.json())
      .then((json) => {
        if (json != undefined) {
          backend = "Online";
        } else {
          backend = "Offline";
        }
        network = json.arthnetwork;
        observer = json.observer;
        quartz = json.quartz;
        frontend = json.frontend;
        jarsmcf = json.jarsmcf;
        jarsmcb = json.jarsmcb;
        if (jarsmcf == "Online" && jarsmcb == "Online") {
          jarsmc = "Online";
        } else {
          jarsmc = "Offline";
        }
        if (quartz == "Online") {
          hosting = "Online";
        } else {
          hosting = "Offline";
        }

        if (backend == "Online" && frontend == "Online") {
          website = "Online";
        } else {
          website = "Offline";
        }
      });
  }
</script>

<div class=" space-y-5">
  {#if atCapacity}
    <div
      class="w-[10rem] p-2 bg-error rounded-xl shadow-xl text-black flex gap-1 font-bold justify-center ml-4"
    >
      <AlertTriangle size="24" />At Capacity
    </div>
  {:else}
    <div
      class="w-[10rem] p-2 bg-info rounded-xl shadow-xl text-black flex gap-1 font-bold justify-center ml-4"
    >
      <InfoIcon size="24" />{Math.trunc((numServers / maxServers) * 100)}%
      Capacity
    </div>
  {/if}
  <div class="h-22 w-48 bg-base-200 rounded-xl p-2">
    <p class="font-bold text-2xl">Arth Hosting</p>
    <div class="flex items-center mb-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-power mr-1"
        ><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line
          x1="12"
          y1="2"
          x2="12"
          y2="12"
        /></svg
      >
      <p class="text-4xl">{hosting}</p>
    </div>

    <div class="space-y-2 mt-2">
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Frontend: {observer}</p>
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Backend: {quartz}</p>
    </div>
  </div>
  <div class="h-22 w-48 bg-base-200 rounded-xl p-2">
    <p class="font-bold text-2xl">Arth Website</p>
    <div class="flex items-center mb-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-power mr-1"
        ><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line
          x1="12"
          y1="2"
          x2="12"
          y2="12"
        /></svg
      >
      <p class="text-4xl">{website}</p>
    </div>

    <div class="space-y-2 mt-2">
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Frontend: {frontend}</p>
      <p class="bg-base-300 p-1 pl-1.5 ounded-lg">Backend: {backend}</p>
    </div>
  </div>
  <div class="h-22 w-48 bg-base-200 rounded-xl p-2">
    <p class="font-bold text-2xl">JarsMC</p>
    <div class="flex items-center mb-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="feather feather-power mr-1"
        ><path d="M18.36 6.64a9 9 0 1 1-12.73 0" /><line
          x1="12"
          y1="2"
          x2="12"
          y2="12"
        /></svg
      >
      <p class="text-4xl">{jarsmc}</p>
    </div>

    <div class="space-y-2 mt-2">
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Frontend: {jarsmcf}</p>
      <p class="bg-base-300 p-1 pl-1.5 ounded-lg">Backend: {jarsmcb}</p>
    </div>
  </div>
</div>
