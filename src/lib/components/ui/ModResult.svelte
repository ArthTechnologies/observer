<script lang="ts">
  import { getVersions } from "$lib/scripts/req";

  import ChooseModVersion from "$lib/components/ui/ChooseModVersion.svelte";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let id: string;
  export let client: string;
  export let downloads: number;
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
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center">
    <div class="flex space-x-3">
      <a href="https://modrinth.com/plugin/{id}" target="_blank">
        <img
          src={icon}
          alt="noicon"
          class="w-20 h-20 bg-base-300 rounded-lg text-sm"
        />
      </a>
      <div>
        <div class="flex space-x-1">
          <a
            href="https://modrinth.com/plugin/{id}"
            target="_blank"
            class="link link-hover text-xl font-bold">{name}</a
          >
          <div class="flex space-x-1 place-items-end">
            <p>{$t("by")}</p>
            <a
              href="https://modrinth.com/user/{author}"
              target="_blank"
              class="link link-hover">{author}</a
            >
          </div>
        </div>

        <p class="break-words w-[50rem] mb-1 ">{desc}</p>
        <div class="flex space-x-2">
          {#if client == "optional"}
            <div
              class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[18rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-monitor mr-1.5"
                ><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line
                  x1="8"
                  y1="21"
                  x2="16"
                  y2="21"
                /><line x1="12" y1="17" x2="12" y2="21" /></svg
              >
              Players can optionally install this mod.
            </div>
          {:else if client == "required"}
            <div
              class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[23rem]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-monitor mr-1.5"
                ><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line
                  x1="8"
                  y1="21"
                  x2="16"
                  y2="21"
                /><line x1="12" y1="17" x2="12" y2="21" /></svg
              >
              Players need to install this mod to join your server.
            </div>
          {/if}
          <div
            class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[5rem]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="feather feather-download mr-1.5"
              ><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline
                points="7 10 12 15 17 10"
              /><line x1="12" y1="15" x2="12" y2="3" /></svg
            >
            {downloads}
          </div>
        </div>
      </div>
    </div>
    <ChooseModVersion {id} pluginName={name} />
  </div>
</div>
