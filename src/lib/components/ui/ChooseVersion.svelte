<script lang="ts">
  import Version from "./Version.svelte";
  import { getVersions, lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { Plus } from "lucide-svelte";
  import PluginResult from "./PluginResult.svelte";
  import { marked } from "marked";

  export let id: string;
  export let pluginName: string;
  export let author: string;
  export let desc: string;
  export let icon: string;

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
    fetch(lrurl + "project/" + id, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())

      .then((data) => {
        document.getElementById("body").innerHTML = marked(data.body);
      });

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
    <div class="pt-6">
      <PluginResult
        name={pluginName}
        {author}
        {desc}
        {icon}
        {id}
        recursive={true}
      />
      <div class="flex justify-between space-x-2 lg:space-x-5 mt-5">
        <div class="">
          <h3 class="font-bold text-2xl mb-4">Description</h3>
          <article id="body" class="mb-5 prose bg-base-200 rounded-lg p-3" />
        </div>

        <div class="">
          <h3 class="font-bold text-2xl mb-4">Versions</h3>
          <div id="list" class="space-y-2" />
        </div>
      </div>
    </div>

    <div class="modal-action">
      <label
        for="versions"
        class="btn btn-sm btn-circle absolute right-2 top-2 mb-5">✕</label
      >
    </div>
  </div>
</div>
