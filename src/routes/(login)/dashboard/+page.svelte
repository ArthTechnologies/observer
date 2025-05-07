<script lang="ts">
  import { browser } from "$app/environment";
  import Analytics from "$lib/components/pages/dashboard/Analytics.svelte";
  import FeedbackTooltip from "$lib/components/pages/dashboard/FeedbackTooltip.svelte";
    import MemoryChart from "$lib/components/pages/dashboard/MemoryChart.svelte";
    import Slots from "$lib/components/pages/dashboard/Slots.svelte";

    import ThreadCharts from "$lib/components/pages/dashboard/ThreadCharts.svelte";

  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import { alert, fileSizeShort } from "$lib/scripts/utils";
  import token from "$lib/stores/token";
  import {
    RotateCcw,
   
  } from "lucide-svelte";
  import { split } from "postcss/lib/list";
  import { fade } from "svelte/transition";
  import { server } from "websocket";

  let isLoggedIn = false;
  let servers: object[] = [];

  let token = "";
  let accountDetails = {};
  let folders = [];
  let tab = "slots";
  let tempToken = "";
  let privateUrl = "";
  let verifiedDetails = false;

  let performance = [];
  let performanceReq = null;
  if (browser) {
    if(localStorage.getItem("dashboard") != null) {
      let dashboard = JSON.parse(localStorage.getItem("dashboard"));
      //insert values into the input fields and submit
      document.getElementById("urlInput").value = dashboard.url;
      document.getElementById("tokenInput").value = dashboard.token;
      login();
    }
    getPerformance();




  }

  function getAccount(accountID) {
    if (browser) {
      let input = document.getElementById("accountID")?.value;
      fetch(apiurl + "dashboard/account/" + input + "?tempToken=" + token, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          accountDetails = data;

          console.error(data);
        });
    }
  }
  function login() {
    if (browser) {

      let input = document.getElementById("tokenInput")?.value;
      let urlInput = document.getElementById("urlInput")?.value;
      //if the url doesnt have a / at the end add one
      if (urlInput[urlInput.length - 1] != "/") {
        urlInput += "/";
      }
      token = input;

      //this will porbably be http. set headers so cors doesnt have iossues
      fetch(urlInput + "verifyToken?tempToken=" + input, {
        method: "GET"

      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            isLoggedIn = true;
            alert("Logged in", "success");  
            tempToken = input;
            privateUrl = urlInput;
            verifiedDetails = true;
           
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
  let canRefresh = false;
  let secondsAgo = 0;
  function getPerformance() {
    if (browser) {
      performanceReq = fetch(apiurl + "dashboard/snapshot", {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          performance = data;
          console.log(performance[performance.length - 1].timestamp);
          console.log(Date.now());
          //if latest timestamp is less than 1 minute ago dont allow
          if (Date.now() - performance[performance.length-1].timestamp < 60000) {
            canRefresh = false;
            setTimeout(() => {
              canRefresh = true;
            }, 60000 - (Date.now() - performance[performance.length-1].timestamp));
            setInterval(() => {
              secondsAgo = Math.floor((Date.now() - performance[performance.length-1].timestamp) / 1000);
            }, 1000);
          } else {
            canRefresh = true;
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
        <p>Private URL</p>
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
            id="urlInput"
            type="text"
            placeholder="ex: http://193.0.2.1:4001/"
            class="bg-base-100 w-3/4"
          />
        </label>
        <p>Temporary token</p>
        
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
              id="tokenInput"
              type="text"
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
<div role="tablist" class="tabs tabs-boxed w-1/4">
  {#if tab == "performance"}
  <a role="tab" class="tab" on:click={() => (tab = "slots")}
    >Slots</a>
    {:else}
    <a role="tab" class="tab tab-active" 
      >Slots</a
    >{/if}
  {#if tab == "slots"}
  <a role="tab" class="tab" on:click={() => (tab = "performance")}
    >Performance</a
  >
  {:else}
  <a role="tab" class="tab tab-active" 
    >Performance</a
  >{/if}

</div>
{#if verifiedDetails}
{#if tab == "slots"}
<Slots {token} {privateUrl}/>

{:else if tab == "performance"}
{#await performanceReq}
  <div class="flex flex-col gap-5 w-96 items-center">
    {#each Array.from({ length: 10 }) as _}
      <div class="p-5 bg-base-200 rounded-xl w-3/4 shadow space-y-1.5">
        <div class="bg-slate-700 animate-pulse w-14 h-5 rounded-md"></div>
        <div class="bg-slate-700 animate-pulse w-32 h-5 rounded-md"></div>
        <div class="bg-slate-700 animate-pulse w-8 h-5 rounded-md"></div>
      </div>
    {/each}
  </div>
{:then}
<div class="relative">
  <div class="flex place-content-end absolute -top-10 right-2">
    {#if canRefresh}
    <button class="btn btn-neutral btn-sm items-center flex" on:click={getPerformance}>
      <RotateCcw size=18 class="mr-1.5"/>Refresh</button>
      
    {:else}
    <button class="btn btn-neutral btn-sm items-center flex" disabled><RotateCcw size=18 class="mr-1.5"/>Updated {secondsAgo}s Ago</button>
    {/if}
  </div>
  <MemoryChart {performance} />
    <ThreadCharts {performance} />

</div>
{/await}
{/if}
{/if}


