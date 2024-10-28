<script lang="ts">
  import { browser } from "$app/environment";
  import File from "$lib/components/ui/files/File.svelte";
  import Folder from "$lib/components/ui/files/Folder.svelte";
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
  let open = false;
  let folderId;
  let id;
  let accountType;

  if (browser) {
    console.error(path);
    id = localStorage.getItem("serverID");
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
      },
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
  let gradientBackground = "#1fb2a5";
  function uploadFile() {
    const formData = new FormData();
    const fileInput = document.getElementById("upload" + foldername + "file");
    const file = fileInput.files[0];

    formData.append("file", file, file.name);

    console.error("uploading");
    if (browser) {
      const uploadBtn = document.getElementById("uploadBtn");
      //we normally use fetch, but we have to use XMLHttpRequest for this because fetch doesnt give progress of uploads.
      const xhr = new XMLHttpRequest();
      let fileSize = 200;
      let counter = 0;
      let requestFinished = false;

      //display estimated progress
      let intervalId = setInterval(() => {
        counter++;
        let visualPercent = (((counter / 20) * 1.09) / fileSize) * 100;
        let virusScanningEnabled = localStorage.getItem("enableVirusScan");
        let theme = localStorage.getItem("theme");

        if (!requestFinished) {
          //disable clicks to the button
          uploadBtn.classList.add("pointer-events-none");
        }

        if (visualPercent < 100) {
          if (theme == "dark") uploadBtn.classList.add("text-accent-content");
          else if (theme == "light") uploadBtn.classList.add("text-white");

          uploadBtn.innerHTML = $t("uploading");
          //if its dark theme, gradient needs to be 90% transparency
          //to 0% transparency, where light should be from 90% to 70%.

          if (theme == "dark") {
            gradientBackground = "#1fb2a5";
            uploadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${visualPercent}%,
  ${gradientBackground} ${visualPercent}%,
  ${gradientBackground} 100%
)`;
          } else if (theme == "light") {
            gradientBackground = "#88c0d0";
            uploadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.7) ${visualPercent}%,
  ${gradientBackground} ${visualPercent}%,
  ${gradientBackground} 100%
)`;
          }
        } else {
          uploadBtn.classList.remove("text-accent-content");
          uploadBtn.classList.remove("text-white");
          if (virusScanningEnabled == "true") {
            uploadBtn.innerHTML = $t("scanningForViruses");
            uploadBtn.classList.add("text-lime-500");
            uploadBtn.style.background = ``;
            if (theme == "dark") uploadBtn.classList.add("bg-[#112100]");
            if (theme == "light") uploadBtn.classList.add("bg-[#143f04]");
            uploadBtn.classList.add("skeleton");
            visualPercent++;
            if (requestFinished && visualPercent > 108) {
              if (theme == "dark") uploadBtn.classList.remove("bg-[#112100]");
              if (theme == "light") uploadBtn.classList.remove("bg-[#143f04]");
              uploadBtn.classList.remove("skeleton");

              uploadBtn.classList.remove("text-lime-500");

              uploadBtn.innerHTML = $t("button.upload");

              //re-enable clicks to the button
              uploadBtn.classList.remove("pointer-events-none");
              clearInterval(intervalId);
            }
          } else if (requestFinished) {
            uploadBtn.style.background = ``;

            uploadBtn.innerHTML = $t("button.upload");

            //re-enable clicks to the button
            uploadBtn.classList.remove("pointer-events-none");

            clearInterval(intervalId);
          }
        }
      }, 50);
      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          fileSize = event.total / Math.pow(1024, 2);
          console.log("PROGRESS", fileSize);
        }
      });

      xhr.addEventListener("load", (e) => {
        console.log(e.target.response);

        if (e.target.response.indexOf("No Viruses Detected") == -1) {
          alert($t("alert.virusDetected"));
        } else {
          alert($t("alert.worldUploaded"), "success");
        }
        requestFinished = true;
      });

      xhr.addEventListener("error", (error) => {
        console.error("Error:", error);
      });

      xhr.open(
        "POST",
        apiurl +
          "server/" +
          id +
          "/file/upload/" +
          foldername +
          "?filename=" +
          file.name,
        true,
      );
      xhr.setRequestHeader("token", localStorage.getItem("token"));
      xhr.setRequestHeader("username", localStorage.getItem("accountEmail"));
      xhr.send(formData);

      //when response is recieved...
      xhr.onload = function () {
        //if its dark theme, gradient needs to be 90% transparency
        //to 0% transparency, where light should be from 90% to 70%.
        let theme = localStorage.getItem("theme");
        if (theme == "dark") {
          uploadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) 100%,
  ${gradientBackground} 100%,
  ${gradientBackground} 100%
)`;
        } else if (theme == "light") {
          uploadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.7) 100}%,
  ${gradientBackground} 100%,
  ${gradientBackground} 100%
)`;
        }
      };
    }
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

    <div class="flex gap-1 mt-2">
      <input
        id="upload{foldername}file"
        type="file"
        class="file-input file-input-bordered file-input-secondary w-full max-w-xs"
      />
      <button id="uploadBtn" on:click={uploadFile} class="btn btn-error">
        {$t("button.upload")}</button
      >
    </div>
  </div>
</div>
