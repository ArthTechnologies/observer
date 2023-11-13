<script>
  import { browser } from "$app/environment";
  import { History } from "lucide-svelte";
  import TextVersionEditor from "../ui/files/TextVersionEditor.svelte";
  import { apiurl, usingOcelot } from "$lib/scripts/req";
  import { onMount } from "svelte";
  let filepath;
  let id;
  let versionsList = [];
  if (browser) {
    id = localStorage.getItem("serverID");

    if (localStorage.getItem("versionsList") == null) {
      localStorage.setItem("versionsList", "");
    }
    versionsList = localStorage.getItem("fileVersions").split(",");

    document.addEventListener("updateVersionsList", function (e) {
      versionsList = localStorage.getItem("fileVersions").split(",");
    });
  }

  onMount(() => {
    if (browser) {
      filepath = document.getElementById("filepath").value;
    }
  });

  function updateEditor(version) {
    filepath = document.getElementById("filepath").value;
    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    fetch(
      baseurl +
        "server/" +
        id +
        "/file/.fileVersions*" +
        filepath +
        "*" +
        version,
      {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("accountEmail"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        //start with <p> for each line of textEditor's text, and add a <b> for each removed line, <i> for each added line in data.content

        let string = "";
        let textEditor = document.getElementById("textEditor");
        let textEditor2 = document.getElementById("textEditor2");
        let textEditorLines = textEditor.value.split("\n");
        let dataLines = data.content.split("\n");
        let i = 0;
        let j = 0;
        for (let i in textEditorLines) {
          if (textEditorLines[i] == dataLines[j]) {
            string += "<p>" + textEditorLines[i] + "</p>";
            j++;
          } else {
            string += "<p><b>" + textEditorLines[i] + "</b></p>";
          }
        }
        for (let i in dataLines) {
          if (textEditorLines[i] != dataLines[j]) {
            string += "<p><i>" + dataLines[j] + "</i></p>";
            j++;
          }
        }

        textEditor2.innerHTML = string;
      });
  }
</script>

<label for="historyModal" class="btn btn-neutral btn-sm">
  <History />
  <p class="ml-1.5">History</p>
</label>

<input type="checkbox" id="historyModal" class="modal-toggle" />
<div class="modal">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="historyModal"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >

    <h3 class="text-xl font-bold mb-2">File History</h3>
    <div class="flex justify-between">
      <div class="flex flex-col items-start">
        {#each versionsList as version}
          <button
            class="btn btn-sm btn-ghost"
            on:click={() => {
              updateEditor(version);
            }}>{new Date(parseInt(version)).toLocaleString()}</button
          >
        {/each}
      </div>
      <TextVersionEditor />
    </div>
  </div>
</div>
