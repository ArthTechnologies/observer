<script>
  import { browser } from "$app/environment";
  import File from "$lib/components/ui/files/File.svelte";
  import Folder from "$lib/components/ui/files/Folder.svelte";
  import TextEditor from "$lib/components/ui/files/TextEditor.svelte";
  import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
  import { ArrowLeft, ArrowLeftIcon, FlaskConical, HardDriveDownload, Hash, KeyIcon, LinkIcon, UserIcon } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import HistoryButton from "$lib/components/buttons/HistoryButton.svelte";
  import MainFolder from "$lib/components/ui/files/MainFolder.svelte";
    import { alert } from "$lib/scripts/utils";

  let files = ["server.properties", ["folder1", ["file1.txt", "file2.txt"]]];
  let id;
  let backurl = "server";
  let tab = "list";
  let filepath = "file.txt";
  let ftpPassword = "loading...";
  let showFtpPassword = false; // toggle for obfuscation
  let username;

  if (browser) {
    let accountId = localStorage.getItem("accountId");
    if (accountId?.includes("acc_")) accountId = accountId.split("acc_")[1];  
    username = accountId.slice(0,6)+"."+localStorage.getItem("serverID")
    if (window.location.href.includes("proxy")) {
      backurl = "proxy";
    }
    if (localStorage.getItem("serverSoftware") == "Velocity") {
      backurl = "proxy";
    }
    id = localStorage.getItem("serverID");
    getFiles();

    document.addEventListener("refresh", function () {
      console.log("refreshing");
      getFiles();
    });

    fetch(
      apiurl + "server/" + id + "/getFtpToken",
      {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        ftpPassword = data.token;
      
      });

    document.addEventListener("keydown", function (event) {
      // Check if the event key is 's' and the Ctrl/Cmd key is pressed
      if (
        (event.key === "s" || event.key === "S") &&
        (event.ctrlKey || event.metaKey)
      ) {
        // Prevent the default browser behavior (saving the page)
        event.preventDefault();
        save();
      }
    });
  }

  function getFiles() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);
    const url = baseurl + "server/" + id + "/files";
    fetch(url, {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        files = data;
        console.log(data);
      });
  }

  function save() {
    document.dispatchEvent(new Event("updatedTextEditor"));
    document.getElementById("filepath").innerHTML = document
      .getElementById("filepath")
      .innerHTML.replace("*", "");
    fetch(
      apiurl +
        "server/" +
        id +
        "/files/write/" +
        filepath.split("/").join("*"),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
        body: JSON.stringify({
          content: document.getElementById("textEditor").value,
        }),
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        document.getElementById("saveButton").classList.add("btn-disabled");
      });
  }

  function toggleFtpPassword() {
    showFtpPassword = !showFtpPassword;
  }

  // Listen for "openTextEditor" event
  if (browser) {
    document.addEventListener("openTextEditor", function (event) {
      tab = "editor";
      setTimeout(function () {
        filepath = event.detail.path;
        document.getElementById("textEditor").value = event.detail.content;
      }, 100);
    });
  }

  function copyPassword() {
    // Create a temporary textarea to hold the password
    const textarea = document.createElement("textarea");
    // Ensure there are no leading/trailing spaces or characters
    textarea.value = ftpPassword.trim();
    
    // Append to the document body
    document.body.appendChild(textarea);
    
    // Select the text inside the textarea
    textarea.select();
    textarea.setSelectionRange(0, 99999); // For mobile devices
    
    // Execute the copy command
    document.execCommand("copy");
    
    // Remove the temporary textarea from the document
    document.body.removeChild(textarea);
    
    alert("Password copied to clipboard", "success");
  }


</script>

<div class="bg-base-300 rounded-xl px-4 py-3 shadow-xl neutralGradientStroke">
    <p class=" font-bold font-ubuntu text-gray-100 mb-2">Server Files</p>
  {#if tab == "list"}
  <div class="flex flex-col items-start gap-5 w-full">
    <div class="bg-base-100 rounded-xl md:p-2 w-full" id="filetree">
      <MainFolder />
      {#each files as file}
        {#if typeof file == "string"}
          <File filename={file.split(":")[0]} url={file.split(":")[1]} size={file.split(":")[2]}/>
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
    <div />
  </div>
{:else if tab == "editor"}
  <div class="bg-base-100 rounded-xl p-3 h-[30rem] w-full lg:h-[35rem] xl:h-[45rem]">
    <div class="flex justify-between">
      <div class="flex mb-2 justify-between w-full">
        <button
          class="btn btn-sm btn-neutral btn-circle"
          on:click={() => { tab = "list"; }}>
          <ArrowLeftIcon class="w-5 h-5" />
        </button>
        <h1 class="text-xl font-bold" id="filepath">{filepath}</h1>
        <button
          class="btn btn-sm btn-neutral btn-disabled"
          id="saveButton"
          on:click={save}>
          {$t("save")}
        </button>
      </div>
      <!--<HistoryButton />-->
    </div>
    <TextEditor />
  </div>
{/if}

<!-- FTP info -->
<div class="flex flex-col items-start gap-5 w-full mb-12 mt-2">
  <div class="bg-base-100 rounded-xl px-5 py-3 w-full relative">
    <div class="badge badge-outline absolute top-2 right-2 badge-lg text-sm flex gap-1 items-center"><FlaskConical size="14" class="mt-0.5"/>Beta</div>
    <h1 class="text-xl font-poppins-bold mb-1">SFTP Info</h1>
    <div class="flex flex-col gap-2">

        <div class="flex gap-2 items-center">
          <div
            class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1"
          >
            <LinkIcon size="16" />
            Host
          </div>
          sftp://{localStorage.getItem("userNode")?.includes("https://")
  ? localStorage.getItem("userNode").split("https://")[1].split("/")[0]
  : ''}
  
          </div>
      <div class="flex gap-2 items-center">
        <div
          class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1"
        >
          <Hash size="16" />
          Port
        </div>
        {10000+(Math.floor(parseInt(localStorage.getItem("serverID")) / 100) * 100)+99}

        </div>
      <div class="flex gap-2 items-center">
        <div
          class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1"
        >
          <UserIcon size="16" />
          Username
        </div>
        {username}

        </div>

      <div class="flex gap-2 items-center">
        <div
          class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1"
        >
          <KeyIcon size="16" />
          Password
        </div>

<p id="ftpToken">
  {#if showFtpPassword}
  {ftpPassword}
{:else}
  ********
{/if}
</p>
<button class="btn btn-xs" on:click={toggleFtpPassword}>
  {#if showFtpPassword}Hide{:else}Show{/if}
</button>

 <button class="btn btn-xs btn-neutral" on:click={copyPassword}>
  Copy
</button>
      </div>
    </div>
  </div>
</div>
</div>
