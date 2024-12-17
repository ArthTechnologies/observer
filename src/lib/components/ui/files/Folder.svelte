<script lang="ts">
  import { browser } from "$app/environment";
  import File from "$lib/components/ui/files/File.svelte";
  import Folder from "$lib/components/ui/files/Folder.svelte";
  import FileUpload from "$lib/components/util/FileUpload.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl, getServerNode, usingOcelot } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  import {
    ChevronDown,
    FolderClosed,
    ChevronRight,
    Trash2,
    FileUp,
    AlertTriangle,
  } from "lucide-svelte";
  export let foldername;
  export let files;
  export let path;
  let uploadpath;
  let open = false;
  let folderId;
  let id;
  let accountType;

  if (browser) {

    id = localStorage.getItem("serverID");
     if (path != undefined) {
     uploadpath = path.split("servers/" + id + "//")[1].split("/").join("*");
     }

    if (localStorage.getItem("accountEmail").includes("@")) {
      accountType = "email";
    } else {
      accountType = localStorage.getItem("accountEmail").split(":")[0];
    }
  }
  //folder ID is a random number.
  folderId = Math.floor(Math.random() * 1000000000);
  function toggleOpen() {
    open = !open;
    if (open) {
      document.getElementById("toggleIndicator" + folderId).innerHTML = "";
      new ChevronRight({
        target: document.getElementById("toggleIndicator" + folderId),
      });
    } else {
      document.getElementById("toggleIndicator" + folderId).innerHTML = "";
      new ChevronDown({
        target: document.getElementById("toggleIndicator" + folderId),
      });
    }
  }

  function deleteFile() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);

    fetch(
      baseurl +
        "server/" +
        id +
        "/folder/" +
        path
          .split("servers/" + id + "//")[1]
          .split("/")
          .join("*"),
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
        body: JSON.stringify({
          password: document.getElementById("password" + foldername).value,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.msg == "Done") {
          document.getElementById("delete" + foldername).checked = false;
          location.reload();
        } else {
          alert("Error: " + data.msg);
        }
      });
  }
</script>

<div class="flex gap-1 justify-between">
  <a
    class="w-[78%] px-1.5 p-1 rounded-lg btn-ghost gap-1 flex items-center cursor-pointer"
    on:click={toggleOpen}
  >
    <FolderClosed
      class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]"
    />
    <p class="text-xs md:text-sm w-full">{foldername}</p>

    {#if files.length >= 1}
      <p id="toggleIndicator{folderId}"><ChevronDown /></p>
    {/if}
  </a>
  <div class="flex gap-1">
    <label
      for="delete{foldername}"
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
    >
      <Trash2 class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
    <label
      for="upload{foldername}"
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
    >
      <FileUp class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
  </div>
</div>
{#if open}
  <div class="ml-3 md:ml-5">
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
{/if}

<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete{foldername}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="delete{foldername}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <AlertTriangle class="w-6 h-6" />
      <span class="text-sm"
        >Make sure that you are deleting the right file, you won't be able to
        recover <b>{foldername}</b>.</span
      >
    </div>
    <div class="flex gap-1">
      {#if accountType == "email"}
        <input
          type="password"
          id="password{foldername}"
          class="input input-bordered input-error mr-1"
          placeholder={$t("typeYourPassword")}
        />
      {/if}
      <button on:click={deleteFile} id="delButton" class="btn btn-error">
        {$t("button.delete")}</button
      >
    </div>
  </div>
</div>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="upload{foldername}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="upload{foldername}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">Upload File to /{foldername}</h3>

    <FileUpload {foldername} {uploadpath} {id} />
  </div>
</div>
