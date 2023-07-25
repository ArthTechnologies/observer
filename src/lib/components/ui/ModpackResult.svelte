<script lang="ts">
  import { getVersions } from "$lib/scripts/req";

  import ChooseVersionModpack from "$lib/components/ui/ChooseVersionModpack.svelte";
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let id: string;
  export let client: string;
  export let downloads: number;
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

<div class="bg-base-200 rounded-lg p-3 mt-1">
  <div class="flex justify-between place-items-center">
    <div class="flex space-x-3 flex-shrink-0">
      <a href="https://modrinth.com/plugin/{id}" target="_blank">
        <img
          src={icon}
          alt="noicon"
          class="w-14 h-14 bg-base-300 rounded-lg text-sm"
        />
      </a>
      <div>
        <div class="sm:flex gap-1">
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
        <p class="w-[10rem] sm:w-[11rem] md:w-[50rem]">{desc}</p>
        <div
          class="md:flex space-x-0 md:space-x-2 space-y-2 md:space-y-0 items-center mt-2"
        >
          <div
            class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm"
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
          <div
            class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[10rem] md:w-auto"
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
              class="feather feather-alert-circle mr-1.5"
              ><circle cx="12" cy="12" r="10" /><line
                x1="12"
                y1="8"
                x2="12"
                y2="12"
              /><line x1="12" y1="16" x2="12.01" y2="16" /></svg
            >
            {client}
          </div>
        </div>
      </div>
    </div>
    <ChooseVersionModpack {id} modpackName={name} />
  </div>
</div>
