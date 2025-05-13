<script lang="ts">
  import { browser } from "$app/environment";
  import File from "$lib/components/ui/files/File.svelte";
  import Folder from "$lib/components/ui/files/Folder.svelte";
  import FileUpload from "$lib/components/util/FileUpload.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl, getServerNode, usingOcelot } from "$lib/scripts/req";
  import { alert, downloadProgressShort, fileSizeShort } from "$lib/scripts/utils";
  import {
    ChevronDown,
    FolderClosed,
    ChevronRight,
    Trash2,
    Upload,
    AlertTriangle,
    Download,
    Loader,
    MenuIcon,
  } from "lucide-svelte";
  export let foldername;
  export let files;
  export let path;
  export let size: number;
  let uniqueId = Math.floor(Math.random() * 1000000000);
  let uploadpath;
  let open = false;
  let folderId;
  let id;
  let accountType;

  if (browser) {
    id = localStorage.getItem("serverID");
    if (path != undefined) {
      if (path.includes("servers/" + id + "//"))
        uploadpath = path
          .split("servers/" + id + "//")[1]
          .split("/")
          .join("*");
      if (path.includes("servers/" + id + "/"))
        uploadpath = path
          .split("servers/" + id + "/")[1]
          .split("/")
          .join("*");
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
    //remove any double slashes
    path = path.replace(/\/\//g, "/");
    console.log(path)
    fetch(
      baseurl +
        "server/" +
        id +
        "/files/delete/" +
        path
          .split("servers/" + id)[1]
          .split("/")
          .join("*")+"?folder=true",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        }
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.msg == "Done") {
          document.getElementById("delete" + foldername).checked = false;
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
        } else {
          alert("Error: " + data.msg);
        }
      });
  }

  let downloading = false;
  let downloadProgress = "0/0MB";
  let gradientBackground = "#1fb2a5";

  function download() {
    downloading = true;
    const xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      apiurl + "server/" + id + "/files/download/" + uploadpath,
      true
    );
    xhr.setRequestHeader("token", localStorage.getItem("token"));
    xhr.setRequestHeader("username", localStorage.getItem("accountEmail"));
    xhr.responseType = "blob";
    let lhref = window.location.href;
    const downloadBtn = document.getElementById("downloadBtn");
    xhr.addEventListener("progress", (event) => {
      if (event.lengthComputable && browser) {
        const percentComplete = (event.loaded / event.total) * 100;

        // You can update a progress bar or display the percentage to the user
        if (percentComplete < 100 && window.location.href == lhref) {
          downloadProgress = downloadProgressShort(event.loaded, event.total);

          downloadBtn.style.width = "200px";

          downloadBtn.classList.add("text-accent-content");
          downloadBtn.classList.remove("text-gray-200");

          downloadBtn.classList.add("pointer-events-none");

          gradientBackground = "#1fb2a5";
          downloadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${(event.loaded / event.total) * 100}%,
  ${gradientBackground} ${(event.loaded / event.total) * 100}%,
  ${gradientBackground} 100%
)`;
        } else if (percentComplete >= 100) {
          downloadProgress = "0/0MB";

          downloadBtn.style.width = ``;
          downloadBtn.style.background = ``;
          downloadBtn.classList.remove("pointer-events-none");

          downloadBtn.classList.remove("text-accent-content");
        }
      }
    });

    xhr.onload = function () {
      downloading = false;
      if (xhr.status === 200) {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = foldername;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Clean up the temporary <a> element
        window.URL.revokeObjectURL(url); // Clean up the object URL
      } else {
        console.error("Error downloading file. Status:", xhr.status);
        // Handle the error case
      }
    };

    xhr.send();
  }

    if (browser) {
    //if the user clicks outside the dropdown, close it
    document.addEventListener("click", (event) => {
      const dropdown = document.getElementById("dropdown" + uniqueId);
      const target = event.target as HTMLElement;
      if (dropdown && !dropdown.contains(target)) {
        dropdown.removeAttribute("open");
      }
    });
  }

    function checkRenameText() {
    const renameInput = document.getElementById("renameInput"+uniqueId) as HTMLInputElement;
    const renameBtn = document.getElementById("renameBtn"+uniqueId) as HTMLButtonElement;
    if (renameInput.value.length > 0 && renameInput.value != foldername) {
      renameBtn.classList.remove("btn-disabled");
    } else {
      renameBtn.classList.add("btn-disabled");
    }
  }

    function rename() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);
    const renameInput = document.getElementById("renameInput"+uniqueId) as HTMLInputElement;
    const newName = renameInput.value;
        path = path.replace(/\/\//g, "/");
    fetch(
      baseurl +
        "server/" +
        id +
        "/files/rename/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
        body: JSON.stringify({
          from: uploadpath,
          to: newName,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.msg == "Rename successful.") {
          document.getElementById("rename" + foldername).checked = false;
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
        }
      }); 
  }
</script>

<div class="flex gap-1 justify-between">
  <a
    class="w-[75%] px-1.5 p-1 rounded-lg btn-ghost gap-1 flex items-center cursor-pointer"
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
  <div class="flex gap-1 items-center">
    <div
  
    class="px-1.5 h-5 rounded-lg  text-xs outline outline-1 gap-1 flex items-center mr-0.5"
  >
    {fileSizeShort(size)}
    </div>
    <details id="dropdown{uniqueId}" class="dropdown dropdown-end">

  <summary class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center">     <MenuIcon class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" /></summary>
  <ul class="z-50 menu dropdown-content bg-neutral bg-opacity-75 backdrop-blur rounded-box z-1 w-32 p-1.5 shadow-sm">
    <li>    <label
      for="delete{foldername}"
      
    >
      Delete
    </label></li>
    <li>
      <label
        for="rename{foldername}"
       
      >
        Rename
      </label>
    </li>
        {#if foldername.includes(".zip")}
    <li>  
      <label
        for="extract{foldername}"
       
      >
        Extract
      </label>
    </li>
    {/if}
  </ul>
</details>
    <label
      for="upload{foldername}"
      data-tip="Upload File"
      class="tooltip px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
    >
      <Upload class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
    <label
      for="download{foldername}"
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
    >
      <Download class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
  </div>
</div>
{#if open}
  <div class="ml-3 md:ml-5">
    {#each files as file}
      {#if typeof file == "string"}
        <File filename={file.split(":")[0]} url={file.split(":")[1]} size={file.split(":")[2]}
         />
      {:else}
        <Folder
          foldername={file[0].split(":")[0]}
          files={file[1]}
          path={file[0].split(":")[1]}
          size={file[0].split(":")[2]}
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

      <button on:click={deleteFile} id="delButton" class="btn btn-error">
        {$t("button.delete")}</button
      >
    </div>
  </div>
</div>

<input
  type="checkbox"
  id="rename{foldername}"
  class="modal-toggle"
/>
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="rename{foldername}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold mb-2">Rename Folder</h3>
<div class="flex gap-2 w-2/3 items-center mb-5">
  <div class="bg-neutral rounded-lg text-sm h-8 py-2 px-4">
    {foldername}
  </div>
  <ChevronRight size=32 />
      <input
      on:input={checkRenameText}
      type="text"
      id="renameInput{uniqueId}"
      placeholder="newname"
      class="input input-bordered input-sm w-full"
    />
</div>
    <div class="flex gap-1">
      <button on:click={rename} id="renameBtn{uniqueId}" class="btn btn-success btn-disabled">
        Rename</button
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

<!-- Put this part before </body> tag -->
<input type="checkbox" id="download{foldername}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="download{foldername}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold mb-5">Download /{foldername}</h3>

    <div class="flex gap-1">
      <button id="downloadBtn" class="btn btn-accent btn-sm" on:click={download}
        >{#if !downloading}<Download size="18" />{:else}<div
            class="animate-spin"
          >
            <Loader />
          </div>{/if}
        <p class="ml-1.5">
          {#if downloading}{downloadProgress}{:else}{$t("button.download")}{/if}
        </p></button
      >
    </div>
  </div>
</div>
