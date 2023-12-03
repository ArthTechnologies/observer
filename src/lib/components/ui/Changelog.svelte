<script lang="ts">
  import { version } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { ClipboardList } from "lucide-svelte";
  import { marked } from "marked";
  export let changelog: string = "";
  export let platform: string = "mr";
  export let pluginId: string = "";
  export let versionId: string = "";

  let uniqueId = Math.random().toString(36).substr(2, 9);

  function load() {
    //while modrinth includes the changelog with each version result, you have to grab it seperately for curseForge.
    if (platform == "cf") {
      fetch(
        apiurl +
          "curseforge/" +
          pluginId +
          "/version/" +
          versionId +
          "/changelog"
      )
        .then((response) => response.json())

        .then((data) => {
          console.log(data);
          console.log(versionId);
          changelog = data;
        });
    }
  }
</script>

<label
  for="changelog{uniqueId}"
  class="btn btn-xs btn-ghost w-[13rem] h-[1.625rem] flex justify-start rounded-md"
  on:click={load}
>
  <ClipboardList size="16" class="mr-1.5" />See Changelog
</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="changelog{uniqueId}" class="modal-toggle" />
<div class="modal p-3" style="margin:0rem;">
  <div
    class="modal-box bg-opacity-[.975] backdrop-blur relative w-11/12 max-w-5xl space-y-5 h-full"
  >
    <div class="flex justify-between">
      <label
        for="changelog{uniqueId}"
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
