<script>
  import { browser } from "$app/environment";
  import File from "$lib/components/ui/files/File.svelte";
  import Folder from "$lib/components/ui/files/Folder.svelte";
  import TextEditor from "$lib/components/ui/files/TextEditor.svelte";
  import { apiurl, usingOcelot } from "$lib/scripts/req";
  import { ArrowLeft } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import HistoryButton from "$lib/components/buttons/HistoryButton.svelte";

  let files = ["server.properties", ["folder1", ["file1.txt", "file2.txt"]]];
  let id;
  let backurl = "server";

  if (browser) {
    if (window.location.href.includes("proxy")) {
      backurl = "proxy";
    }
    if (localStorage.getItem("serverSoftware") == "Velocity") {
      backurl = "proxy";
    }
    id = localStorage.getItem("serverID");
    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    const url = baseurl + "server/" + id + "/files";
    fetch(url, {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        files = data;
        console.log(data);
      });
  }

  function save() {
    document.dispatchEvent(new Event("updatedTextEditor"));
    fetch(
      apiurl +
        "server/" +
        id +
        "/file/" +
        document.getElementById("filepath").value,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          email: localStorage.getItem("accountEmail"),
        },
        body: JSON.stringify({
          content: document.getElementById("textEditor").value,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);

        document.getElementById("filename").innerHTML = document
          .getElementById("filename")
          .innerHTML.replace("*", "");

        document.getElementById("saveButton").classList.add("btn-disabled");
      });
  }

  function getFilepath() {
    return document.getElementById("filepath").value;
  }
</script>

<a href="/{backurl}/{parseInt(id) + 10000}" class="btn btn-info mb-5"
  ><ArrowLeft class="mr-1.5" />
  Back</a
>
<div
  class=" h-[75vh] md:flex justify-between items-start max-md:space-y-1 md:space-x-5"
>
  <div
    class="bg-base-200 rounded-xl md:p-2 menu menu-xs md:w-[20rem]"
    id="filetree"
  >
    {#each files as file}
      {#if typeof file == "string"}
        <File filename={file.split(":")[0]} url={file.split(":")[1]} />
      {:else}
        <Folder foldername={file[0].split(":")[0]} files={file[1]} />
      {/if}
    {/each}
  </div>
  <div
    class="bg-base-200 rounded-xl p-3 h-[30rem] md:w-[25rem] lg:w-[30rem] lg:h-[35rem] xl:w-[50rem] xl:h-[45rem]"
  >
    <div class="flex justify-between">
      <div class="flex space-x-2 mb-2">
        <div id="filepath" class="hidden" />
        <h1 class="text-xl font-bold" id="filename">File</h1>
        <button class="btn btn-sm btn-disabled" id="saveButton" on:click={save}
          >{$t("save")}</button
        >
      </div>
      <!--<HistoryButton />-->
    </div>
    <TextEditor />
  </div>
  <div />
</div>
