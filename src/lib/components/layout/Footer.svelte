<script lang="ts">
  import { browser } from "$app/environment";

  import { t, locale, locales } from "$lib/scripts/i18n";
  type NavType = "default" | "welcome";

  export let navType: NavType;
</script>

<footer class="footer items-center p-4  ">
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
      class="feather feather-help-circle mt-[0.05rem]"
      ><circle cx="12" cy="12" r="10" /><path
        d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"
      /><line x1="12" y1="17" x2="12.01" y2="17" /></svg
    >Help
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
    <h3 class="text-lg font-bold mb-2">Support Options</h3>
    <div class="flex space-x-2">
      <a
        class="btn btn-sm"
        href="https://discord.gg/gCafNVA43d"
        target="_blank"
        rel="noreferrer">Discord</a
      >
      <a
        class="btn btn-sm"
        href="mailto:support@arthmc.xyz"
        target="_blank"
        rel="noreferrer">email support@arthmc.xyz</a
      >
    </div>
  </div>
</div>
