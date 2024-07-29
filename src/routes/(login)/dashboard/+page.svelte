<script>
  import { browser } from "$app/environment";
  import Analytics from "$lib/components/pages/dashboard/Analytics.svelte";
  import FeedbackTooltip from "$lib/components/pages/dashboard/FeedbackTooltip.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  import { Gamepad2, Info, Mail } from "lucide-svelte";
  import { split } from "postcss/lib/list";
  import { fade } from "svelte/transition";

  let isLoggedIn = false;
  let address = "";
  let customers = [];
  let customersLoaded = false;
  let servers = [];
  let serversLoaded = false;
  if (browser) {
    address = localStorage.getItem("address");
  }

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
                //sort by server id
                customers.sort((a, b) => {
                  return a[1].servers[0] - b[1].servers[0];
                });
                customersLoaded = true;
              });

            fetch(apiurl + "dashboard/servers?tempToken=" + input, {
              method: "GET",
            })
              .then((res) => res.json())
              .then((data) => {
                servers = data;
                //sort by server id
                servers.sort((a, b) => {
                  return a.serverId - b.serverId;
                });
                serversLoaded = true;
              });
          } else {
            alert("Expired or invalid token");
          }
        });
    }
  }

  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = month + " " + date + " @" + hour;
    return time;
  }

  function format(str, date) {
    let ret = str;
    if (str == "incomplete_expired") {
      ret = "Failed Payment";
    } else if (str == "canceled") {
      if (parseInt(date) > Date.now() / 1000) {
        ret = "Cancels " + timeConverter(date);
      } else {
        ret = "Canceled " + timeConverter(date);
      }
    } else {
      ret = str
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }
    return ret;
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
  {#if !serversLoaded}
    <div class="flex flex-col gap-5 w-96">
      {#each Array.from({ length: 10 }) as _}
        <div class="px-6 py-4 bg-base-200 rounded-xl w-3/4 shadow space-y-1.5">
          <div class="bg-slate-700 animate-pulse w-14 h-5 rounded-md"></div>
          <div class="bg-slate-700 animate-pulse w-32 h-5 rounded-md"></div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="flex flex-col gap-5 w-96">
      {#each servers as server}
        <div class="px-6 py-4 bg-base-200 rounded-xl w-3/4 shadow space-y-1.5">
          {address}:{server.serverId}
          {#if server.owner != null}
            {#if server.owner.includes("email:")}
              <div class="bg-neutral px-1.5 rounded-md text-sm flex gap-1">
                <Mail size="16" class="mt-0.5" />
                {server.owner.split(":")[1]}
              </div>
            {:else if server.owner.includes("discord:")}
              <div class="flex">
                <div class="bg-neutral px-1.5 rounded-l-md text-sm flex gap-1">
                  <Gamepad2 size="16" class="mt-0.5" />
                  {server.owner.split(":")[1]}
                </div>
                <div
                  class="bg-slate-700 px-1.5 rounded-r-md text-sm flex gap-1"
                >
                  {server.email}
                </div>
              </div>
            {/if}
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  {#if !customersLoaded}
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
            {#each customer[0].subscriptions as sub}
              {#if sub.split(":")[1] == "active"}
                {#if sub.split(":")[0] === "basic"}
                  <div
                    class="bg-gradient-to-tr from-orange-400 to-pink-500 px-1.5 rounded-md text-sm text-black"
                  >
                    {$t("basic")}
                  </div>
                {/if}
                {#if sub.split(":")[0] === "modded"}
                  <div
                    class="bg-gradient-to-tr from-cyan-400 to-indigo-500 px-1.5 rounded-md text-sm text-black"
                  >
                    {$t("modded")}
                  </div>
                {/if}
              {:else}
                {#if sub.split(":")[0] === "basic"}
                  <div
                    class="bg-gradient-to-tr from-orange-400 to-pink-500 px-1.5 text-sm text-black rounded-l-md"
                  >
                    {$t("basic")}
                  </div>
                  {#if sub.split(":")[1] == "canceled" && parseInt(sub.split(":")[2]) > Date.now() / 1000}
                    <div
                      class="bg-slate-700 rounded-r-md text-sm px-1.5 flex gap-1"
                    >
                      {format(sub.split(":")[1], sub.split(":")[2])}

                      <FeedbackTooltip feedback={sub.split(":")[3]} />
                    </div>
                  {:else}
                    <div
                      class="bg-error text-black rounded-r-md text-sm px-1.5 flex gap-1"
                    >
                      {format(sub.split(":")[1], sub.split(":")[2])}
                      <FeedbackTooltip feedback={sub.split(":")[3]} />
                    </div>
                  {/if}
                {/if}
                {#if sub.split(":")[0] === "modded"}
                  <div
                    class="bg-gradient-to-tr from-cyan-400 to-indigo-500 px-1.5 text-sm text-black rounded-l-md"
                  >
                    {$t("modded")}
                  </div>

                  {#if sub.split(":")[1] == "canceled" && parseInt(sub.split(":")[2]) > Date.now() / 1000}
                    <div
                      class="bg-slate-700 rounded-r-md text-sm px-1.5 flex gap-1"
                    >
                      {format(sub.split(":")[1], sub.split(":")[2])}
                      <FeedbackTooltip feedback={sub.split(":")[3]} />
                    </div>
                  {:else}
                    <div
                      class="bg-error text-black rounded-r-md text-sm px-1.5 flex gap-1"
                    >
                      {format(sub.split(":")[1], sub.split(":")[2])}
                      <FeedbackTooltip feedback={sub.split(":")[3]} />
                    </div>
                  {/if}
                {/if}
              {/if}
            {/each}
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
