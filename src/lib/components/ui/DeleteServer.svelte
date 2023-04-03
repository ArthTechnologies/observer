<script lang="ts">
  import { deleteServer } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  let id = -1;
  if (browser) {
    id = localStorage.getItem("serverID");
  }
  function del() {
    deleteServer(id);
  }
  function download() {
    return fetch("https://api.arthmc.xyz/server/" + id + "/world", {
      method: "GET",
      headers: {
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((res) => res.text())
      .then((input: string) => {
        console.log(input);
        //download the file
        const element = document.createElement("a");
        const file = new Blob([input], { type: "text/plain" });
        element.href = URL.createObjectURL(file);
        element.download = "world.zip";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
      });
  }
</script>

<!-- The button to open modal -->
<label for="delete" class="btn btn-warning"
  ><svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    class="feather feather-trash-2"
    ><polyline points="3 6 5 6 21 6" /><path
      d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
    /><line x1="10" y1="11" x2="10" y2="17" /><line
      x1="14"
      y1="11"
      x2="14"
      y2="17"
    /></svg
  >{$t("button.delete")}</label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="delete" class="btn btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <h3 class="text-lg font-bold">Do you want to delete this server?</h3>
    <p class="py-4">
      Your server will be instantly deleted. This cannot be undone.
    </p>
    <button class="btn btn-primary" on:click={download}
      >Download World File</button
    >
    <a href="/"
      ><button class="btn btn-error" on:click={del}
        >{$t("button.delete2")}</button
      ></a
    >
  </div>
</div>
