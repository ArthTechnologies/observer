<script>
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { apiurl, getServerNode, usingOcelot } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  export let foldername;
  export let uploadpath;
  export let id;
  export let modal = true;
  let uniqueId = Math.floor(Math.random() * 1000000);
  let gradientBackground = "#1fb2a5";
  function uploadFile() {
    const formData = new FormData();
    const fileInput = document.getElementById("upload" + foldername + "file");
    const file = fileInput.files[0];

    formData.append("file", file, file.name);

    console.error("uploading");
    if (browser) {
      const uploadBtn = document.getElementById("uploadBtn" + uniqueId);
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
          
            gradientBackground = "#1fb2a5";
            uploadBtn.style.background = `linear-gradient(
  to right,
 #13171e 0%,
  #13171e ${visualPercent}%,
  #2b364f ${visualPercent}%,
  #2b364f 100%
)`;
         //listen for refresh event
          document.addEventListener("refresh", function () {
            console.log("ending loading thing");

            clearInterval(intervalId);
setTimeout(() => {
  uploadBtn.innerHTML = $t("button.upload");
            uploadBtn.classList.remove("pointer-events-none");
            uploadBtn.style.background = ``;
            uploadBtn.classList.remove("text-accent-content");
            uploadBtn.classList.remove("text-gray-200");
            }, 100);
          });
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

        if (!e.target.response.includes("No Viruses Detected") &&
      !e.target.response.includes("Upload Complete")
      ) {
          alert($t("alert.virusDetected"));
        } else {
          alert($t("alert.fileUploaded"), "success")


          //dispatch refresh event
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
          console.log("Dispatching refresh event");
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
          uploadpath +
          "?filename=" +
          file.name,
        true
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

{#if modal}
<div class="flex gap-1 mt-2">
  <input
    id="upload{foldername}file"
    type="file"
    class="file-input file-input-bordered file-input-secondary w-full max-w-xs"
  />
  <button id="uploadBtn{uniqueId}" on:click={uploadFile} class="btn btn-neutral">
    {$t("button.upload")}</button
  >
</div>
{:else}
<div class="flex gap-1 mt-2">
  <input
    id="upload{foldername}file"
    type="file"
    class="file-input file-input-bordered file-input-secondary w-full max-w-xs"
  />
  <button id="uploadBtn{uniqueId}" on:click={uploadFile} class="btn btn-neutral">
    {$t("button.upload")}</button
  >
</div>
{/if}