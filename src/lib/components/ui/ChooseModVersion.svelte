<script lang="ts">
  import Version from "./Version.svelte";
  import { getVersions } from "$lib/scripts/req";
  import { browser } from "$app/environment";

  export let id: string;
  export let pluginName: string;
  var software = "";
  var sVersion = "";
  if (browser) {
    software = localStorage.getItem("serverSoftware").toLowerCase();
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
      document.getElementById("list").innerHTML = "";
      console.log(data);
      data.forEach((version) => {
        console.log(software + " + " + version.loaders.indexOf(software));
        if (
          version.name != vname &&
          version.loaders.indexOf(software) > -1 &&
          version.game_versions.indexOf(sVersion) > -1
        ) {
          vname = version.name;
          console.log(version);
          new Version({
            target: document.getElementById("list"),
            props: {
              name: version.name,
              date: version.date_published,
              type: version.version_type,
              url: version.files[0].url,
              pluginId: id,
              pluginName: pluginName,
              modtype: "mod",
              dependencies: version.dependencies,
            },
          });
        }
      });
      //if it's still blank, add a message saying that there are no versions for this plugin
      if (document.getElementById("list").innerHTML == "") {
        document.getElementById("list").innerHTML =
          "<p class='text-center'>This mod doesn't support your Minecraft version currently.</p>";
      }
    });
  }
</script>

<label
  for="versions"
  on:click={get}
  class="btn btn-circle btn-ghost mb-5 sm:mb-0 -ml-14 sm:ml-0"
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
    class="feather feather-plus"
    ><line x1="12" y1="5" x2="12" y2="19" /><line
      x1="5"
      y1="12"
      x2="19"
      y2="12"
    /></svg
  ></label
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
