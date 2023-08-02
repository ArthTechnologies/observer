<script lang="ts">
  import { sendVersion } from "$lib/scripts/req";

  import { browser } from "$app/environment";
  import { Check, Plus } from "lucide-svelte";

  export let name: string;
  export let date: string;
  export let type: string;
  export let url: string;
  export let modpackId: string;
  export let versionId: string;

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
    }
  }
</script>

<div class="bg-base-200 rounded-lg p-3">
  <div class="flex justify-between place-items-center">
    <div class="flex space-x-1">
      <p class="text-xl font-bold">{name}</p>
      <div class="flex space-x-1 place-items-end">
        <p class="text-warning">{type}</p>
      </div>
    </div>
    <div class="flex place-items-center space-x-2">
      <p>{time}</p>

      <label
        on:click={submit}
        class="btn btn-circle btn-ghost swap swap-rotate"
      >
        <input type="checkbox" /><Plus class="swap-off" /><Check
          class="swap-on"
        /></label
      >
    </div>
  </div>
</div>
