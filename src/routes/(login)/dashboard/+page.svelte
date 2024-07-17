<script>
  import { browser } from "$app/environment";
  import Analytics from "$lib/components/pages/dashboard/Analytics.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  import { FishOff } from "lucide-svelte";
  import { fade } from "svelte/transition";

  let isLoggedIn = false;
  let address = "";
  let customers = [];
  if (browser) {
    address = localStorage.getItem("address");
  }
  let loaded = false;
  function login() {
    if (browser) {
      let input = document.getElementById("input")?.value;

      fetch(apiurl + "dashboard/verifyToken?tempToken=" + input, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            isLoggedIn = true;

            fetch(apiurl + "dashboard/customers?tempToken=" + input, {
              method: "GET",
            })
              .then((res) => res.json())
              .then((data) => {
                customers = data;
                loaded = true;
              });
          } else {
            alert("Expired or invalid token");
          }
        });
    }
  }
</script>

{#if !isLoggedIn}
  <div
    transition:fade={{ duration: 1200 }}
    class="absolute h-[200rem] w-screen bg-base-100 z-40 backdrop-blur-sm bg-opacity-70 -mt-6"
  ></div>
  <div class="absolute mt-4 w-96 z-50" transition:fade={{ duration: 600 }}>
    <div class="bg-base-100 w-96 shadow-xl">
      <figure>
        <img src="images/dashboard_bg.png" alt="bg" class="rounded-t-lg" />
      </figure>
      <div class="card-body bg-base-300 rounded-b-lg">
        <h2 class="card-title">Dashboard</h2>
        <p>Enter your temporary token</p>
        <div class="flex gap-2">
          <label class="input input-bordered flex items-center gap-2 w-2/3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              id="input"
              type="password"
              placeholder="Type here"
              class="bg-base-100 w-3/4"
            />
          </label>
          <button class="btn btn-neutral" on:click={login}>Enter</button>
        </div>
      </div>
    </div>
  </div>
{/if}
<div class="flex gap-5 justify-end px-24 -mt-4">
  {#if !loaded}
    <div class="flex flex-col gap-5 w-96">
      {#each Array.from({ length: 10 }) as _}
        <div class="px-6 py-4 bg-base-200 rounded-xl w-3/4 shadow space-y-1.5">
          <div class="bg-slate-700 animate-pulse w-20 h-5 rounded-md"></div>
          <div class="bg-slate-700 animate-pulse w-14 h-5 rounded-md"></div>
          <div class="bg-slate-700 animate-pulse w-14 h-5 rounded-md"></div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col gap-5 w-96">
      {#each customers as customer}
        <div class="px-6 py-4 bg-base-200 rounded-xl w-3/4 shadow space-y-1.5">
          {customer[0].email}
          <div class="flex gap-1">
            {#if customer[0].activeBasicSubscriptions > 0}
              <div
                class="bg-gradient-to-tr from-orange-400 to-pink-500 px-1.5 rounded-md text-sm text-black"
              >
                {customer[0].activeBasicSubscriptions}x {$t("basic")}
              </div>
            {/if}
            {#if customer[0].activeModdedSubscriptions > 0}
              <div
                class="bg-gradient-to-tr from-cyan-400 to-indigo-500 px-1.5 rounded-md text-sm text-black"
              >
                {customer[0].activeModdedSubscriptions}x {$t("modded")}
              </div>
            {/if}
          </div>
          <div class="flex gap-1">
            {#each customer[1].servers as server}
              <div class="bg-neutral px-1.5 rounded-md text-sm">
                {address}:{server}
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  {/if}
  <Analytics />
</div>
