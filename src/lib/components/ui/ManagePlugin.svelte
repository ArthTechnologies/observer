<script lang="ts">
  import { apiurl } from "$lib/scripts/req";
  import { lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { getHeapSpaceStatistics } from "v8";
  import { t } from "$lib/scripts/i18n";
  import ChooseVersionAlt from "./ChooseVersionAlt.svelte";
  import accountEmail from "$lib/stores/accountEmail";
  import SkeleResult from "./SkeleResult.svelte";
  import { ChevronDown, ChevronUp, Trash, Trash2 } from "lucide-svelte";

  export let name;
  export let id;
  export let platform;
  export let modtype;
  export let filename;
  let showInfo = true;
  let sendName = name;
  let author;
  let desc;
  let slug = id;

  if (platform == "lr") {
    name = name.replace(/-/g, " ");

    fetch(lrurl + "project/" + id)
      .then((response) => response.json())
      .then((data) => {
        desc = data.description;
        slug = data.slug;
        name = data.title;
      });

    fetch(lrurl + "project/" + id + "/members")
      .then((response) => response.json())
      .then((data) => {
        author = data[0].user.username;
      });
  } else if (platform == "gh") {
    author = id.split("/")[0];
    fetch("https://api.github.com/repos/" + id)
      .then((response) => response.json())
      .then((data) => {
        desc = data.description;
      });
  } else if (platform == "cx") {
    switch (name) {
      case "Geyser":
        desc =
          "A bridge/proxy allowing you to connect to Minecraft: Java Edition servers with Minecraft: Bedrock Edition. ";
        break;
      case "Floodgate":
        desc =
          "An addon to Geyser that removes the need for Bedrock players to log in with a Java Edition account.";
        break;
    }
  }

  export function del() {
    //tell upstream component to refresh
    const event = new CustomEvent("refresh");
    document.dispatchEvent(event);

    let serverId = "";
    if (browser) {
      serverId = localStorage.getItem("serverID");
    }

    platform == "gh" ? (id = id.replace(/\//g, "_")) : (id = id);
    console.log(
      apiurl +
        "server/" +
        serverId +
        "/" +
        modtype +
        "s" +
        "?pluginPlatform=" +
        platform +
        "&pluginId=" +
        id +
        "&pluginName=" +
        encodeURIComponent(sendName)
    );
    fetch(
      apiurl +
        "server/" +
        serverId +
        "/" +
        modtype +
        "s" +
        "?pluginPlatform=" +
        platform +
        "&pluginId=" +
        id +
        "&pluginName=" +
        encodeURIComponent(sendName),
      {
        method: "DELETE",
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("accountEmail"),
        },
      }
    );
  }

  function toggleInfo() {
    if (showInfo === true) {
      showInfo = false;
    } else {
      showInfo = true;
    }
  }
</script>

<div>
  <div class="px-3 py-2 rounded-t-lg bg-base-300 flex justify-between">
    <div class="flex items-center space-x-1">
      <p>{filename}</p>
      <button on:click={del} class="btn btn-xs btn-error mt-0.5 btn-square">
        <Trash2 size="15" /></button
      >
    </div>
    <button class="btn btn-ghost btn-xs">
      <label class="swap">
        <input type="checkbox" on:click={toggleInfo} />
        <div class="swap-on"><ChevronDown /></div>
        <div class="swap-off"><ChevronUp /></div>
      </label>
    </button>
  </div>
  {#if showInfo === true}
    <div class="bg-base-200 rounded-b-lg px-1.5 pt-2.5 pb-2.5 space-x-1">
      <div class="px-1.5">
        {#if platform == "lr"}
          <div class="flex justify-between place-items-center">
            <div class="flex space-x-3">
              <div>
                <div class="flex space-x-1">
                  <div class="flex space-x-1.5 place-items-end">
                    {#if name == id}
                      <div
                        class="h-6 w-16 animate-pulse bg-slate-600 rounded-lg"
                      />
                    {:else}
                      <a
                        href="https://modrinth.com/plugin/{slug}"
                        target="_blank"
                        class="link link-hover text-xl font-bold">{name}</a
                      >
                    {/if}
                    <div class="flex space-x-1">
                      <p>by</p>
                      <a
                        href="https://modrinth.com/user/{author}"
                        target="_blank"
                        class="link link-hover">{author}</a
                      >
                    </div>
                    <img
                      src="https://github.com/modrinth/art/blob/main/Branding/Mark/mark-dark__32x32.png?raw=true"
                      width="24"
                    />
                  </div>
                  <div class="" />
                </div>
              </div>
            </div>
          </div>
        {:else if platform == "gh"}
          <div class="flex justify-between place-items-center">
            <div class="flex space-x-3">
              <div>
                <div class="flex space-x-1">
                  <a
                    href="https://github.com/{id}"
                    target="_blank"
                    class="link link-hover text-xl font-bold">{name}</a
                  >
                  <div class="flex space-x-1.5 place-items-end">
                    <div class="flex space-x-1">
                      <p>by</p>
                      <a
                        href="https://github.com/{author}"
                        target="_blank"
                        class="link link-hover">{author}</a
                      >
                    </div>
                    <img src="https://github.com/favicon.ico" width="24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        {:else if platform == "cx"}
          <div class="flex justify-between place-items-center">
            <div class="flex space-x-3">
              <div>
                <div class="flex space-x-1">
                  {#if name == "Geyser" || name == "Floodgate"}
                    <p class="text-xl font-bold">{name}</p>
                    <div class=" flex space-x-1 place-items-end">
                      <p>by</p>
                      <a
                        href="https://geysermc.org"
                        target="_blank"
                        class="link link-hover">GeyserMC</a
                      >
                    </div>
                  {:else}
                    <p class="text-xl font-bold">{name}</p>
                    <div class=" flex space-x-1 place-items-end" />
                  {/if}
                  <div class="flex space-x-1.5 place-items-end">
                    <img
                      src="https://arthmc.xyz/favicon.png"
                      width="24"
                      class="ml-0.5 mb-0.5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        {/if}

        <div>
          {desc}
        </div>
      </div>

      {#if platform == "lr"}
        <!-- <ChooseVersionAlt pluginName={name} {id} /> this currently doesnt delete the old plugin, so its not enabled-->
      {/if}
    </div>
  {/if}
</div>
