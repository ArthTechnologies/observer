<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  export let url: string;
  export let filename: string;
  import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
    import { downloadProgressShort } from "$lib/scripts/utils";
  import {
    File,
    FileText,
    Image,
    Trash2,
    FileUp,
    AlertTriangle,
    FileDown,
    Download,
    Loader,
    FileLock2,
    PackageOpen,
    Package,
    FileBox,
    Box,
  } from "lucide-svelte";
  import { Warning } from "postcss";
  let id;
  let extension = filename.split(".")[filename.split(".").length - 1];
  let clickable = "auto";
  let accountType = "email";

  if (browser) {
    id = localStorage.getItem("serverID");
    if (localStorage.getItem("accountEmail").includes("@")) {
      accountType = "email";
    } else {
      accountType = localStorage.getItem("accountEmail").split(":")[0];
    }
    if (url != undefined) {
      if (url.includes("//")) {
        url = url.split("//")[1];
        if (url.includes("/")) {
          url = url.split("/").join("*");
        }
      }
    }
  }
  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "zip":
    case "jar":
      clickable = "none";
      break;
    default:
      clickable = "auto";
      break;
  }
  if (filename == "server.json") {
    clickable = "none";
  }
  function getText() {

    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);
    fetch(baseurl + "server/" + id + "/file/" + url, {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let content = data.content.replace(/\\n/g, "\n").replace(/\\"/g, '"');
        //broadcast openTextEditor event
        const event = new CustomEvent("openTextEditor", {
          detail: {
            content: content,
            filename: filename,
            path: url.split("*").join("/"),
          },
        });
        document.dispatchEvent(event);
      });
  }

  function deleteFile() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);

    fetch(baseurl + "server/" + id + "/file/" + url, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.msg == "Done") {
          document.getElementById("delete" + filename).checked = false;
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
        }
      });
  }

  function extractFile() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);

    fetch(`${baseurl}server/${id}/extractfile/${url.split("*").join("/")}`, {
      method: "POST",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.msg === "Done") {
          // Close the modal by unchecking the checkbox
          (document.getElementById(`extract${filename}`) as HTMLInputElement).checked = false;
          // Optionally, refresh or dispatch an event
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
        }
      })
      .catch((err) => console.error("Error extracting file:", err));
  }
  let downloading = false;
  let downloadProgress = "0/0MB";
  let gradientBackground = "#1fb2a5";
  
  function download() {
    downloading = true;
    const xhr = new XMLHttpRequest();
    console.log(url.includes("//"));
    if (url.includes("//")) {
      url = url.split("//")[1];
    }
    console.log(url)
    xhr.open("GET", apiurl + "server/" + id + "/file/download/" + url, true);
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
        a.download = filename;
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
</script>

<div class="flex gap-1 justify-between">
  <button
    
    on:click={getText}
    class="w-[65%] px-1.5 p-1 rounded-lg btn-ghost pointer-events-{clickable} gap-1 flex items-center"
  >
  {#if filename == "server.json" || filename == "server.jar"}		 
    <FileLock2 class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else if extension == "jar"}
    <Box class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else if extension == "png" || extension == "jpg" || extension == "jpeg"}
      <Image class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else if extension == "zip"}
      <Package class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else if extension == "yml" || extension == "yaml" || extension == "json" || extension == "txt"}
      <FileText class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else}
      <File class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {/if}
    <p class="text-xs md:text-sm truncate w-[8rem] md:w-[14rem] flex justify-left">{filename}</p>
</button>
  <div class="flex gap-1">
{#if filename.includes(".zip")}
<label
for="extract{filename}"

class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
>
<PackageOpen class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
</label>
{/if}
    <label
      for="delete{filename}"
      
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
    >
      <Trash2 class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
    <label
      for="upload"
     
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center btn-disabled opacity-50"
    >
      <FileUp class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
    <label
      for="download{filename}"
     
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
      >
    <Download class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
  </div>
</div>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete{filename}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="delete{filename}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <AlertTriangle class="w-6 h-6" />
      <span class="text-sm"
        >Make sure that you are deleting the right file, you won't be able to
        recover <b>{filename}</b>.</span
      >
    </div>
    <div class="flex gap-1">
      <button on:click={deleteFile} id="delButton" class="btn btn-error">
        {$t("button.delete")}</button
      >
    </div>
  </div>
</div>

{#if filename.includes(".zip")}
<!-- Extract Modal -->
<input type="checkbox" id="extract{filename}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="extract{filename}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <h3 class="text-lg font-bold mb-5">Extract {filename}</h3>
    <p class="mb-5">The contents of this will be extracted to <code class="bg-base-300 px-1 rounded">/{url.split("*").join("/").split(".zip")[0]}</code>.</p>
    <div class="flex gap-1">
      <button on:click={extractFile} class="btn btn-success">
        Extract
      </button>
    </div>
  </div>
</div>
{/if} 
<!-- Put this part before </body> tag -->
<input type="checkbox" id="upload" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="upload"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86 h-16 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <span class="text-sm">{$t("server.delete.desc")}</span>
    </div>
    <div class="flex gap-1">
      {#if accountType == "email"}
        <input
          type="password"
          id="password"
          class="input input-bordered input-error mr-1"
          placeholder={$t("typeYourPassword")}
        />
      {/if}
      <button id="delButton" class="btn btn-error">
        {$t("button.delete")}</button
      >
    </div>
  </div>
</div>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="download{filename}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="download{filename}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold mb-5">Download {filename}</h3>

    <div class="flex gap-1">
      <button
      id="downloadBtn"
      class="btn btn-accent btn-sm"
      on:click={download}
      >{#if !downloading}<Download size="18" />{:else}<div
          class="animate-spin"
        >
          <Loader />
        </div>{/if}
      <p class="ml-1.5">
        {#if downloading}{downloadProgress}{:else}{$t(
            "button.download"
          )}{/if}
      </p></button
    >
    </div>
  </div>
  </div>