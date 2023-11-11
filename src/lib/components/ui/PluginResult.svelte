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
  export let recursive = false;

  let software = "";
  let version = "";
  if (browser) {
    software = localStorage.getItem("serverSoftware");
    version = localStorage.getItem("serverVersion");
    console.error(author);
    //wait until chooseversion loads
    setTimeout(function () {
      document.getElementById("pluginAuthor").innerHTML = author;
    }, 100);
  }
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center max-w-full relative">
    <div class="flex space-x-3 flex-shrink-0 w-minus-7">
      <a href="https://modrinth.com/plugin/{id}" target="_blank">
        <img
          src={icon}
          alt="noicon"
          class="w-14 h-14 bg-base-300 rounded-lg text-sm"
        />
      </a>
      <div class="max-w-full w-minus-7">
        <div class="sm:flex gap-1 max-w-full">
          <a
            href="https://modrinth.com/plugin/{id}"
            target="_blank"
            class="flex link link-hover text-xl font-bold w-[10rem] md:w-auto break-all sm:break-works"
            >{name}</a
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
        <p class="w-minus-7">
          {desc}
        </p>
      </div>
    </div>

    {#if !recursive}<ChooseVersion
        {id}
        pluginName={name}
        {name}
        {desc}
        {author}
        {icon}
      />{/if}
  </div>
</div>
