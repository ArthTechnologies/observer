<script lang="ts">
  import { browser } from "$app/environment";
  import {
    apiurl,
    getMods,
    usingOcelot,
    getServerNode,
  } from "$lib/scripts/req";

  import { t } from "$lib/scripts/i18n";
  import ManagePluginSkele from "./ManagePluginSkele.svelte";
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
      }, 50);
    });
  }
  export function search() {
    console.log("searching" + query);

    if (browser) {
      let id = localStorage.getItem("serverID");
      promise = null;
      promise = getMods(id, "mods").then((response) => {
        res = response;

        let mrRequestIds = [];
        let cfPromiseList = ["haventStartedYet"];
        for (let i in res.mods) {
          res.mods[i].time = new Date(res.mods[i].date).toLocaleString();

          if (res.mods[i].platform == "mr") {
            mrRequestIds.push(res.mods[i].id);
          } else if (res.mods[i].platform == "cf") {
            cfPromiseList.push(res.mods[i].id);

            fetch(apiurl + "curseforge/" + res.mods[i].id)
              .then((response) => response.json())
              .then((data) => {
                if (cfPromiseList[0] == "haventStartedYet")
                  cfPromiseList.splice(0, 1);
                cfPromiseList.splice(cfPromiseList.indexOf(res.mods[i].id), 1);

                if (cfPromiseList.length == 0) {
                  //sort alphabetically
                  for (let i in res.mods) {
                    for (let j in res.mods) {
                      if (
                        res.mods[j].name != "CFMod" &&
                        res.mods[j].name != res.mods[j].id
                      ) {
                        if (res.mods[i].name < res.mods[j].name) {
                          let temp = res.mods[i];
                          res.mods[i] = res.mods[j];
                          res.mods[j] = temp;
                        }
                      }
                    }
                  }
                }
                res.mods[i].desc = data.summary;
                res.mods[i].slug = data.slug;
                res.mods[i].name = data.name;
                res.mods[i].author = data.authors[0].name;
                res.mods[i].icon = data.logo.thumbnailUrl;
              });
          }
        }
        if (mrRequestIds.length > 0) {
          fetch(
            "https://api.modrinth.com/api/v2/projects?ids=[" +
              mrRequestIds.join(",") +
              "]"
          )
            .then((response) => response.json())
            .then((data) => {
              for (let i in res.mods) {
                for (let j in data) {
                  if (res.mods[i].id == data[j].id) {
                    res.mods[i].desc = data.description;
                    res.mods[i].slug = data.slug;
                    res.mods[i].name = data.title;
                    res.mods[i].icon = data.icon_url;
                  } else {
                    if (
                      res.mods[i].name != "CFMod" &&
                      res.mods[i].name != res.mods[i].id
                    ) {
                      if (
                        res.mods[i].name.toLowerCase() <
                        data[j].name.toLowerCase()
                      ) {
                        let temp = res.mods[i];
                        res.mods[i] = data[j];
                        data[j] = temp;
                      }
                    }
                  }
                }
              }
            });
        }

        if (response.modpack != undefined) {
          localStorage.setItem("modpackVersionID", response.modpack.versionID);
          if (response.modpack.platform == "mr") {
            fetch(
              "https://api.modrinth.com/api/v2/mod/" +
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
    if (usingOcelot) baseurl = getServerNode(id);
    const url = baseurl + "server/" + serverId + "/files/delete/mods*" + filename;
    fetch(url, {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    });
  }
</script>

<label for="manage" on:click={search} class="btn btn-block btn-primary"
  >{$t("button.managemods")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="manage" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div
    id="manageScroll"
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
        <ManagePluginSkele />
      {:then}
        {#each res.mods as mod}
          {#if mod.name != "CFMod" && (mod.name != mod.id || mod.id == undefined)}
            {#if mod.id != undefined}
              <ManagePlugin
                name={mod.name.split(".disabled")[0]}
                id={mod.id}
                platform={mod.platform}
                filename={mod.filename.split(".disabled")[0]}
                date={mod.date}
                modtype="mod"
                disabled={mod.filename.includes(".disabled")}
                desc={mod.desc}
                slug={mod.slug}
                icon={mod.icon}
                author={mod.author}
              />
            {:else}
              <div
                class="px-3 py-2 rounded-lg bg-base-300 flex justify-between"
              >
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
          {:else}
            <ManagePluginSkele />
          {/if}
        {/each}
      {/await}
    </div>
  </div>
</div>
