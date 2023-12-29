<script lang="ts">
  import { browser } from "$app/environment";
  export let url: string;
  export let filename: string;
  import { apiurl, usingOcelot } from "$lib/scripts/req";
  import { File, FileText, Image } from "lucide-svelte";
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
    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    fetch(baseurl + "server/" + id + "/file/" + url, {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        let content = data.content.replace(/\\n/g, "\n").replace(/\\"/g, '"');
        document.getElementById("textEditor").value = content;
        document.dispatchEvent(new Event("updatedTextEditor"));

        localStorage.setItem("fileVersions", data.versions.toString());
        document.dispatchEvent(new Event("updateVersionsList"));

        document.getElementById("filename").innerHTML = filename;
        document.getElementById("filepath").value = url;
      });
  }
</script>

<li class="">
  <a
    href="#textEditor"
    on:click={getText}
    class="btn-sm pointer-events-{clickable} -space-x-2 md:space-x-0"
  >
    {#if extension == "png" || extension == "jpg" || extension == "jpeg"}
      <Image class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else if extension == "yml" || extension == "yaml" || extension == "json" || extension == "txt"}
      <FileText class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else}
      <File class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {/if}
    <p class="text-xs md:text-sm truncate w-[8rem] md:w-[14rem]">{filename}</p>
  </a>
</li>
