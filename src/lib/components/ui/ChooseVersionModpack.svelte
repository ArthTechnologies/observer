<script lang="ts">
  import ModpackVersion from "./ModpackVersion.svelte";
  import { getVersions } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { Plus } from "lucide-svelte";

  export let id: string;
  export let modpackName: string;
  var software = "";
  var sVersion = "";

  function get() {
    if (browser) {
      software = document.getElementById("softwareDropdown").value;
      sVersion = document.getElementById("versionDropdown").value;

      switch (sVersion) {
        case "Latest":
          sVersion = "1.19.4";
          break;
      }

      software = software.toLowerCase();
    }
    console.log("version + software: " + sVersion + software);
    let vname = "undefined";
    getVersions(id).then((data) => {
      console.log("version + software: " + sVersion + software);
      document.getElementById("list").innerHTML = "";
      data.forEach((version) => {
        if (
          version.name != vname &&
          version.loaders.includes(software) &&
          version.game_versions.includes(sVersion)
        ) {
          vname = version.name;
          console.log(version.name + vname);
          new ModpackVersion({
            target: document.getElementById("list"),
            props: {
              name: version.name,
              date: version.date_published,
              type: version.version_type,
              url: version.files[0].url,
              modpackId: id,
              versionId: version.id,
            },
          });
        }
      });

      if (document.getElementById("list").innerHTML == "") {
        document.getElementById("list").innerHTML =
          "<p class='text-center'>This modpack doesn't support your selected Minecraft version currently.</p>";
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
