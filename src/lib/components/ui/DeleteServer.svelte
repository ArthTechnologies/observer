<script lang="ts">
  import { deleteServer } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import World from "./World.svelte";
  import { AlertTriangle, Trash2 } from "lucide-svelte";
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
  ><Trash2 class="mr-1.5" />{$t("button.delete")}</label
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
      <AlertTriangle size="48" />
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
