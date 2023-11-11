<script lang="ts">
  import { apiurl, usingOcelot } from "$lib/scripts/req";
  import { lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { getHeapSpaceStatistics } from "v8";
  import { t } from "$lib/scripts/i18n";
  import ChooseVersionAlt from "./ChooseVersionAlt.svelte";
  import accountEmail from "$lib/stores/accountEmail";
  import SkeleResult from "./SkeleResult.svelte";
  import { ChevronDown, ChevronUp, Clock, Trash, Trash2 } from "lucide-svelte";
  import { split } from "postcss/lib/list";
  import ChooseVersion from "./ChooseVersion.svelte";
  import ChooseModVersion from "./ChooseModVersion.svelte";

  export let name;
  export let id;
  export let platform;
  export let modtype;
  export let filename;
  export let date;
  export let disabled;
  let showInfo = true;
  let disableText = "Disable";
  if (disabled) {
    disableText = "Enable";
  }
  let author;
  let desc;
  let icon;
  let slug = id;
  let time = new Date(date).toLocaleString();
  let serverId = "";
  let promise;
  if (browser) {
    serverId = localStorage.getItem("serverID");
  }

  if (platform == "lr") {
    name = name.replace(/-/g, " ");

    promise = fetch(lrurl + "project/" + id)
      .then((response) => response.json())
      .then((data) => {
        desc = data.description;
        slug = data.slug;
        name = data.title;
        icon = data.icon_url;
      });

    fetch(lrurl + "project/" + id + "/members")
      .then((response) => response.json())
      .then((data) => {
        author = data[0].user.username;
      });
  } else if (platform == "cf") {
    promise = fetch(apiurl + "curseforge/" + id)
      .then((response) => response.json())
      .then((data) => {
        desc = data.summary;
        slug = data.slug;
        name = data.name;
        author = data.authors[0].name;
        icon = data.logo.thumbnailUrl;
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

  export function del(filename) {
    //tell upstream component to refresh
    const event = new CustomEvent("refresh");
    document.dispatchEvent(event);

    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    const url =
      baseurl + "server/" + serverId + "/file/" + modtype + "s*" + filename;
    fetch(url, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    });
  }

  function toggleInfo() {
    if (showInfo === true) {
      showInfo = false;
    } else {
      showInfo = true;
    }
  }

  function toggleDisable() {
    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    const url =
      baseurl +
      "server/" +
      serverId +
      "/toggleDisable/" +
      modtype +
      "?filename=" +
      filename;
    fetch(url, {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        console.error(data);
        if (data.includes("disabled")) {
          disableText = "Enable";
        } else if (data.includes("enabled")) {
          disableText = "Disable";
        }
      });
  }
</script>

<div>
  <div
    class="px-3 py-2 rounded-t-lg bg-base-300 flex justify-between items-center"
  >
    <div class="flex items-center space-x-1">
      <p>{filename}</p>
      <button
        on:click={() => {
          del(filename);
        }}
        class="btn btn-xs btn-error mt-0.5 btn-square"
      >
        <Trash2 size="15" /></button
      >
      <button class="btn btn-xs btn-ghost mt-0.5" on:click={toggleDisable}>
        {disableText}
      </button>
      {#await promise then}
        {#if modtype == "plugin" && (platform == "cf" || platform == "lr")}
          <ChooseVersion {id} {name} {author} {desc} {icon} buttonType="2" />
        {:else if modtype == "mod"}
          <ChooseModVersion
            {id}
            {name}
            {author}
            {desc}
            {icon}
            {platform}
            {slug}
            buttonType="2"
          />
        {/if}
      {/await}
    </div>

    <div class="flex items-center space-x-1">
      <div
        class="hidden md:flex bg-base-200 px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
      >
        <Clock size="16" class="mr-1.5" />
        {time}
      </div>
      <button class="btn btn-ghost btn-xs">
        <label class="swap">
          <input type="checkbox" on:click={toggleInfo} />
          <div class="swap-on"><ChevronDown /></div>
          <div class="swap-off"><ChevronUp /></div>
        </label>
      </button>
    </div>
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
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
            >
              <Clock size="16" class="mr-1.5" />
              {time}
            </div>
          </div>
        {:else if platform == "cf"}
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
                        href="https://curseforge.com/minecraft/mc-mods/{slug}"
                        target="_blank"
                        class="link link-hover text-xl font-bold">{name}</a
                      >
                    {/if}
                    <div class="flex space-x-1">
                      <p>by</p>
                      <a
                        href="https://curseforge.com/members/{author}"
                        target="_blank"
                        class="link link-hover">{author}</a
                      >
                    </div>
                    <img
                      src="https://static-beta.curseforge.com/images/favicon.ico"
                      width="24"
                    />
                  </div>
                  <div class="" />
                </div>
              </div>
            </div>
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
            >
              <Clock size="16" class="mr-1.5" />
              {time}
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
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
            >
              <Clock size="16" class="mr-1.5" />
              {time}
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
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
            >
              <Clock size="16" class="mr-1.5" />
              {time}
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
