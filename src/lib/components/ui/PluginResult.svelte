<script lang="ts">
  import { getVersions } from "$lib/scripts/req";

  import ChooseVersion from "$lib/components/ui/ChooseVersion.svelte";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let id: string;

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
          class="w-14 h-14 bg-base-300 rounded-lg text-sm"
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
        <p class="break-words w-[50rem]">{desc}</p>
      </div>
    </div>
    <ChooseVersion {id} pluginName={name}/>
  </div>
</div>
