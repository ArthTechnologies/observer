<script lang="ts">
  import { getVersions, sendVersion } from "$lib/scripts/req";

  import { browser } from "$app/environment";
  import Helper from "./Helper.svelte";
  import { t } from "$lib/scripts/i18n";
  import { Check, Info, Plus } from "lucide-svelte";
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let disclaimer: string;
  export let link: string;
  export let authorLink: string;
  export let pluginId: string;

  function get() {
    getVersions(id).then((data) => {
      console.log(data);
    });
  }
  let software = "";
  let version = "";
  if (browser) {
    software = localStorage.getItem("serverSoftware");
    version = localStorage.getItem("serverVersion");
  }

  function submit() {
    let id = "";
    if (browser) {
      id = localStorage.getItem("serverID");
    }

    let plId = pluginId.replace(/\//g, "_");

    sendVersion(link, id, "gh_" + plId, name);
  }
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center max-w-full relative">
    <div class="flex space-x-3 flex-shrink-0 w-minus-7">
      <a href="https://github.com/{pluginId}/#readme" target="_blank">
        <img
          src={icon}
          alt="noicon"
          class="w-[56px] h-[56px] md:w-[5.6rem] md:h-20 bg-base-300 rounded-lg text-sm"
        /></a
      >
      <div class="max-w-full w-minus-7">
        <div class="sm:flex gap-1 max-w-full">
          <a
            href="https://github.com/{pluginId}/#readme"
            target="_blank"
            class="flex link link-hover text-xl font-bold w-[10rem] md:w-auto break-all sm:break-works"
            >{name}
          </a>
          <div class="flex space-x-1 place-items-end">
            <p>{$t("by")}</p>
            <a href={authorLink} target="_blank" class="flex link link-hover"
              >{author}
            </a>
            {#if disclaimer != ""}
              <div class="tooltip tooltip-right" data-tip={disclaimer}>
                <Info class="ml-1" />
              </div>
            {/if}
          </div>
        </div>
        <p class="w-minus-7">
          {desc}
        </p>
      </div>
    </div>
    <label
      on:click={submit}
      class="btn btn-circle btn-ghost swap swap-rotate absolute right-0"
    >
      <input type="checkbox" /><Plus class="swap-off" /><Check
        class="swap-on"
      /></label
    >
  </div>
</div>
