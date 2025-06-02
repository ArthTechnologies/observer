<script lang="ts">
    import { browser } from "$app/environment";
    import { alert, fileSizeShort } from "$lib/scripts/utils";
    import { DollarSign, Gamepad2, HardDrive, Mail, RotateCcw } from "lucide-svelte";
    import Analytics from "./Analytics.svelte";
    import { apiurl } from "$lib/scripts/req";

    export let token;
    export let privateUrl;

    let serversLoaded = false;
    let servers = [];
    let folders = [];
    let address = "";
    if (browser) {
        address = localStorage.getItem("address");
        fetch(apiurl + "info/capacity", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((res) => {
        res.folders.sort((a, b) => {
          return a.localeCompare(b, undefined, {
            numeric: true,
            sensitivity: "base",
          });
        });
        folders = res.folders;
      });
      fetchInfo();
    }

    function fetchInfo() {


fetch(privateUrl + "customers?tempToken=" + token, {
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
}


</script>

<div class=" flex max-md:flex-col gap-5 justify-between md:pr-16 md:mt-4">
    <iframe class="rounded-lg scale-90 -ml-3" src="https://status.arthmc.xyz" width="300" height="700"></iframe>
    {#if !serversLoaded}
      <div class="flex flex-col gap-5 w-96 items-center">
        {#each Array.from({ length: 10 }) as _}
          <div class="p-5 bg-base-200 rounded-xl w-3/4 shadow space-y-1.5">
            <div class="bg-slate-700 animate-pulse w-14 h-5 rounded-md"></div>
            <div class="bg-slate-700 animate-pulse w-32 h-5 rounded-md"></div>
            <div class="bg-slate-700 animate-pulse w-8 h-5 rounded-md"></div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col gap-5 w-96 items-center">
        <div class="h-[6.875rem] grid grid-cols-8 gap-1">
          {#each folders as folder}
            {#if folder.split(":")[1] == "normal"}
              <a
              href="#server-{folder.split(":")[0]}"
                class="p-1 bg-base-300 bg-opacity-50 rounded-lg w-8 h-6 shadow space-y-1.5 flex items-center justify-center text-sm"
              >
                {folder.split(":")[0]}
        </a>
            {:else if folder.split(":")[1] == "admin"}
              <div
                class="p-1 bg-info rounded-lg w-8 h-6 shadow space-y-1.5 flex items-center justify-center text-sm"
              >
                {folder.split(":")[0]}
              </div>
            {:else if folder.split(":")[1] == "error"}
              <a
               href="#server-{folder.split(":")[0]}"
                class="p-1 bg-error text-black rounded-lg w-8 h-6 shadow space-y-1.5 flex items-center justify-center text-sm"
              >
                {folder.split(":")[0]}
            </a>
            {/if}
          {/each}
        </div>
        {#each servers as server}

    <div
    id="server-{server.serverId}"
      class="h-[6.875rem] p-5 bg-base-100 bg-opacity-75 rounded-xl w-3/4 shadow space-y-1.5 relative overflow-x-hidden"
    >
      {address}:{server.serverId}
      {#if server.owner != null}
        {#if server.owner.includes("email:")}
          <div class="bg-neutral px-1.5 rounded-md text-sm flex gap-1">
            <Mail size="16" class="mt-0.5 flex-shrink-0" />
            {server.owner.split(":")[1].split(".json")[0]}
          </div>
        {:else if server.owner.includes("discord:")}
          <div class="flex">
            <div class="bg-neutral px-1.5 rounded-l-md text-sm flex gap-1">
              <Gamepad2 size="16" class="mt-0.5" />
              {server.owner.split(":")[1].split(".json")[0]}
            </div>
            <div
              class="bg-slate-700 px-1.5 rounded-r-md text-sm flex gap-1"
            >
              {server.email}
            </div>
          </div>
        {/if}
      {/if}
      
      
      <div class="bg-base-300 px-1.5 rounded-md text-sm flex gap-1 w-fit">
        <HardDrive size="16" class="mt-0.5" />
        {fileSizeShort(server.storage).toUpperCase()}
      </div>
   
         {#each server.subscriptions as item}
     <ul class=" bg-neutral px-1.5 rounded-md text-sm">
        <li>
            - {item.plan.amount + " " +item.plan.currency + "/"+ item.plan.interval}</li>
            <li>
                - {"Started " +new Date(item.current_period_start * 1000).toLocaleString()}</li>
                <li>
                    - {item.cancel_at == null ? "Still Active" : ("Cancels " + new Date(item.cancel_at * 1000).toLocaleString())}</li>
      </ul>
   {/each}

    </div>


        {/each}
      </div>
    {/if}
  
  
    <Analytics />
  </div>