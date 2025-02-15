<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import { numShort } from "$lib/scripts/utils";
  import { Users, RotateCw, Database } from "lucide-svelte";

  export let customers: object[] = [];
  let network = "Offline";
  let hosting = "Offline";
  let quartz = "Offline";
  let observer = "Online";
  let frontend = "Offline";
  let backend = "Offline";
  let website = "Offline";
  let jarsmcf = "Offline";
  let jarsmcb = "Offline";
  let jarsmc = "Offline";
  let atCapacity = false;
  let numServers = -16;
  let maxServers = 16;

  let recurringUsers = 0;
  let users = 0;
  if (browser) {
    for (let i = 0; i < customers.length; i++) {
      if (customers[i][0].subscriptions[0].includes(":active")) {
        recurringUsers++;
      }
      users++;
    }

    fetch(apiurl + "info/capacity", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        atCapacity = res.atCapacity;
        numServers = res.numServers;
        maxServers = res.maxServers;
      });
    const response = fetch("https://ocelot.arthmc.xyz/status")
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

<div class="flex flex-col items-center space-y-5">
  {#if customers.length > 0}
    <div
      class="stats stats-vertical shadow bg-base-300 w-40 2xl:w-48 overflow-clip"
    >
      <div class="stat">
        <div class="stat-title">Total Users</div>
        <div class="stat-value flex justify-between pr-2">
          {numShort(users)}
          <Users size="28" />
        </div>

        <div class="stat-desc text-base-content">
          As of {new Date().toDateString()}
        </div>
      </div>

      <div class="stat">
        <div class="stat-title">Active Users</div>
        <div class="stat-value flex justify-between pr-2">
          {numShort(recurringUsers)}
          <RotateCw size="28" />
        </div>

        <div class="stat-desc text-base-content">
          {(recurringUsers / users).toFixed(2) * 100}% of Total Users
        </div>
      </div>
      {#if !atCapacity}
        <div class="stat bg-gradient-to-t from-sky-500/[.15] to-base-300">
          <div class="stat-title">Capacity</div>
          <div class="stat-value text-info flex justify-between pr-2">
            {Math.trunc((numServers / maxServers) * 100)}%
            <Database size="28" />
          </div>

          <div class="stat-desc text-base-content">
            {numServers} / {maxServers} Servers
          </div>
        </div>{:else}
        <div class="stat bg-gradient-to-t from-red-600/[.50] to-base-300">
          <div class="stat-title">Capacity</div>
          <div class="stat-value text-error flex justify-between pr-2">
            {Math.trunc((numServers / maxServers) * 100)}%
            <Database size="28" />
          </div>

          <div class="stat-desc text-base-content">
            {numServers} / {maxServers} Servers
          </div>
        </div>{/if}
    </div>
  {:else}
    <div
      class="stats stats-vertical shadow bg-base-300 w-40 2xl:w-48 overflow-clip"
    >
      <div class="stat">
        <div class="bg-slate-700 animate-pulse w-24 h-4 my-1 rounded"></div>
        <div class="bg-slate-700 animate-pulse w-full h-7 my-1 rounded"></div>

        <div class="bg-slate-700 animate-pulse w-28 h-3 my-1 rounded"></div>
      </div>

      <div class="stat">
        <div class="bg-slate-700 animate-pulse w-20 h-4 my-1 rounded"></div>
        <div class="bg-slate-700 animate-pulse w-full h-7 my-1 rounded"></div>

        <div class="bg-slate-700 animate-pulse w-24 h-3 my-1 rounded"></div>
      </div>
      <div
        class="stat bg-gradient-to-t from-sky-500/[.15] animate-pulse to-base-300"
      >
        <div
          class="bg-slate-700 animate-pulse w-16 h-4 my-1 rounded skeleton"
        ></div>
        <div class="bg-slate-700 animate-pulse w-full h-7 my-1 rounded"></div>

        <div class="bg-slate-700 animate-pulse w-32 h-3 my-1 rounded"></div>
      </div>
    </div>
  {/if}
  <div class="h-22 w-40 2xl:w-48 bg-base-200 rounded-xl p-2">
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
      <p class="text-3xl">{hosting}</p>
    </div>

    <div class="space-y-2 mt-2">
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Frontend: {observer}</p>
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Backend: {quartz}</p>
    </div>
  </div>
  <div class="h-22 w-40 2xl:w-48 bg-base-200 rounded-xl p-2">
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
      <p class="text-3xl">{website}</p>
    </div>

    <div class="space-y-2 mt-2">
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Frontend: {frontend}</p>
      <p class="bg-base-300 p-1 pl-1.5 ounded-lg">Backend: {backend}</p>
    </div>
  </div>
  <div class="h-22 w-40 2xl:w-48 bg-base-200 rounded-xl p-2">
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
      <p class="text-3xl">{jarsmc}</p>
    </div>

    <div class="space-y-2 mt-2">
      <p class="bg-base-300 p-1 pl-1.5 rounded-lg">Frontend: {jarsmcf}</p>
      <p class="bg-base-300 p-1 pl-1.5 ounded-lg">Backend: {jarsmcb}</p>
    </div>
  </div>
</div>
