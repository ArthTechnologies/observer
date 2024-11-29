<script>
    import { browser } from "$app/environment";
    import File from "$lib/components/ui/files/File.svelte";
    import Folder from "$lib/components/ui/files/Folder.svelte";
    import TextEditor from "$lib/components/ui/files/TextEditor.svelte";
    import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
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
      if (usingOcelot) baseurl = getServerNode(id);
      const url = baseurl + "server/" + id + "/files";
      fetch(url, {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
      })
        .then((response) => response.json())
        .then((data) => {
          files = data;
          console.log(data);
        });
  
      document.addEventListener("keydown", function (event) {
        // Check if the event key is 's' and the Ctrl/Cmd key is pressed
        if (
          (event.key === "s" || event.key === "S") &&
          (event.ctrlKey || event.metaKey)
        ) {
          // Prevent the default browser behavior (saving the page)
          event.preventDefault();
  
          save();
        }
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
            username: localStorage.getItem("accountEmail"),
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
  

  <div
    class="flex flex-col items-start gap-5 w-full"
  >
    <div class="bg-base-300 rounded-xl md:p-2 w-full" id="filetree">
      {#each files as file}
        {#if typeof file == "string"}
          <File filename={file.split(":")[0]} url={file.split(":")[1]} />
        {:else}
          <Folder
            foldername={file[0].split(":")[0]}
            files={file[1]}
            path={file[0].split(":")[1]}
          />
        {/if}
      {/each}
    </div>
    <div
      class="bg-base-100 rounded-xl p-3 h-[30rem] w-full lg:h-[35rem]  xl:h-[45rem]"
    >
      <div class="flex justify-between">
        <div class="flex space-x-2 mb-2">
          <div id="filepath" class="hidden" />
          <h1 class="text-xl font-bold" id="filename">{$t("file")}</h1>
          <button
            class="btn btn-sm btn-neutral btn-disabled"
            id="saveButton"
            on:click={save}>{$t("save")}</button
          >
        </div>
        <!--<HistoryButton />-->
      </div>
      <TextEditor />
    </div>
    <div />
  </div>
  