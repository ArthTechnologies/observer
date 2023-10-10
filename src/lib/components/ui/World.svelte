<script lang="ts">
  import { deleteServer } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { AlertTriangle, Download, Loader, Map } from "lucide-svelte";
  import Helper from "./Helper.svelte";
  import { downloadProgressShort, fileSizeShort } from "$lib/scripts/numShort";
  let areWorldgenMods = false;
  let tab = "upload";
  let id = -1;
  let serverName = "";
  let serverVersion = "";
  let file = null;
  let worldgenFiles = [];
  let promise;
  let worldgenModsText = "Worldgen Mods:";
  let downloading = false;
  let downloadProgress = "0/0MB";
  if (browser) {
    serverName = localStorage.getItem("serverName");
    serverVersion = localStorage.getItem("serverVersion");
    id = localStorage.getItem("serverID");

    fetch(apiurl + "servers/jars", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let worldgenMods = ["terralith", "incendium", "nullscape", "structory"];
        for (let i in worldgenMods) {
          if (data.includes(worldgenMods[i] + "-" + serverVersion + ".zip")) {
            areWorldgenMods = true;
          }
        }
      });

    promise = fetch(apiurl + "server/" + id + "/file/world*datapacks", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        for (let i in data) {
          if (
            data[i] == "terralith.zip" ||
            data[i] == "incendium.zip" ||
            data[i] == "nullscape.zip" ||
            data[i] == "structory.zip"
          ) {
            document.getElementById(data[i].split(".")[0]).checked = true;
            worldgenFiles.push(data[i].split(".")[0]);
          }
        }

        if (worldgenFiles.length == 0) {
          worldgenModsText = worldgenModsText + " None";
        } else {
          worldgenModsText =
            worldgenModsText + " " + worldgenFiles.join(", ") + ".";
        }
      });
  }

  function download() {
    downloading = true;
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
          downloadProgress = downloadProgressShort(event.loaded, event.total);
          const downloadBtn = document.querySelector(".downloadBtn");

          downloadBtn.style.width = "250px";
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
      downloading = false;
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
    const formData = new FormData();
    formData.append("file", file, file.name);

    console.error("uploading");
    if (browser) {
      const uploadBtn = document.querySelector(".uploadBtn");
      //we normally use fetch, but we have to use XMLHttpRequest for this because fetch doesnt give progress of uploads.
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          let percentComplete = (event.loaded / event.total) * 100;

          percentComplete = percentComplete * 0.7;
          console.log(`Percent complete: ${percentComplete.toFixed(2)}%`);
          // You can update a progress bar or display the percentage to the user
          if (percentComplete < 100) {
            uploadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${percentComplete}%,
  #088587 ${percentComplete}%,
  #088587 100%
)`;
          }
        }
      });

      xhr.addEventListener("load", () => {
        // Upload complete
        console.error("Upload complete");
      });

      xhr.addEventListener("error", (error) => {
        console.error("Error:", error);
      });

      xhr.open("POST", apiurl + "server/" + id + "/world", true);
      xhr.setRequestHeader("token", localStorage.getItem("token"));
      xhr.setRequestHeader("email", localStorage.getItem("accountEmail"));
      xhr.send(formData);

      //when response is recieved...
      xhr.onload = function () {
        uploadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) 100%,
  #088587 100%,
  #088587 100%
)`;
      };
    }
  }

  function handleFileSelect(event) {
    file = event.target.files[0]; // Store the selected file
  }

  function regen() {
    if (browser) {
      let newWorldgenFiles = [];
      if (document.getElementById("terralithWorld") != null) {
        if (document.getElementById("terralithWorld").checked) {
          newWorldgenFiles.push("terralith");
        }
        if (document.getElementById("incendiumWorld").checked) {
          newWorldgenFiles.push("incendium");
        }
        if (document.getElementById("nullscapeWorld").checked) {
          newWorldgenFiles.push("nullscape");
        }
        if (document.getElementById("structoryWorld").checked) {
          newWorldgenFiles.push("structory");
        }
      }
      let seed = document.getElementById("seed").value;
      let worldType = document.getElementById("worldTypeDropdown").value;

      worldType = worldType.toLowerCase().replace(" ", "_");
      if (worldType == "superflat") {
        worldType = "flat";
      }
      //POST to https://api.arthmc.xyz/server/{id}/world  with token and email, send file in body
      fetch(
        apiurl +
          "server/" +
          id +
          "/world" +
          "?seed=" +
          seed +
          "&worldgenMods=" +
          newWorldgenFiles.join(",") +
          "&worldType=" +
          worldType,
        {
          method: "POST",
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("accountEmail"),
          },
        }
      );
    }
  }

  function onclick() {
    serverVersion = localStorage.getItem("serverVersion");
    areWorldgenMods = false;

    fetch(apiurl + "servers/jars", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let worldgenMods = ["terralith", "incendium", "nullscape", "structory"];
        for (let i in worldgenMods) {
          if (data.includes(worldgenMods[i] + "-" + serverVersion + ".zip")) {
            areWorldgenMods = true;
          }
        }
      });
  }
</script>

<!-- The button to open modal -->
<label for="world" class="btn btn-accent" on:click={onclick}
  ><Map class="mr-1.5" />World</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="world" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="world" class="btn btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <div
      class=" w-11/12 md:w-96 bg-base-200 rounded-lg p-1 px-2 py-2 space-y-3"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col justify-center">
          <p class="font-bold md:text-lg">Current World</p>
        </div>
        <button class="downloadBtn btn btn-accent btn-sm" on:click={download}
          >{#if !downloading}<Download size="18" />{:else}<div
              class="animate-spin"
            >
              <Loader />
            </div>{/if}
          <p class="ml-1.5">
            {#if downloading}{downloadProgress}{:else}Download{/if}
          </p></button
        >
      </div>
      <p class="text-sm">{worldgenModsText}</p>
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
      class="bg-warning w-86 h-16 md:h-12 rounded-lg text-black p-2 flex items-center mb-2 space-x-2"
    >
      <AlertTriangle size="32" />
      <span class="text-sm"
        >Warning: Your old world will be replaced. Consider downloading your old
        world file first.</span
      >
    </div>
    {#if tab == "regen"}
      <div class="flex flex-col items-start space-y-5">
        <div>
          {#if areWorldgenMods}
            <div class=" flex mb-1">
              <p class="label">Worldgen Mods</p>

              <Helper tooltipText={$t("newserver.t.worldgen")} />
            </div>

            <div class="flex">
              <img
                class="mask mask-hexagon"
                src="/images/terralith.webp"
                width="70ch"
              />

              <img
                class="mask mask-hexagon"
                src="/images/incendium.webp"
                width="70ch"
              />
              <img
                class="mask mask-hexagon"
                src="/images/nullscape.webp"
                width="70ch"
              />
              <img
                class="mask mask-hexagon"
                src="/images/structory.webp"
                width="70ch"
              />
            </div>
            <div class="p-2" />
            <div class="flex space-x-[2.9rem] ml-[1.4rem]">
              <input
                id="terralithWorld"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
              <input
                id="incendiumWorld"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
              <input
                id="nullscapeWorld"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
              <input
                id="structoryWorld"
                type="checkbox"
                class="checkbox checkbox-secondary"
              />
            </div>
          {/if}
        </div>

        <div class="space-y-3">
          <p>World Type</p>
          <select
            class="select select-primary w-full max-w-xs"
            id="worldTypeDropdown"
          >
            <option selected>Normal</option>
            <option>Superflat</option>
            <option>Large Biomes</option>
          </select>
        </div>
      </div>
    {/if}
    <div class="mt-6">
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
          <button on:click={upload} class="btn uploadBtn">Upload</button>
        </div>
      {/if}
    </div>
  </div>
</div>
