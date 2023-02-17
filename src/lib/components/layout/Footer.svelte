<script lang="ts">
  let Webname = "Arth Panel";
  import { t, locale, locales } from "$lib/scripts/i18n";
  type NavType = "default" | "welcome";

  export let navType: NavType;
</script>

{#if navType === "default"}
  <footer
    class="mt-96 md:mt-0 footer footer-center p-4 md:bg-base-300 text-base-content"
  >
    <div>
      <p>
        {Webname}{@html $t("site.footer")}
        {new Date().getFullYear()}.
      </p>
    </div>
  </footer>
{:else}
  <div class="footer footer-center fixed text-xs bottom-0 p-2">
    <div>
      <p>
        {Webname}{@html $t("site.footer")}
        {new Date().getFullYear()}.
      </p>
    </div>
  </div>
{/if}
