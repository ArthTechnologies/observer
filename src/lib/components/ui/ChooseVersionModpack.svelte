<script lang="ts">
  import ModpackVersion from "./ModpackVersion.svelte";
  import { getVersions } from "$lib/scripts/req";
  import { browser } from "$app/environment";

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
          "<p class='text-center'>There are no versions for this modpack.</p>";
      }
    });
  }
</script>

<label for="versions" on:click={get} class="btn btn-circle btn-ghost"
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
