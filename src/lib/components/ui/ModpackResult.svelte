<script lang="ts">
  import { getVersions } from "$lib/scripts/req";

  import ChooseVersionModpack from "$lib/components/ui/ChooseVersionModpack.svelte";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { AlertCircle, Download } from "lucide-svelte";
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let id: string;
  export let client: string;
  export let downloads: number;
  export let platform: string;
  export let versions: string[] = [];
  export let slug: string;
  console.log(client);
  switch (client) {
    case "required":
      client = "Players must install this modpack to join your server.";
      break;
    case "optional":
      client = "Players can optionally install the modpack.";
      break;
    case "unsupported":
      client = "This modpack isn't meant to be installed by your players.";
  }
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
  <div class="flex justify-between place-items-center max-w-full relative">
    <div class="flex space-x-3 flex-shrink-0 w-minus-7">
      {#if platform == "mr"}
      <a href="https://modrinth.com/plugin/{slug}" target="_blank">
        <img
          src={icon}
          alt="noicon"
          class="w-14 h-14 md:w-20 md:h-20 bg-base-300 rounded-lg text-sm"
        />
      </a>
      {:else if platform == "cf"}
      <a href="https://curseforge.com/minecraft/modpacks/{slug}" target="_blank">
        <img
          src={icon}
          alt="noicon"
          class="w-14 h-14 md:w-20 md:h-20 bg-base-300 rounded-lg text-sm"
        />
      </a>
      {/if}
      <div class="max-w-full w-minus-7">
        {#if platform == "mr"}
        <div class="sm:flex gap-1 max-w-full">
          <a
            href="https://modrinth.com/mod/{slug}"
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
        {:else if platform == "cf"}
        <div class="sm:flex gap-1 max-w-full">
          <a
            href="https://curseforge.com/minecraft/modpacks/{slug}"
            target="_blank"
            class="flex link link-hover text-xl font-bold w-[10rem] md:w-auto break-all sm:break-works"
            >{name}</a
          >
          <div class="flex space-x-1 place-items-end">
            <p>{$t("by")}</p>
            <a
              href="https://legacy.curseforge.com/members/{author}"
              target="_blank"
              class="link link-hover">{author}</a
            >
          </div>
        </div>
        {/if}
        <p class="w-minus-7">
          {desc}
        </p>

        <div
          class="md:flex space-x-0 md:space-x-2 space-y-2 md:space-y-0 items-center mt-2"
        >
          <div
            class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[5rem] md:w-auto"
          >
            <Download class="mr-1.5" size="16" />
            {downloads}
          </div>
          <div
            class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[10rem] md:w-auto"
          >
            <AlertCircle class="mr-1.5" size="16" />
            {client}
          </div>
        </div>
      </div>
    </div>
    <ChooseVersionModpack {versions} {platform} {id} {name} {author} {desc} {icon} {slug}/>
  </div>
</div>
