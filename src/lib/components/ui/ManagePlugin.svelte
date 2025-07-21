<script lang="ts">
  import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
  import { lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { BoxIcon, ChevronDown, ChevronUp, Clock, InfoIcon, Trash, Trash2 } from "lucide-svelte";
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
      baseurl + "server/" + serverId + "/files/delete/" + modtype + "s*" + filename;
    fetch(url, {
      method: "POST",
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
    class="p-2 rounded-lg bg-base-200 flex justify-between items-center h-16"
  >
    <div class="{prefixToHandleFlexOnSM}flex items-center gap-1 break-all">
      <div class="flex gap-2 mr-1 items-center max-{prefixToHandleFlexOnSM}mb-1">
        {#if icon}
    <img 
          class="h-12 w-12 bg-base-100 rounded-md"
          src={icon}
          alt="Mod Icon"
         
        />
        {:else}
        <div class="h-12 w-12 flex-shrink-0 bg-base-100 rounded-md flex items-center justify-center">
          <BoxIcon size=32/>
        </div>
        {/if}
        <div class="flex flex-col">
          <div class=""><span class="font-bold text-gray-200 font-ubuntu">{name}</span>
            {#if author}<span class="text-sm font-ubuntu ml-1 text-gray-300"> by {author}</span>{/if}</div>
          <div  class="text-xs text-gray-400 font-mono overflow-hidden text-ellipsis w-[100%] h-3">
      
          {#if desc}
          {desc.length > 80 ? desc.substring(0, 80).trim() + "..." : desc}
          {/if}
          </div>
        </div>
        
      </div>

    
    </div>

    <div class="flex items-center">
              <button class="btn btn-sm text-xs btn-ghost" on:click={toggleDisable}>
          {disableText}
        </button>

      <button
       class="btn btn-square btn-ghost btn-sm"
        on:click={() => del(filename)}
        title={$t("delete")}
      >
        <Trash2 size="16" />
      </button>
                  <button class="btn btn-square btn-ghost btn-sm"
        on:click={toggleInfo}
        title={$t("info")}
      >
        <InfoIcon size="16" />
      </button>

      

    </div>
  </div>

</div>
