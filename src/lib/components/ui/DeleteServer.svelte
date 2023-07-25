<script lang="ts">
  import { deleteServer } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import World from "./World.svelte";
  let id = -1;
  if (browser) {
    id = localStorage.getItem("serverID");
  }
  function del() {
    deleteServer(id);
  }
</script>

<!-- The button to open modal -->
<label for="delete" class="btn btn-warning"
  ><svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-trash-2 mr-1.5"
    ><polyline points="3 6 5 6 21 6" /><path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    /><line x1="10" y1="11" x2="10" y2="17" /><line
      x1="14"
      y1="11"
      x2="14"
      y2="17"
    /></svg
  >{$t("button.delete")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="delete" class="btn btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <h3 class="text-lg font-bold">Do you want to delete this server?</h3>
    <div
      class="bg-warning w-86 h-16 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        /></svg
      >
      <span class="text-sm"
        >Warning: Your server will be instantly deleted. This cannot be undone.
        Consider downloading your world first.</span
      >
    </div>

    <a href="/"
      ><button class="btn btn-error" on:click={del}
        >{$t("button.delete")}</button
      ></a
    >
  </div>
</div>
