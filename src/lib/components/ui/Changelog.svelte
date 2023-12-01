<script lang="ts">
  import { ClipboardList } from "lucide-svelte";
  import { marked } from "marked";
  export let changelog: string = "";
</script>

<label
  for="changelog"
  class="btn btn-xs btn-ghost w-[13rem] flex justify-start"
>
  <ClipboardList size="16" class="mr-1.5" />See Changelog
</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="changelog" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div
    class="modal-box bg-opacity-[.975] backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-[45rem]"
  >
    <div class="flex justify-between">
      <label
        for="changelog"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
        >✕</label
      >
      <p class="font-bold text-2xl">Changelog</p>
    </div>
    <p class="mt-2 prose">
      {@html marked(changelog)}
    </p>
  </div>
</div>
