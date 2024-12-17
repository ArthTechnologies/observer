<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  export let url: string;
  export let filename: string;
  import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
  import {
    File,
    FileText,
    Image,
    Trash2,
    FileUp,
    AlertTriangle,
  } from "lucide-svelte";
  import { Warning } from "postcss";
  let id;
  let extension = filename.split(".")[filename.split(".").length - 1];
  let clickable = "auto";
  let accountType = "email";

  if (browser) {
    id = localStorage.getItem("serverID");
    if (localStorage.getItem("accountEmail").includes("@")) {
      accountType = "email";
    } else {
      accountType = localStorage.getItem("accountEmail").split(":")[0];
    }
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
    if (usingOcelot) baseurl = getServerNode(id);
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

  function deleteFile() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);

    fetch(baseurl + "server/" + id + "/file/" + url, {
      method: "DELETE",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.msg == "Done") {
          document.getElementById("delete" + filename).checked = false;
          const event = new CustomEvent("refresh");
          document.dispatchEvent(event);
        }
      });
  }
</script>

<div class="flex gap-1 justify-between">
  <a
    href="#textEditor"
    on:click={getText}
    class="w-[65%] px-1.5 p-1 rounded-lg btn-ghost pointer-events-{clickable} gap-1 flex items-center"
  >
    {#if extension == "png" || extension == "jpg" || extension == "jpeg"}
      <Image class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else if extension == "yml" || extension == "yaml" || extension == "json" || extension == "txt"}
      <FileText class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {:else}
      <File class="shrink-0 w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    {/if}
    <p class="text-xs md:text-sm truncate w-[8rem] md:w-[14rem]">{filename}</p>
  </a>
  <div class="flex gap-1">
    <label
      for="delete{filename}"
      on:click={getText}
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center"
    >
      <Trash2 class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
    <label
      for="upload"
      on:click={getText}
      class="px-1.5 p-1 rounded-lg btn-ghost cursor-pointer gap-1 flex items-center btn-disabled opacity-50"
    >
      <FileUp class="w-[.9rem] h-[.9rem] md:w-[1rem] md:h-[1rem]" />
    </label>
  </div>
</div>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete{filename}" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="delete{filename}"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <AlertTriangle class="w-6 h-6" />
      <span class="text-sm"
        >Make sure that you are deleting the right file, you won't be able to
        recover <b>{filename}</b>.</span
      >
    </div>
    <div class="flex gap-1">
      <button on:click={deleteFile} id="delButton" class="btn btn-error">
        {$t("button.delete")}</button
      >
    </div>
  </div>
</div>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="upload" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="upload"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86 h-16 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <span class="text-sm">{$t("server.delete.desc")}</span>
    </div>
    <div class="flex gap-1">
      {#if accountType == "email"}
        <input
          type="password"
          id="password"
          class="input input-bordered input-error mr-1"
          placeholder={$t("typeYourPassword")}
        />
      {/if}
      <button id="delButton" class="btn btn-error">
        {$t("button.delete")}</button
      >
    </div>
  </div>
</div>
