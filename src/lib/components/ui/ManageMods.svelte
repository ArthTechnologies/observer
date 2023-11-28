<script lang="ts">
  import { browser } from "$app/environment";
  import { apiurl, getMods, usingOcelot } from "$lib/scripts/req";
  import PluginResult from "./PluginResult.svelte";
  import { t } from "$lib/scripts/i18n";
  import ManagePlugin from "./ManagePlugin.svelte";
  import { ChevronDown, ChevronUp, Clock, Trash2 } from "lucide-svelte";
  import ChooseVersionModpack from "./ChooseVersionModpack.svelte";
  let promise;
  let res = { mods: [], modpack: {} };
  let query = "";

  let modpackDesc = "";
  let modpackIcon = "";
  let modpackSlug = "";
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
      promise = null;
      promise = getMods(id, "mods").then((response) => {
        res = response;
        for (let i in res.mods) {
          res.mods[i].time = new Date(res.mods[i].date).toLocaleString();
        }
        if (response.modpack != undefined) {
          localStorage.setItem("modpackVersionID", response.modpack.versionID);
          if (response.modpack.platform == "mr") {
            fetch(
              "https://api.modrinth.com/api/v1/mod/" +
                response.modpack.projectID
            )
              .then((response) => response.json())
              .then((data) => {
                modpackDesc = data.description;
                modpackIcon = data.icon_url;
                modpackSlug = data.slug;
              });
          } else if (response.modpack.platform == "cf") {
            fetch(apiurl + "curseforge/" + response.modpack.projectID + "/")
              .then((response) => response.json())
              .then((data) => {
                modpackDesc = data.summary;
                modpackIcon = data.logo.url;
                modpackSlug = data.slug;
              });
          }
          if (
            response.modpack.files.length > 0 &&
            response.modpack.files[0].path != undefined
          ) {
            for (let i = 0; i < response.modpack.files.length - 1; i++) {
              for (let k = 0; k < response.mods.length; k++) {
                if (
                  response.mods[k].filename ==
                  response.modpack.files[i].path.split("\\")[1]
                ) {
                  res.mods.splice(k, 1);
                  res.mods.push({
                    id: response.modpack.files[i].downloads[0].split("/")[4],
                    platform: "lr",
                    name: response.modpack.files[i].downloads[0].split("/")[4],
                    filename: response.modpack.files[i].path.split("\\")[1],
                  });
                }
              }
            }
          }
        }
        console.log(res);
      });
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
    const url = baseurl + "server/" + serverId + "/file/mods*" + filename;
    fetch(url, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    });
  }
</script>

<label for="manage" on:click={search} class="btn btn-block btn-primary relative"
  >{$t("button.managemods")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="manage" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div
    class="modal-box bg-opacity-95 backdrop-blur relative w-11/12 max-w-5xl space-y-2 h-[50rem] overflow-x-hidden"
  >
    <div class="md:flex items-center md:space-x-3 justify-between">
      <p class="font-bold text-2xl">Mods</p>
      {#if res.modpack != undefined}
        <div
          class="flex gap-1.5 items-center h-15 p-2 bg-base-200 rounded-lg mt-2 md:mt-0"
        >
          Modpack:
          <img src={modpackIcon} class="w-8 h-8 rounded-lg" />
          <p class="w-[8.5rem] break-all">
            {res.modpack.name}
          </p>

          {#if res.modpack.platform != undefined}
            <ChooseVersionModpack
              id={res.modpack.projectID}
              name={res.modpack.name}
              author={res.modpack.author}
              desc={modpackDesc}
              icon={modpackIcon}
              slug={modpackSlug}
              platform={res.modpack.platform}
              buttonType="2"
            />
          {/if}
        </div>
      {/if}
      <div
        class="invisible max-md:hidden this-is-to-put-the-modpack-card-in-the-center font-bold text-2xl"
      >
        Mods
      </div>
    </div>
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
              modtype="mod"
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
