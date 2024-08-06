<script lang="ts">
  import { getVersions } from "$lib/scripts/req";

  import ChooseVersion from "$lib/components/ui/ChooseVersion.svelte";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { Download, Plug } from "lucide-svelte";
  import TranslateableText from "./TranslateableText.svelte";
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let id: string;
  export let recursive = false;
  export let downloads: number;

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

<div class="bg-base-200 rounded-lg p-3 relative">
  {#if name.includes("Dynmap") || name.includes("Simple Voice Chat") || name.includes("Chunky") || name.includes("DiscordSRV")}
    <div
      class="absolute h-6 bg-base-300 rounded-lg pl-[0.2rem] px-2 mt-1 text-sm flex items-center top-0.5 right-1"
    >
      <Plug size="17" class="mr-[0.1rem]" />
      {$t("plugins.officiallySupported")}
    </div>
  {/if}
  <div class="flex justify-between place-items-center max-w-full relative">
    <div class="flex space-x-3 w-minus-7">
      <a
        class="shrink-0"
        href="https://modrinth.com/plugin/{id}"
        target="_blank"
      >
        <img
          src={icon}
          class="w-16 h-16 md:w-20 md:h-20 bg-base-300 rounded-lg text-sm"
        />
      </a>
      <div class="w-minus-7">
        <p class="w-minus-5">
          <a
            href="https://modrinth.com/plugin/{id}"
            target="_blank"
            class="hover:link text-xl font-bold md:w-auto">{name}</a
          >

          {$t("by")}
          <a
            href="https://modrinth.com/user/{author}"
            target="_blank"
            class="hover:link">{author}</a
          >
        </p>

        <p class="w-minus-7">
          <TranslateableText text={desc} />
        </p>
        <div
          class="md:flex space-x-0 md:space-x-2 space-y-2 md:space-y-0 items-center mt-1.5"
        >
          {#if downloads != "null"}
            <div
              class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[5rem] md:w-auto"
            >
              <Download class="mr-1.5" size="16" />

              {downloads}
            </div>
          {/if}
        </div>
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
