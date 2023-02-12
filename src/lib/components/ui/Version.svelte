<script lang="ts">
  import { sendVersion } from "$lib/scripts/req";

  import { browser } from "$app/environment";

  export let name: string;
  export let date: string;
  export let type: string;
  export let url: string;
  export let pluginId: string;
  export let pluginName: string;

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
    }

    //replace ()s with nothing, spaces and underscores with -s
    pluginName = pluginName.replace(/[\(\)]/g, "");
    pluginName = pluginName.replace(/[\s_]/g, "-");

    sendVersion(url, id, "lr_" + pluginId, pluginName);
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
        <input type="checkbox" /><svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-plus swap-off"
          ><line x1="12" y1="5" x2="12" y2="19" /><line
            x1="5"
            y1="12"
            x2="19"
            y2="12"
          /></svg
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
          class="feather feather-check swap-on"
          ><polyline points="20 6 9 17 4 12" /></svg
        ></label
      >
    </div>
  </div>
</div>
