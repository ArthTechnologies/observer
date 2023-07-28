<script lang="ts">
  import { browser } from "$app/environment";
  export let url: string;
  export let filename: string;
  import { apiurl } from "$lib/scripts/req";
  let id;
  let extension = filename.split(".")[filename.split(".").length - 1];
  let clickable = "auto";

  if (browser) {
    id = localStorage.getItem("serverID");
  }
  switch (extension) {
    case "png":
    case "jpg":
    case "jpeg":
    case "jar":
      clickable = "none";
      break;
    default:
      clickable = "auto";
      break;
  }
  function getText() {
    if (url != undefined) {
      if (url.includes("//")) {
        url = url.split("//")[1];
        if (url.includes("/")) {
          url = url.split("/").join("*");
        }
      }
    }
    fetch(apiurl + "server/" + id + "/file/" + url, {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.text())
      .then((data) => {
        data = data.replace(/\\n/g, "\n").replace(/\\"/g, '"');

        //replace quotes at beginning and end
        data = data.substring(1, data.length - 1);

        document.getElementById("textEditor").value = data;

        document.getElementById("filename").innerHTML = filename;
        document.getElementById("filepath").value = url;
      });
  }
</script>

<li class="">
  <a
    on:click={getText}
    class="btn-sm pointer-events-{clickable} -space-x-2 md:space-x-0"
  >
    {#if extension == "png" || extension == "jpg" || extension == "jpeg"}
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
          d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
        /></svg
      >
    {:else if extension == "jar"}
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        /></svg
      >
    {:else}
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
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        /></svg
      >
    {/if}
    <p class="text-xs md:text-sm">{filename}</p>
  </a>
</li>
