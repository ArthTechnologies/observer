<script lang="ts">
  import { browser } from "$app/environment";

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { HelpCircle, Mail } from "lucide-svelte";
  import LanguageSwitcher from "../buttons/LanguageSwitcher.svelte";
  type NavType = "default" | "welcome";

  export let navType: NavType;
  let accountId = "";
  if (browser) {
    accountId = localStorage.getItem("accountId");
  }
</script>

<footer
  class="flex justify-between items-center p-4 fixed bottom-0 w-full z-50 pointer-events-none"
>
  <LanguageSwitcher />
  <label
    for="support-modal"
    style="margin:0rem;"
    class="btn btn-sm btn-ghost flex items-center justify-self-end pointer-events-auto"
  >
    <HelpCircle class="mr-1.5 mt-[0.05rem]" size="18" />
    {$t("support")}
  </label>
</footer>

<!-- Support Modal -->
<input
  type="checkbox"
  id="support-modal"
  style="margin:0rem;"
  class="modal-toggle"
/>
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <p class="opacity-50 absolute top-1.5 left-2.5 text-sm">
      Account ID: {accountId}
    </p>
    <label
      for="support-modal"
      style="margin:0rem;"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-2xl font-bold mb-2 mt-1">{$t("help.title")}</h3>

    <h3 class="text-lg font-bold mt-2 mb-1">{$t("help.l.tutorials")}</h3>
    <a
      class="btn btn-neutral btn-sm"
      href="https://arthmc.xyz/docs/how-to-join-servers"
      target="_blank"
      rel="noreferer"
    >
      <img src="/favicon.png" width="20" class="mr-1.5 mb-[.1rem]" />How to Join
      Servers
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
          id="discord-button"
          class="btn btn-neutral z-50"
          href="https://discord.com/invite/jUeNm7UvKy"
          target="_blank"
          rel="noreferrer"
          ><img alt="discord logo" style="width:3ch" src="/discord.svg" />
          <p id="text-shrink" class="w-28 ml-1.5 text-[.8rem]">
            {$t("help.button.getHelpOnOurDiscord")}
          </p></a
        >
      </div>
    </div>
    <p class="text-sm mt-2">
      If you'd like to suggest a feature or give feedback don't hesitate to send
      us an email at <a class="hover:link text-accent">contact@arthmc.xyz</a>.
    </p>
  </div>
</div>
