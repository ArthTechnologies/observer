<script lang="ts">
  import File from "$lib/components/ui/filetree/File.svelte";
  import Folder from "$lib/components/ui/filetree/Folder.svelte";
  export let foldername;
  export let files;
  let open = false;
  let folderId;
  //folder ID is a random number.
  folderId = Math.floor(Math.random() * 1000000000);
  function toggleOpen() {
    open = !open;
    if (open) {
      document.getElementById("toggleIndicator" + folderId).innerHTML = "▶";
    } else {
      document.getElementById("toggleIndicator" + folderId).innerHTML = "▼";
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

<li>
  <a class="btn-sm -space-x-2 md:space-x-0" on:click={toggleOpen}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]"
      ><path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      /></svg
    >
    <p class="text-xs md:text-sm">{foldername}</p>

    {#if files.length > 1}
      <p id="toggleIndicator{folderId}">▼</p>
    {/if}
  </a>
</li>
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
