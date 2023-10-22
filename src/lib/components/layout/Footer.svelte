<script lang="ts">
  import { browser } from "$app/environment";

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { Mail } from "lucide-svelte";
  type NavType = "default" | "welcome";

  export let navType: NavType;
</script>

<footer class=" items-center p-4 fixed bottom-0 right-0 z-50">
  <div class="items-center grid-flow-col" />
  <label
    for="support-modal"
    class="btn btn-sm btn-ghost flex items-center justify-self-end"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-help-circle mt-[0.05rem] mr-1.5"
      ><circle cx="12" cy="12" r="10" /><path
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      /><line x1="12" y1="17" x2="12.01" y2="17" /></svg
    >{$t("help")}
  </label>
</footer>

<!-- Support Modal -->
<input type="checkbox" id="support-modal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label
      for="support-modal"
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-2xl font-bold mb-2">{$t("help.title")}</h3>

    <h3 class="text-lg font-bold mt-2 mb-1">{$t("help.l.tutorials")}</h3>
    <a
      class="btn btn-sm"
      href="https://arthmc.xyz/docs/how-to-join-servers"
      target="_blank"
      rel="noreferer"
    >
      <img src="/favicon.webp" width="20" class="mr-1.5 mb-[.1rem]" />How to
      Join Servers
    </a>
    <h3 class="text-lg font-bold mt-2 mb-1">{$t("help.l.contact")}</h3>
    <div class="md:flex md:space-x-2 space-y-2 md:space-y-0">
      <h3
        class="text-lg font-bold bg-base-200 w-[17rem] rounded-lg px-3 py-2 flex items-center"
      >
        <Mail class="mr-2.5" /> support@arthmc.xyz
      </h3>

      <div class="flex">
        <a
          class="btn z-50"
          href="https://discord.gg/gCafNVA43d"
          target="_blank"
          rel="noreferrer"
          ><img alt="discord logo" style="width:3ch" src="/discord.svg" />
          <p class="w-28">{$t("help.button.getHelpOnOurDiscord")}</p></a
        >
      </div>
    </div>
  </div>
</div>
