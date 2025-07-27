<script>
    import { browser } from "$app/environment";
    import CopyButton from "$lib/components/buttons/CopyButton.svelte";
    import Versions from "$lib/components/buttons/Versions.svelte";
    import StorageLimit from "$lib/components/ui/StorageLimit.svelte";
    import World from "$lib/components/ui/World.svelte";
    import { apiurl } from "$lib/scripts/req";
    import { alert } from "$lib/scripts/utils";

    import { AlertCircleIcon, AlertOctagonIcon, BookOpen, CameraIcon, ChevronRight, InfoIcon, PenLine } from "lucide-svelte";
    let icon = "/images/placeholder.webp";
    export let name = "Server Name";
    export let address = "127.0.0.1";
    export let port = 25565;
    export let subdomain = undefined;
    export let modded = false;
    let e2;
    let state = 0;

    if (browser) {
      let id = localStorage.getItem("serverID");
      fetch(apiurl + "server/" + localStorage.getItem("serverID")+ "/settings/icon",
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
            username: localStorage.getItem("accountEmail"),
          },
        })
        .then((response) => response.blob())
        .then((blob) => {
          if (blob.size > 0) {
            icon = URL.createObjectURL(blob);
            document.getElementById("navIcon"+id).src = icon;
          } else {
            icon = "/images/placeholder.webp";
          }
        });
    }

    function handle() {
      console.log("uploading image...");
      //get image data from file input
      const fileInput = document.getElementById("upload");
      if (fileInput.files.length > 0) {
        console.log("File selected:", fileInput.files[0].name);
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function (e) {

                    //check image height and width
          const img = new Image();
      
          img.src = e.target.result;
          e2 = e.target.result;
          img.onload = function () {

            console.log("Image loaded:", img.width, img.height);
            if (img.width != 64 || img.height != 64) {
              state = 1;
              return;
            } else {
              state = 2;
            }
          };
          document.getElementById("newImg").src = e.target.result;

        };
        reader.readAsDataURL(file);
      }

    }

    function upload() {
      console.log("uploading image...");
      const fileInput = document.getElementById("upload");
      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const formData = new FormData();
        formData.append("file", file);
        let serverId = localStorage.getItem("serverID");
        fetch(apiurl + "server/" + serverId + "/settings/icon", {
          method: "POST",
          body: formData,
          headers: {
            token: localStorage.getItem("token"),
            username: localStorage.getItem("accountEmail"),
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.msg.includes("Success")) {
              document.getElementById("xIcon").src = e2;
              document.getElementById("oldImg").src = e2;

              alert("Image uploaded successfully", "success");
            } else {
              alert(data.error, "error");
            }
          });
      }
    }
</script>
    <div
          class=" bg-base-300 w-full shadow-xl rounded-xl px-4 py-3 neutralGradientStroke"
        >
        <p class=" font-bold font-ubuntu text-gray-100 mb-3">Server Info</p>
          <div class="flex flex-col items-center w-full md:w-[19.8rem]">
         
<div class="flex items-center gap-3.5 w-full">
  <div class="w-[3.5rem] h-[3.5rem] relative group">
    <img
      id="xIcon"
      src={icon}
      class="rounded-lg transition-all cursor-pointer"
    />
    <div on:click={() => document.getElementById("iconModal").showModal()} class="absolute top-0 left-0 w-full h-full cursor-pointer bg-black bg-opacity-50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
      <CameraIcon />
    </div>
  </div><dialog id="iconModal" class="modal">
  <div class="modal-box">
    <h3  class="text-lg font-bold" 
    >Upload Image</h3>
   <input id="upload" type="file" on:change={handle} class=" mt-5 file-input file-input-bordered w-full max-w-xs" />
    <div class="flex gap-3 mt-5 items-center">
      <img id="oldImg" src={icon} class="rounded-lg w-16 h-16" />
      <ChevronRight size="32" />
         <img src={icon} id ="newImg" class="rounded-lg w-16 h-16" />
      
    </div>
    {#if state == 1}
         <div
        class="mt-3 bg-error w-86 rounded-lg text-black p-4 text-xl py-1.5 flex items-center space-x-2"
      >
        <AlertCircleIcon size="20" />
        <span class="text-sm">Please convert your image to 64x64 pixels.</span>
      </div>
      {:else if state == 2}
      <div
        class="mt-3 bg-success w-86 rounded-lg text-black p-4 text-xl py-1.5 flex items-center space-x-2"
      >
        <AlertOctagonIcon size="20" />
        <span class="text-sm">Image is valid</span>
      </div>
      {:else}
      <div
        class="mt-3 bg-info w-86 rounded-lg p-4 text-black text-xl py-1.5 flex items-center space-x-2"
        >
        <InfoIcon size="20" />
        <span class="text-sm">Upload a 64x64 image</span>
      </div>
      {/if}

    <div class="modal-action">
       <button on:click={upload} class="btn btn-neutral">Upload</button>
      <form method="dialog">
           
        <!-- if there is a button in form, it will close the modal -->
        <button class="btn">Close</button>
      </form>
    </div>
  </div>
</dialog>

              <div class="flex flex-col">
                <div class="text-sm font-light flex font-poppins">
                Name:
                </div>
                <div class="font-poppins-bold text-sm md:text-lg -mt-1">
                  {name} <button class="btn bg-base-100 bg-opacity-75 btn-xs btn-circle">
                    <PenLine size=12 /></button>
                </div>

                <div id="rawDesc" class="hidden"></div>
              </div>
              
            </div>
                  <div class="flex items-center gap-3.5 w-full">
           

           <div class="flex">
               <div class="flex flex-col">
               <span class="text-sm font-light  font-poppins mt-3">
                  IP Address
                </span>
                <div class="flex justify-between">
                  <div class="font-mono text-sm  text-white  rounded flex gap-1 items-center -mt-1">
                  {#if subdomain == undefined}{address}:{port}{:else}
                    {subdomain}.{address}
                  {/if}
                  <CopyButton text={subdomain == undefined ? address + ":" + port : subdomain + "." + address} size="16" class="cursor-pointer"
                  />
            
                </div>
                <a href="https://arthmc.xyz/knowledgebase/how-to-join-servers/" target="_blank" class="btn btn-xs  bg-slate-900 bg-opacity-80"><BookOpen size=16 class="mr-1.5"/> How to Join</a>
                </div>
<div class="divider my-2"></div>
              <StorageLimit {modded}/>
                <div id="rawDesc" class="hidden"></div>
                  <div class="flex flex-col gap-2 items-center mt-4 mb-1.5">
        <div class="flex space-x-2 w-full justify-center">
          <div class="w-[45%]">
          <Versions />
          </div>
          <div class="w-[45%]">
          <World /></div>
        </div>
    
      </div>
              </div>


    
              
                  
           </div>
              
            </div>
          </div>
        </div>