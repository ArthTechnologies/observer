<script>
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { apiurl, getServerNode, usingOcelot } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  
  export let foldername;
  export let uploadpath;
  export let id;
  export let modal = true;
  
  let gradientBackground = "#1fb2a5";
  
  function uploadFolder() {
    const formData = new FormData();
    const folderInput = document.getElementById("upload" + foldername + "folder");
    const files = folderInput.files;
    
    // Append each file to the FormData.
    // Using file.webkitRelativePath preserves the folder structure.
    for (let i = 0; i < files.length; i++) {
      formData.append("files[]", files[i], files[i].webkitRelativePath || files[i].name);
    }
    
    console.error("uploading folder");
    if (browser) {
      const uploadBtn = document.getElementById("uploadBtn");
      // We use XMLHttpRequest for progress updates.
      const xhr = new XMLHttpRequest();
      let totalSizeMB = 200; // default value, updated later from the progress event
      let counter = 0;
      let requestFinished = false;

      // Display estimated progress
      let intervalId = setInterval(() => {
        counter++;
        let visualPercent = (((counter / 20) * 1.09) / totalSizeMB) * 100;
        let virusScanningEnabled = localStorage.getItem("enableVirusScan");
        let theme = localStorage.getItem("theme");

        if (!requestFinished) {
          // Disable clicks on the button while uploading.
          uploadBtn.classList.add("pointer-events-none");
        }

        if (visualPercent < 100) {
          if (theme == "dark") uploadBtn.classList.add("text-accent-content");
          else if (theme == "light") uploadBtn.classList.add("text-gray-200");

          uploadBtn.innerHTML = $t("uploading");
          gradientBackground = "#1fb2a5";
          uploadBtn.style.background = `linear-gradient(
  to right,
  #13171e 0%,
  #13171e ${visualPercent}%,
  #2b364f ${visualPercent}%,
  #2b364f 100%
)`;
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
              // Re-enable clicks on the button.
              uploadBtn.classList.remove("pointer-events-none");
              clearInterval(intervalId);
            }
          } else if (requestFinished) {
            uploadBtn.style.background = ``;
            uploadBtn.innerHTML = $t("button.upload");
            // Re-enable clicks on the button.
            uploadBtn.classList.remove("pointer-events-none");
            clearInterval(intervalId);
          }
        }
      }, 50);

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          totalSizeMB = event.total / Math.pow(1024, 2);
          console.log("PROGRESS", totalSizeMB);
        }
      });

      xhr.addEventListener("load", (e) => {
        console.log(e.target.response);
        if (!e.target.response.includes("No Viruses Detected") &&
            !e.target.response.includes("Upload Complete")) {
          alert($t("alert.virusDetected"));
        } else {
          alert($t("alert.folderUploaded"), "success");
          // Dispatch a refresh event.
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
          console.log("Dispatching refresh event");
        }
        requestFinished = true;
      });

      xhr.addEventListener("error", (error) => {
        console.error("Error:", error);
      });

      // Note the change in the endpoint URL and query parameter.
      xhr.open(
        "POST",
        apiurl +
          "server/" +
          id +
          "/folder/upload/" +
          uploadpath +
          "?foldername=" +
          foldername,
        true
      );
      xhr.setRequestHeader("token", localStorage.getItem("token"));
      xhr.setRequestHeader("username", localStorage.getItem("accountEmail"));
      xhr.send(formData);

      xhr.onload = function () {
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
  rgba(0, 0, 0, 0.7) 100%,
  ${gradientBackground} 100%,
  ${gradientBackground} 100%
)`;
        }
      };
    }
  }
</script>

{#if modal}
  <div class="flex gap-1 mt-2">
    <input
      id="upload{foldername}folder"
      type="file"
      webkitdirectory
      class="file-input file-input-bordered file-input-secondary w-full max-w-xs"
    />
    <button id="uploadBtn" on:click={uploadFolder} class="btn btn-neutral">
      {$t("button.upload")}
    </button>
  </div>
{:else}
  <div class="flex gap-1 mt-2">
    <input
      id="upload{foldername}folder"
      type="file"
      webkitdirectory
      class="file-input file-input-bordered file-input-secondary w-full max-w-xs"
    />
    <button id="uploadBtn" on:click={uploadFolder} class="btn btn-neutral">
      {$t("button.upload")}
    </button>
  </div>
{/if}
