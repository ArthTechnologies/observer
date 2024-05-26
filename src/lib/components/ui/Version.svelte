<script lang="ts">
  import { apiurl, sendVersion } from "$lib/scripts/req";

  import { browser, version } from "$app/environment";
  import { onMount } from "svelte";
  import {
    AlertCircle,
    Check,
    ClipboardList,
    Clock,
    InfoIcon,
    Plus,
  } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import Changelog from "./Changelog.svelte";

  export let name: string;
  export let date: string;
  export let type: string;
  export let url: string;
  export let pluginId: string;
  export let pluginName: string;
  export let modtype: string;
  export let dependencies: string[] = [];
  export let platform: string = "mr";
  export let alreadyInstalled: boolean = false;
  export let changelog: string = "";

  export let versionId: string = "";
  let uniqueId = Math.random().toString(36).substr(2, 9);
  if (type == "release") {
    type = "";
  } else if (type == "beta") {
    type = "Beta";
  } else if (type == "alpha") {
    type = "Alpha";
  }
  if (browser) {
    //listens for versionSet events, so that if another
    //version is selected the checkbox is unchecked
    window.addEventListener("versionSet", (e) => {
      if (e.detail.versionId != versionId) {
        let checkbox = document.getElementById("addBtn" + uniqueId);
        checkbox.checked = false;
      }
    });
  }
  let time = new Date(date).toLocaleString();

  function submit() {
    let id = "";
    if (browser) {
      id = localStorage.getItem("serverID");
      window.dispatchEvent(
        new CustomEvent("versionSet", {
          detail: {
            id: id,
            versionId: versionId,
            platform: platform,
            versionName: name,
          },
        })
      );
    }

    pluginName = pluginName.replace(/["']/g, "");
    pluginName = pluginName.replace(/[\(\)]/g, "");
    pluginName = pluginName.replace(/[\s_]/g, "-");
    sendVersion(url, id, pluginId, pluginName, modtype);
  }
  for (let i in dependencies) {
    if (platform == "mr") {
      fetch("https://api.modrinth.com/v2/project/" + dependencies[i].project_id)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          dependencies[i].name = data.title;
        });
    } else {
      fetch(apiurl + "curseforge/" + dependencies[i].modId)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          dependencies[i].name = data.name;
        });
    }
    //there is a issue where there are sometimes duplicate dependencies
    //the root cause is unknown, but this is a workaround
    if (i > 0) {
      if (dependencies[i].name == dependencies[i - 1].name) {
        dependencies.pop();
      }
    }
  }
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center items-center">
    <div>
      <div>
        <span class="text-xl font-bold">{name}</span>

        <span class="text-warning">{type}</span>
      </div>
      <div class="flex gap-2 flex-wrap mt-2 md:w-[15rem]">
        <div
          class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
        >
          <Clock size="16" class="mr-1.5" />
          {time}
        </div>

        {#each dependencies as dependency}
          <div
            class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
          >
            {#if platform == "mr"}
              {#if dependency.dependency_type == "optional"}
                <InfoIcon class="mr-1.5 shrink-0" size="16" />
                {$t("worksWith")}
              {:else if dependency.dependency_type == "incompatible"}
                <AlertCircle class="mr-1.5 shrink-0" size="16" />
                {$t("incompatibleWith")}
              {:else}
                <AlertCircle class="mr-1.5 shrink-0" size="16" />
                {$t("requires")}
              {/if}
            {:else if (dependency.relationType = 2)}
              <InfoIcon class="mr-1.5 shrink-0" size="16" />
              {$t("worksWith")}
            {:else if dependency.relationType == 5}
              <AlertCircle class="mr-1.5 shrink-0" size="16" />
              {$t("incompatibleWith")}
            {:else if dependency.relationType == 3}
              <AlertCircle class="mr-1.5 shrink-0" size="16" />
              {$t("requires")}
            {/if}

            {dependency.name}
          </div>
        {/each}
        {#if changelog != "" || platform == "cf"}
          <Changelog {changelog} {platform} {versionId} {pluginId} />
        {/if}
      </div>
    </div>
    {#if alreadyInstalled}
      <div class="w-[3rem] h-[3rem] flex items-center justify-center">
        <Check />
      </div>
    {:else}
      <div class="flex place-items-center space-x-2">
        <label
          on:click={submit}
          class="btn btn-circle btn-ghost swap swap-rotate"
        >
          <input type="checkbox" id="addBtn{uniqueId}" /><Plus
            class="swap-off"
          /><Check class="swap-on" /></label
        >
      </div>
    {/if}
  </div>
</div>
