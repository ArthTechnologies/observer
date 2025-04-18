<script lang="ts">
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { fileSizeShort } from "$lib/scripts/utils";
  import { error } from "console";
  import { Download, FlaskConical, HardDriveDownload } from "lucide-svelte";

  let promise = null;
  let backups = [];

  if (browser) {
    fetch(apiurl + "server/" + localStorage.getItem("serverID") + "/backups", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        backups = data;
        promise = Promise.resolve();
      })
      .catch((error) => {
        console.error("Error fetching backups:", error);
        promise = Promise.reject(error);
      });
  }

  function download(timestamp) {
    fetch(
      apiurl +
        "server/" +
        localStorage.getItem("serverID") +
        "/backup/" +
        timestamp,
      {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
      }
    )
      .then((response) => {
        if (response.ok) {
          return response.blob();
        } else {
          throw new Error("Failed to download backup");
        }
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `backup-${timestamp}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      })
      .catch((error) => {
        console.error("Error downloading backup:", error);
      });
  }
</script>

<div class="relative bg-base-100 rounded-xl p-3 w-full space-y-2 min-h-[30rem]">
  <div class="flex justify-between items-center">
    <p class="font-poppins-bold text-lg ml-1">Backups</p>
    <div
      class="badge badge-outline absolute top-2 right-2 badge-lg text-sm flex gap-1 items-center"
    >
      <FlaskConical size="14" class="mt-0.5" />Beta
    </div>
  </div>

  <div class="space-y-3">
    {#await promise}
      {#each Array.from({ length: 5 }) as _, i}
        <div class="flex flex-col">
          <div
            class="h-[3rem] bg-base-200 rounded-lg px-3 pt-[1.125rem] pb-[.75rem] flex flex-col justify-between"
          >
            <div class="flex space-x-1 items-end">
              <div class="bg-slate-700 rounded-lg w-[5rem] h-4 animate-pulse" />
              <div class="bg-slate-700 rounded-lg w-[6rem] h-3 animate-pulse" />
            </div>
          </div>
        </div>
      {/each}
    {:then}
      {#each backups as backup}
        <div class="flex flex-col">
          <div
            class="h-[3rem] bg-base-200 rounded-lg px-3 py-2 flex flex-col justify-between"
          >
            <div class="flex space-x-1 items-center justify-between">
              <div class="flex space-x-1 items-center">
                <p>{new Date(backup.timestamp).toString().split("00 (")[0]}</p>
                <div
                  class="badge badge-outline badge-lg text-sm flex gap-1 items-center"
                >
                  {fileSizeShort(backup.size).toUpperCase()}
                </div>
              </div>
              <a
                href={apiurl +
                  "server/" +
                  localStorage.getItem("serverID") +
                  "/backup/" +
                  backup.timestamp +
                  "?key=" +
                  backup.key}
                class="btn btn-sm btn-ghost flex"
                ><Download size="18" class="mr-1.5" />download</a
              >
            </div>
          </div>
        </div>
      {/each}
    {/await}
  </div>
</div>
