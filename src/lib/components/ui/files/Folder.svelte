<script lang="ts">
  import File from "$lib/components/ui/files/File.svelte";
  import Folder from "$lib/components/ui/files/Folder.svelte";
  import {
    ChevronDown,
    FolderClosed,
    ChevronRight,
    Trash2,
    FileUp,
  } from "lucide-svelte";
  export let foldername;
  export let files;
  let open = false;
  let folderId;
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

  function getFilePath(file) {
    function findPath(files, currentPath = "") {
      for (const item of files) {
        if (typeof item === "string") {
          if (item === file) {
            return currentPath + item;
          }
        } else {
          const [foldername, subfiles] = item;
          const newPath = currentPath + foldername + "/";
          const result = findPath(subfiles, newPath);
          if (result) return result;
        }
      }
      return null; // File not found
    }
    console.log(findPath(files, ""));
    return findPath(files, ""); // Start with an empty currentPath
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
    <button
      class="px-1.5 p-1 rounded-lg btn-ghost gap-1 flex items-center btn-disabled opacity-50"
    >
      <Trash2 class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </button>
    <button
      class="px-1.5 p-1 rounded-lg btn-ghost gap-1 flex items-center btn-disabled opacity-50"
    >
      <FileUp class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </button>
  </div>
</div>
{#if open}
  <div class="ml-3 md:ml-5">
    {#each files as file}
      {#if typeof file == "string"}
        <File filename={file.split(":")[0]} url={file.split(":")[1]} />
      {:else}
        <Folder foldername={file[0].split(":")[0]} files={file[1]} />
      {/if}
    {/each}
  </div>
{/if}
