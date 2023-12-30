<script lang="ts">
  import { apiurl, deleteServer, usingOcelot } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import World from "./World.svelte";
  import { AlertTriangle, Loader, Trash2 } from "lucide-svelte";
  import { getDefaultSettings } from "http2";
  let id = -1;
  let accountType = "email";
  let loading = false;
  if (browser) {
    id = localStorage.getItem("serverID");
    if (localStorage.getItem("accountEmail").includes("@")) {
      accountType = "email";
    } else {
      accountType = localStorage.getItem("accountEmail").split(":")[0];
    }
  }
  function del() {
    let delButton = document.getElementById("delButton");

    loading = true;

    let password = "";
    if (accountType === "email") {
      password = document.getElementById("password").value;
    }
    deleteServer(id, password).then(() => {
      loading = false;
      if (usingOcelot) {
        fetch(
          apiurl +
            "node?url=" +
            JSON.parse(localStorage.getItem("serverNodes"))[id.toString()],
          {
            method: "POST",
          }
        );
      }
    });
  }
</script>

<!-- The button to open modal -->
<label for="delete" class="btn btn-warning"
  ><Trash2 class="mr-1.5" />{$t("button.delete")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="delete"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86 h-16 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
    >
      <AlertTriangle size="48" />
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
      <button id="delButton" class="btn btn-error" on:click={del}>
        {#if loading}
          <Loader class="mr-1.5 animate-spin" />Deleting
        {:else}
          {$t("button.delete")}{/if}</button
      >
    </div>
  </div>
</div>
