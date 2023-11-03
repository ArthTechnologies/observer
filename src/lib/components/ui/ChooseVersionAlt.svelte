<script lang="ts">
  import Version from "./Version.svelte";
  import { getVersions } from "$lib/scripts/req";
  import { browser } from "$app/environment";

  export let id: string;
  export let pluginName: string;
  var software = "";
  var sVersion = "";
  if (browser) {
    software = localStorage.getItem("serverSoftware");
    sVersion = localStorage.getItem("serverVersion");
    switch (software) {
      case "Paper":
        software = "paper";
        break;
    }
    switch (sVersion) {
      case "latest":
        sVersion = "1.19.4";
        break;
    }
  }
  function get() {
    let vname = "undefined";
    getVersions(id).then((data) => {
      document.getElementById("listAlt").innerHTML = "";
      data.forEach((version) => {
        if (
          version.name != vname &&
          version.loaders.includes(software) &&
          version.game_versions.includes(sVersion)
        ) {
          vname = version.name;

          new Version({
            target: document.getElementById("listAlt"),
            props: {
              name: version.name,
              date: version.date_published,
              type: version.version_type,
              url: version.files[0].url,
              pluginId: id,
              pluginName: pluginName,
            },
          });
        }
      });
      //if it's still blank, add a message saying that there are no versions for this plugin
      if (document.getElementById("list").innerHTML == "") {
        document.getElementById("list").innerHTML =
          "<p class='text-center'>This plugin doesn't support your Minecraft version currently.</p>";
      }
    });
  }
</script>

<label for="versionsAlt" on:click={get} class="btn btn-xs btn-info mt-0.5"
  >Update</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versionsAlt" class="modal-toggle" />
<div class="modal flex flex-col justify-center">
  <div class="modal-box w-[97%] h-[97%] max-w-5xl space-y-5">
    <div class="flex justify-between">
      <h3 class="font-bold text-lg">Versions</h3>
      <div class="modal-action">
        <label
          for="versionsAlt"
          class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
        >
      </div>
    </div>

    <div id="listAlt" class="space-y-2" />
  </div>
</div>
