<script lang="ts">
  import { browser } from "$app/environment";
  import { apiurl, getMods, usingOcelot } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import ManagePlugin from "./ManagePlugin.svelte";
  import { ChevronUp, Clock, Trash2 } from "lucide-svelte";
  let promise;
  let res = { mods: [] };
  let query = "";
  if (browser) {
    //run search upon the "refresh" event
    document.addEventListener("refresh", function () {
      setTimeout(function () {
        search();
      }, 10);
    });
  }
  export function search() {
    console.log("searching" + query);

    if (browser) {
      let id = localStorage.getItem("serverID");

      setTimeout(function () {
        promise = getMods(id, "plugins").then((response) => {
          res = response;
          for (let i in res.mods) {
            res.mods[i].time = new Date(res.mods[i].date).toLocaleString();
          }
          console.log(res);
        });
      }, 1);
    }
  }
  search();
  function del(filename) {
    //tell upstream component to refresh
    const event = new CustomEvent("refresh");
    document.dispatchEvent(event);

    let serverId = "";
    if (browser) {
      serverId = localStorage.getItem("serverID");
    }

    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    const url = baseurl + "server/" + serverId + "/file/plugins*" + filename;

    fetch(url, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    });
  }
</script>

<label for="manage" on:click={search} class="btn btn-block btn-primary"
  >{$t("button.manageplugins")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="manage" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative w-11/12 max-w-5xl space-y-2 h-[50rem]">
    <p class="font-bold text-2xl">Plugins</p>
    <div class="flex justify-between">
      <label
        for="manage"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >
    </div>

    <div class="space-y-2">
      {#await promise}
        <div class="flex flex-col">
          <div
            class="flex items-center justify-between bg-base-300 rounded-t-lg w-full h-[2.75rem] pr-3 py-2 pl-2.5 space-x-1"
          >
            <div class="flex items-center space-x-1">
              <div
                class="bg-slate-700 rounded-lg w-[13rem] h-[1.5rem] animate-pulse"
              />
              <div
                class="bg-slate-700 rounded-lg w-[1.5rem] h-[1.5rem] animate-pulse"
              />
            </div>
            <div class="flex space-x-1 items-center">
              <div
                class="bg-slate-700 rounded-lg w-[13rem] h-[1.75rem] animate-pulse hidden sm:block"
              />
              <button class="btn btn-xs btn-disabled animate-pulse"
                ><ChevronUp /></button
              >
            </div>
          </div>
          <div
            class="h-[4.5rem] bg-base-200 rounded-b-lg px-3 pt-[1.125rem] pb-[.75rem] flex flex-col justify-between"
          >
            <div class="flex space-x-1 items-end">
              <div class="bg-slate-700 rounded-lg w-[5rem] h-4 animate-pulse" />
              <div class="bg-slate-700 rounded-lg w-[6rem] h-3 animate-pulse" />
            </div>
            <div
              class="bg-slate-700 rounded-lg w-[13rem] h-3.5 animate-pulse"
            />
          </div>
        </div>
      {:then}
        {#each res.mods as mod}
          {#if mod.id != undefined}
            <ManagePlugin
              name={mod.name.split(".disabled")[0]}
              id={mod.id}
              platform={mod.platform}
              filename={mod.filename.split(".disabled")[0]}
              date={mod.date}
              modtype="plugin"
              disabled={mod.filename.includes(".disabled")}
            />
          {:else}
            <div class="px-3 py-2 rounded-lg bg-base-300 flex justify-between">
              <div class="flex items-center space-x-1 break-all">
                <p>{mod.filename}</p>
                <button
                  on:click={() => {
                    del(mod.filename);
                  }}
                  class="btn btn-xs btn-error mt-0.5 btn-square"
                >
                  <Trash2 size="15" /></button
                >
              </div>
              <div
                class="bg-base-200 flex px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
              >
                <Clock size="16" class="mr-1.5" />
                {mod.time}
              </div>
            </div>
          {/if}
        {/each}
      {/await}
    </div>
  </div>
</div>
