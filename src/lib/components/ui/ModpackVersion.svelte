<script lang="ts">
  import { apiurl, sendVersion } from "$lib/scripts/req";

  import { browser } from "$app/environment";
  import { onMount } from "svelte";
  import { AlertCircle, BadgeCheck, Check, CheckCheck, CheckIcon, Clock, Plus } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import Changelog from "./Changelog.svelte";

  export let name: string;
  export let date: string;
  export let type: string;
  export let url: string;
  export let id: string;
  export let versionId: string;
  export let alreadyInstalled: boolean = false;
  export let from: string = "serverpage";
  export let changelog: string = "";
  export let platform: string = "cf";
  export let alternateFileId: string = "0";
  let modpackId = id;
  console.log("modpackId", modpackId);
  let uniqueId = Math.random().toString(36).substr(2, 9);

  if (type == "release") {
    type = "";
  } else if (type == "beta") {
    type = "Beta";
  } else if (type == "alpha") {
    type = "Alpha";
  }
  let time = new Date(date).toLocaleString();

  let alternateFile = {
    enabled: false,
    name: "",
    loaded: false,
    downloadUrl: "",
  };

  if (browser) {
    console.error("alternateVersionId", alternateFileId);
    if (alternateFileId != "0") {
      fetch(
        apiurl + "curseforge/" + modpackId + "/version/" + alternateFileId,
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
            username: localStorage.getItem("accountEmail"),
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          if (res.displayName.split("").length > 45) {
            alternateFile.name =
              res.displayName.split("").slice(0, 43).join("") + "...";
          } else {
            alternateFile.name = res.displayName;
          }
          alternateFile.downloadUrl = res.downloadUrl;
          alternateFile.loaded = true;
          alternateFile.enabled = true;
          versionId = alternateFileId;
          localStorage.setItem("modpackVersionID", alternateFileId);
        });
    }

    window.addEventListener("versionSet", (e) => {
      if (e.detail.versionId != versionId) {
        let checkbox = document.getElementById("addBtn" + uniqueId);

        if (checkbox) {
          checkbox.checked = false;
        }
      }
    });

    onMount(() => {
      if (localStorage.getItem("modpackVersionID") == versionId) {
        let checkbox = document.getElementById("addBtn" + uniqueId);
        if (checkbox) {
          checkbox.checked = true;
        }
      }
    });
  }

  function submit() {
    let id = "";
    if (browser) {
      id = localStorage.getItem("serverID");

      let downloadUrl = url;
      if (alternateFile.enabled) {
        downloadUrl = alternateFile.downloadUrl;
      }
      if (from == "modal") {
        console.log("test");
        fetch(
          apiurl +
            "server/" +
            id +
            "/modpack?modpackURL=" +
            downloadUrl +
            "&modpackID=" +
            modpackId +
            "&versionID=" +
            versionId,
          {
            method: "POST",
            headers: {
              token: localStorage.getItem("token"),
              username: localStorage.getItem("accountEmail"),
            },
          }
        ).then((res) => {
          console.log(res);
        });
      } else {
        localStorage.setItem("modpackURL", downloadUrl);
        localStorage.setItem("modpackID", modpackId);
        localStorage.setItem("modpackVersionID", versionId);
      }
      window.dispatchEvent(
        new CustomEvent("versionSet", {
          detail: {
            id: modpackId,
            versionId: versionId,
            platform: platform,
            versionName: name,
          },
        })
      );
    }
  }
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center items-center">
    <div>
      <div>
        <span class="text-xl font-bold">{name}</span>
        <span class="text-warning mt-1">{type}</span>
      </div>
      <div class="flex gap-2 flex-wrap mt-2">
        <div
          class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
        >
          <Clock size="16" class="mr-1.5" />
          {time}
        </div>
        {#if alternateFile.loaded}
          <div class="px-2 py-1  text-sm w-[13rem] h-[1.625rem] flex items-center">
            <BadgeCheck size="16" class="mr-1.5"/>  Server Pack
          </div>
        {/if}
        {#if changelog != "" || platform == "cf"}
          <Changelog {changelog} {platform} {versionId} pluginId={modpackId} />
        {/if}
      </div>
    </div>
    <div class="flex place-items-center space-x-2">
      {#if alreadyInstalled}
        <div class="w-[3rem] h-[3rem] flex items-center justify-center">
          <Check />
        </div>
      {:else}
        <label
          on:click={submit}
          class="btn btn-circle btn-ghost swap swap-rotate"
        >
          <input id="addBtn{uniqueId}" type="checkbox" /><Plus
            class="swap-off"
          /><Check class="swap-on" /></label
        >
      {/if}
    </div>
  </div>
</div>
