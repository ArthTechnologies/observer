<script lang="ts">
  import { sendVersion } from "$lib/scripts/req";

  import { browser } from "$app/environment";
  import { AlertCircle, Check, Clock, Plus } from "lucide-svelte";

  export let name: string;
  export let date: string;
  export let type: string;
  export let url: string;
  export let id: string;
  export let versionId: string;
  let modpackId = id;
  let uniqueId = Math.random().toString(36).substr(2, 9);

  if (type == "release") {
    type = "";
  } else if (type == "beta") {
    type = "Beta";
  } else if (type == "alpha") {
    type = "Alpha";
  }
  let time = new Date(date).toLocaleString();

  function submit() {
    let id = "";
    if (browser) {
      id = localStorage.getItem("serverID");
      localStorage.setItem("modpackURL", url);
      localStorage.setItem("modpackID", modpackId);
      setTimeout(() => {
        if (browser) {
          document.getElementById("addBtn" + uniqueId).checked = false;
        }
      }, 2500);
    }
  }
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center items-center">
    <div>
      <div class="flex space-x-1">
        <p class="text-xl font-bold">{name}</p>
        <div class="flex space-x-1 place-items-end">
          <p class="text-warning">{type}</p>
        </div>
      </div>
      <div class="flex gap-2 flex-wrap mt-2">
        <div
          class="bg-base-300 flex px-2 py-1 rounded-md place-items-center text-sm w-[13rem]"
        >
          <Clock size="16" class="mr-1.5" />
          {time}
        </div>
      </div>
    </div>
    <div class="flex place-items-center space-x-2">
      <label
        on:click={submit}
        class="btn btn-circle btn-ghost swap swap-rotate"
      >
        <input id="addBtn{uniqueId}" type="checkbox" /><Plus
          class="swap-off"
        /><Check class="swap-on" /></label
      >
    </div>
  </div>
</div>
