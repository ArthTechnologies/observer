<script lang="ts">
  import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
  import { lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { ChevronDown, ChevronUp, Clock, Trash, Trash2 } from "lucide-svelte";
  import ChooseVersion from "./ChooseVersion.svelte";
  import ChooseModVersion from "./ChooseModVersion.svelte";
  import TranslateableText from "./TranslateableText.svelte";

  export let name;
  export let id;
  export let platform;
  export let modtype;
  export let filename;
  export let date;
  export let disabled;
  export let desc = "";
  export let icon = "";
  export let slug = id;
  export let author = "";
  let showInfo = true;
  let disableText = $t("disable");
  if (disabled) {
    disableText = $t("enable");
  }

  let time = new Date(date).toLocaleString();
  let serverId = "";

  let prefixToHandleFlexOnSM = "";
  if (platform == "cf" || platform == "lr") {
    prefixToHandleFlexOnSM = "sm:";
  }
  if (browser) {
    serverId = localStorage.getItem("serverID");
    //if screen is small, only say the date
    if (window.innerWidth < 768) {
      time = new Date(date).toLocaleString().split(",")[0];
    }
  }

  if (platform == "lr") {
    name = name.replace(/-/g, " ");

    fetch(lrurl + "project/" + id)
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
    fetch(apiurl + "curseforge/" + id)
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
    if (usingOcelot) baseurl = getServerNode(id);
    const url =
      baseurl + "server/" + serverId + "/files/" + modtype + "s*" + filename;
    fetch(url, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
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
    if (usingOcelot) baseurl = getServerNode(id);
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
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        console.error(data);
        if (data.includes("disabled")) {
          disableText = $t("enable");
        } else if (data.includes("enabled")) {
          disableText = $t("disable");
        }
      });
  }
</script>

<div>
  <div
    class="px-3 py-2 rounded-t-lg bg-base-300 flex justify-between items-center"
  >
    <div class="{prefixToHandleFlexOnSM}flex items-center gap-1 break-all">
      <div class="flex mr-1 items-center max-{prefixToHandleFlexOnSM}mb-1">
        {name}
        {#if platform == "lr"}
          <img
            class="ml-1.5 h-6"
            src="/images/modrinth.svg"
            width="24"
            height="24"
          />
        {:else if platform == "cf"}
          <img
            class="ml-1.5 h-6"
            src="/images/curseforge.svg"
            width="24"
            height="24"
          />
        {:else if platform == "gh"}
          <img
            class="ml-1.5 h-6"
            src="/images/github.svg"
            width="24"
            height="24"
          />
        {:else if platform == "cx"}
          <img
            class="ml-1.5 h-6"
            src="/images/geyser.webp"
            width="24"
            height="24"
          />
        {/if}
      </div>

      <div class="flex items-center space-x-1">
        <button
          on:click={() => {
            del(filename);
          }}
          class="btn btn-xs btn-error btn-square"
        >
          <Trash2 size="15" /></button
        >
        <button class="btn btn-xs btn-ghost" on:click={toggleDisable}>
          {disableText}
        </button>

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
      </div>
    </div>

    <div class="flex items-center space-x-1">
      <div
        class="hidden md:flex bg-base-200 px-2 py-1 rounded-md place-items-center text-sm md:w-[13rem] bg-opacity-90 backdrop-blur"
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
    <div
      class="bg-base-200 rounded-b-lg px-1.5 pt-2.5 pb-2.5 space-x-1 relative"
    >
      <div class="absolute bottom-2 md:top-2 right-2 text-sm text-[#767c87]">
        {filename}
      </div>
      <div class="px-1.5">
        {#if platform == "lr"}
          <div class="flex justify-between place-items-center">
            <div class="flex space-x-3">
              <div>
                <div class="flex space-x-1">
                  <div>
                    {#if name == id}
                      <div
                        class="h-6 w-16 animate-pulse bg-slate-600 rounded-lg"
                      />
                    {:else}
                      <a
                        href="https://modrinth.com/plugin/{slug}"
                        target="_blank"
                        class="hover:link text-xl font-bold">{name}</a
                      >
                    {/if}

                    {$t("by")}
                    <a
                      href="https://modrinth.com/user/{author}"
                      target="_blank"
                      class="hover:link"
                      >{author}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm md:w-[13rem] bg-opacity-90 backdrop-blur"
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
                  <div>
                    {#if name == id}
                      <div
                        class="h-6 w-16 animate-pulse bg-slate-600 rounded-lg"
                      />
                    {:else}
                      <a
                        href="https://curseforge.com/minecraft/mc-mods/{slug}"
                        target="_blank"
                        class="hover:link text-xl font-bold">{name}</a
                      >
                    {/if}

                    {$t("by")}
                    <a
                      href="https://curseforge.com/members/{author}"
                      target="_blank"
                      class="hover:link"
                      >{author}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm md:w-[13rem] bg-opacity-90 backdrop-blur"
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
                  <div>
                    {#if name == id}
                      <div
                        class="h-6 w-16 animate-pulse bg-slate-600 rounded-lg"
                      />
                    {:else}
                      <a
                        href="https://github.com/{id}"
                        target="_blank"
                        class="hover:link text-xl font-bold">{name}</a
                      >
                    {/if}

                    {$t("by")}
                    <a
                      href="https://github.com/{author}"
                      target="_blank"
                      class="hover:link"
                      >{author}
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm md:w-[13rem] bg-opacity-90 backdrop-blur"
            >
              <Clock size="16" class="mr-1.5" />
              {time}
            </div>
          </div>
        {:else if platform == "cx"}
          <div class="flex justify-between place-items-center">
            <div class="flex space-x-3">
              <div>
                <div>
                  {#if name == "Geyser" || name == "Floodgate"}
                    <span class="text-xl font-bold">{name}</span>

                    {$t("by")}
                    <a
                      href="https://geysermc.org"
                      target="_blank"
                      class="hover:link">GeyserMC</a
                    >
                  {:else}
                    <p class="text-xl font-bold">{name}</p>
                  {/if}
                </div>
              </div>
            </div>
            <div
              class="flex md:hidden bg-base-300 px-2 py-1 rounded-md place-items-center text-sm md:w-[13rem] bg-opacity-90 backdrop-blur"
            >
              <Clock size="16" class="mr-1.5" />
              {time}
            </div>
          </div>
        {/if}

        <div class="max-md:mb-5">
          <TranslateableText text={desc} />
        </div>
      </div>

      {#if platform == "lr"}
        <!-- <ChooseVersionAlt pluginName={name} {id} /> this currently doesnt delete the old plugin, so its not enabled-->
      {/if}
    </div>
  {/if}
</div>
