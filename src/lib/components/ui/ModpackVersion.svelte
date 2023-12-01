<script lang="ts">
  import { apiurl, sendVersion } from "$lib/scripts/req";

  import { browser } from "$app/environment";
  import { AlertCircle, Check, Clock, Plus } from "lucide-svelte";
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
  let modpackId = id;
  let uniqueId = Math.random().toString(36).substr(2, 9);

  if (type == "release") {
    type = "";
  } else if (type == "beta") {
    type = "Beta";
  } else if (type == "alpha") {
    type = "Alpha";
  }
  let time = new Date(date).toLocaleString();

  function submit() {
    let id = "";
    if (browser) {
      id = localStorage.getItem("serverID");
      localStorage.setItem("modpackURL", url);
      localStorage.setItem("modpackID", modpackId);
      localStorage.setItem("modpackVersionID", versionId);
      console.log("test");
      if (from == "modal") {
        console.log("test");
        fetch(
          apiurl +
            "server/" +
            id +
            "/modpack?modpackURL=" +
            url +
            "&modpackID=" +
            modpackId +
            "&versionID=" +
            versionId,
          {
            method: "POST",
            headers: {
              token: localStorage.getItem("token"),
              email: localStorage.getItem("accountEmail"),
            },
          },
        ).then((res) => {
          console.log(res);
        });
      }
      setTimeout(() => {
        document.getElementById("addBtn" + uniqueId).checked = false;
      }, 2500);
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
