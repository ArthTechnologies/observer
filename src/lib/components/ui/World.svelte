<script lang="ts">
  import { deleteServer, usingOcelot, getServerNode } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { AlertTriangle, Download, Loader, Map } from "lucide-svelte";
  import Alert from "./Alert.svelte";

  import Helper from "./Helper.svelte";
  import { downloadProgressShort, alert } from "$lib/scripts/utils";

  let areWorldgenMods = false;
  let tab = "upload";
  let id = -1;
  let serverName = "";
  let serverVersion = "";

  let worldgenFiles = [];
  let promise;
  let worldgenModsText = "Worldgen Mods:";
  let downloading = false;
  let downloadProgress = "0/0MB";
  let theme = "dark";

  let gradientBackground = "#1fb2a5";

  let visible = false;
  let type = "error";
  if (browser) {
    serverName = localStorage.getItem("serverName");
    serverVersion = localStorage.getItem("serverVersion");
    id = localStorage.getItem("serverID");

    fetch(apiurl + "info/jars", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
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
        promise = fetch(apiurl + "server/" + id + "/file/world*datapacks", {
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
            username: localStorage.getItem("accountEmail"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.content.includes("terralith")) {
              worldgenFiles.push("terralith");
              if (document.getElementById("terralithWorld") != null)
                document.getElementById("terralithWorld").checked = true;
            }

            if (data.content.includes("incendium")) {
              worldgenFiles.push("incendium");
              if (document.getElementById("incendiumWorld") != null)
                document.getElementById("incendiumWorld").checked = true;
            }
            if (data.content.includes("nullscape")) {
              worldgenFiles.push("nullscape");
              if (document.getElementById("nullscapeWorld") != null)
                document.getElementById("nullscapeWorld").checked = true;
            }
            if (data.content.includes("structory")) {
              worldgenFiles.push("structory");
              if (document.getElementById("structoryWorld") != null)
                document.getElementById("structoryWorld").checked = true;
            }

            if (worldgenFiles.length == 0) {
              worldgenModsText = worldgenModsText + " None";
            } else {
              worldgenModsText =
                worldgenModsText + " " + worldgenFiles.join(", ");
            }
          });
      });
  }

  function download() {
    downloading = true;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiurl + "server/" + id + "/world", true);
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
          if (theme == "dark") {
            downloadBtn.classList.add("text-accent-content");
            downloadBtn.classList.remove("text-gray-200");
          } else if (theme == "light") {
            downloadBtn.classList.add("text-gray-200");
            downloadBtn.classList.remove("text-accent-content");
          }
          downloadBtn.classList.add("pointer-events-none");
          //if its dark theme, gradient needs to be 90% transparency
          //to 0% transparency, where light should be from 90% to 70%.
          theme = localStorage.getItem("theme");
          if (theme == "dark") {
            gradientBackground = "#1fb2a5";
            downloadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${(event.loaded / event.total) * 100}%,
  ${gradientBackground} ${(event.loaded / event.total) * 100}%,
  ${gradientBackground} 100%
)`;
          } else if (theme == "light") {
            gradientBackground = "#88c0d0";
            downloadBtn.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.7) ${(event.loaded / event.total) * 100}%,
  ${gradientBackground} ${(event.loaded / event.total) * 100}%,
  ${gradientBackground} 100%
)`;
          }
        } else if (percentComplete >= 100) {
          downloadProgress = "0/0MB";

          downloadBtn.style.width = ``;
          downloadBtn.style.background = ``;
          downloadBtn.classList.remove("pointer-events-none");
          if (theme == "dark")
            downloadBtn.classList.remove("text-accent-content");
          else if (theme == "light") downloadBtn.classList.remove("text-gray-200");
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
    const fileInput = document.getElementById("worldFile");
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
          else if (theme == "light") uploadBtn.classList.add("text-gray-200");

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
          uploadBtn.classList.remove("text-gray-200");
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
          alert($t("alert.fileUploaded"), "success");
        }
        requestFinished = true;
      });

      xhr.addEventListener("error", (error) => {
        console.error("Error:", error);
      });

      xhr.open("POST", apiurl + "server/" + id + "/world", true);
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

      let baseurl = apiurl;
      if (usingOcelot) baseurl = getServerNode(id);
      const url = baseurl + "server/" + id + "/world";
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
            username: localStorage.getItem("accountEmail"),
          },
        }
      );
    }
  }

  function onclick() {
    serverVersion = localStorage.getItem("serverVersion");
    areWorldgenMods = false;

    fetch(apiurl + "info/jars", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        let worldgenMods = ["terralith", "incendium", "nullscape", "structory"];
        for (let i in worldgenMods) {
          if (
            JSON.stringify(
              data.includes(worldgenMods[i] + "-" + serverVersion + ".zip")
            )
          ) {
            areWorldgenMods = true;
          }
        }
      });
  }
</script>

<!-- The button to open modal -->
<label for="world" class="btn w-1/2 btn-accent" on:click={onclick}
  ><Map class="mr-1.5" />{$t("button.world")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="world" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative overflow-x-hidden">
    <label
      for="world"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <div
      class=" w-11/12 md:w-96 bg-base-200 rounded-lg p-1 px-2 py-2 space-y-3"
    >
      <div class="flex justify-between items-center">
        <div class="flex flex-col justify-center">
          <p class="font-bold md:text-lg">{$t("currentWorld")}</p>
        </div>
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
      <p class="text-sm">{worldgenModsText}</p>
    </div>

    <div class="tabs tabs-boxed mt-2 w-[17.1rem]">
      <button id="regenTab" on:click={regenTab} class="tab"
        >{$t("tab.regenerateWorld")}</button
      >
      <button id="uploadTab" on:click={uploadTab} class="tab tab-active"
        >{$t("tab.uploadWorld")}</button
      >
    </div>
    <div class="divider w-[17rem]" />
    <div
      class="bg-warning w-86 h-16 md:h-12 rounded-lg text-black p-2 flex items-center mb-2 space-x-2"
    >
      <AlertTriangle size="32" />
      <span class="text-sm">{$t("warning.world")}</span>
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
          <p>{$t("world.l.worldType")}</p>
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
          placeholder={$t("world.p.seed")}
        />
        <label for="world" on:click={regen} class="btn btn-neutral"
          >{$t("button.regenerateWorld")}</label
        >
      {/if}
      {#if tab == "upload"}
        <div class="flex space-x-2">
          <input
            id="worldFile"
            type="file"
            class="file-input file-input-bordered file-input-secondary max-w-xs w-2/3"
          />
          <button
            on:click={upload}
            id="uploadBtn"
            class="btn btn-neutral rounded-lg relative"
            >{$t("button.upload")}</button
          >
        </div>
      {/if}
    </div>
  </div>
</div>
