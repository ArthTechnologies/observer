<script lang="ts">
  import Version from "./Version.svelte";
  import { getVersions } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { Plus } from "lucide-svelte";

  export let id: string;
  export let pluginName: string;
  var software = "";
  var sVersion = "";
  if (browser) {
    software = localStorage.getItem("serverSoftware");
    sVersion = localStorage.getItem("serverVersion");
    switch (software) {
      case "Velocity":
        sVersion = localStorage.getItem("latestVersion");
      default:
        software = software.toLowerCase();
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
      document.getElementById("list").innerHTML = "";
      data.forEach((version) => {
        if (
          version.name != vname &&
          version.loaders.includes(software) &&
          version.game_versions.includes(sVersion)
        ) {
          vname = version.name;
          console.log(version.name + vname);
          new Version({
            target: document.getElementById("list"),
            props: {
              name: version.name,
              date: version.date_published,
              type: version.version_type,
              url: version.files[0].url,
              pluginId: id,
              pluginName: pluginName,
              modtype: "plugin",
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

<label
  for="versions"
  on:click={get}
  class="btn btn-circle btn-ghost absolute right-0"><Plus /></label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versions" class="modal-toggle" />
<div class="modal">
  <div class="modal-box w-11/12 max-w-5xl space-y-5">
    <div class="flex justify-between">
      <h3 class="font-bold text-lg">Versions</h3>
      <div class="modal-action">
        <label
          for="versions"
          class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
        >
      </div>
    </div>

    <div id="list" class="space-y-2" />
  </div>
</div>
