<script lang="ts">
  import { deleteServer } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  let buttonWidthPercent = 30;
  let tab = "upload";
  let id = -1;
  let serverName = "";
  let file = null;
  if (browser) {
    id = localStorage.getItem("serverID");
    serverName = localStorage.getItem("serverName");
  }

  function download() {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiurl + "server/" + id + "/world", true);
    xhr.setRequestHeader("token", localStorage.getItem("token"));
    xhr.setRequestHeader("email", localStorage.getItem("accountEmail"));
    xhr.responseType = "blob";
    let lhref = window.location.href;
    xhr.addEventListener("progress", (event) => {
      if (event.lengthComputable && browser) {
        const percentComplete = (event.loaded / event.total) * 100;

        // You can update a progress bar or display the percentage to the user
        if (percentComplete < 100 && window.location.href == lhref) {
          const downloadBtn = document.querySelector(".downloadBtn");

          downloadBtn.style.width = "200px";
          downloadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${percentComplete}%,
  #088587 ${percentComplete}%,
  #088587 100%
)`;
        }
      }
    });

    xhr.onload = function () {
      if (xhr.status === 200) {
        const blob = xhr.response;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "server-" + id + "-world.zip";
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

  function regenTab() {
    if (browser) {
      //add tab-active to id regenTab, remove from uploadTab
      document.getElementById("regenTab").classList.add("tab-active");
      document.getElementById("uploadTab").classList.remove("tab-active");
    }
    tab = "regen";
  }
  function uploadTab() {
    if (browser) {
      //add tab-active to id regenTab, remove from uploadTab
      document.getElementById("regenTab").classList.remove("tab-active");
      document.getElementById("uploadTab").classList.add("tab-active");
    }
    tab = "upload";
  }

  function upload() {
    console.log("uploading");
    const formData = new FormData();
    formData.append("file", file, file.name);
    if (browser) {
      //POST to https://api.arthmc.xyz/server/{id}/world  with token and email, send file in body
      fetch(apiurl + "server/" + id + "/world", {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("accountEmail"),
        },
        body: formData,
      });
    }
  }
  function handleFileSelect(event) {
    file = event.target.files[0]; // Store the selected file
  }

  function regen() {
    if (browser) {
      let seed = document.getElementById("seed").value;
      //POST to https://api.arthmc.xyz/server/{id}/world  with token and email, send file in body
      fetch(apiurl + "server/" + id + "/world" + "?seed=" + seed, {
        method: "POST",
        headers: {
          token: localStorage.getItem("token"),
          email: localStorage.getItem("accountEmail"),
        },
      });
    }
  }
</script>

<!-- The button to open modal -->
<label for="world" class="btn btn-accent"
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
    class="feather feather-map"
    ><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" /><line
      x1="8"
      y1="2"
      x2="8"
      y2="18"
    /><line x1="16" y1="6" x2="16" y2="22" /></svg
  > World</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="world" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="world" class="btn btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <div
      class="h-12 w-11/12 md:w-96 bg-base-200 rounded-lg p-1 px-2 flex justify-between items-center"
    >
      <div class="flex flex-col justify-center">
        <p class="font-bold md:text-lg">Current World</p>
      </div>
      <button class="downloadBtn btn btn-accent btn-sm" on:click={download}
        >Download World File</button
      >
    </div>
    <div class="tabs tabs-boxed mt-2 w-[17.1rem]">
      <button id="regenTab" on:click={regenTab} class="tab"
        >Regenerate World</button
      >
      <button id="uploadTab" on:click={uploadTab} class="tab tab-active"
        >Upload World</button
      >
    </div>
    <div class="divider w-[17rem]" />
    <div
      class="bg-warning w-86 h-16 md:h-12 rounded-lg text-black p-2 flex items-center mb-6 space-x-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="stroke-current shrink-0 h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        ><path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        /></svg
      >
      <span class="text-sm"
        >Warning: Your old world will be replaced. Consider downloading your old
        world file first.</span
      >
    </div>
    {#if tab == "regen"}
      <input
        id="seed"
        type="text"
        class="input input-bordered max-w-xs mb-2"
        placeholder="Seed (Leave blank for random)"
      />
      <label for="world" on:click={regen} class="btn">Regen World</label>
    {/if}
    {#if tab == "upload"}
      <div class="flex space-x-2">
        <input
          id="worldFile"
          type="file"
          class="file-input file-input-bordered file-input-secondary max-w-xs"
          on:change={handleFileSelect}
        />
        <label for="world" on:click={upload} class="btn">Upload</label>
      </div>
    {/if}
  </div>
</div>
