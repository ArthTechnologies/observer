<script>
  import { browser } from "$app/environment";
  import { setInfo } from "$lib/scripts/req";
  import { src_url_equal } from "svelte/internal";
  let id;
  let icon = "";
  let iconPreview = "/images/palceholder.webp";
  let desc = "";
  let fSecret = "";
  let proxiesEnabled = false;
  let software;
  if (browser) {
    id = localStorage.getItem("serverID");
    software = localStorage.getItem("serverSoftware");

    setTimeout(() => {
      if (document.getElementById("proxiesEnabled") != null) {
        if (document.getElementById("proxiesEnabled").checked) {
          proxiesEnabled = true;
        } else {
          proxiesEnabled = false;
        }
      }
      icon = document.getElementById("xIcon").src;
      iconPreview = icon;
      desc = document.getElementById("xDesc")?.innerText.split(": ")[1];
      if (icon.includes("/images/placeholder.webp")) {
        icon = "";
        iconPreview = "/images/placeholder.webp";
      }
    }, 800);
  }
  function set() {
    //download the file from the input with id="icon"

    if (browser) {
      if (document.getElementById("proxiesEnabled") != null) {
        if (document.getElementById("proxiesEnabled").checked) {
          proxiesEnabled = true;
        } else {
          proxiesEnabled = false;
        }
      }
      console.log(icon == "");
      if (icon == "") {
        icon = "https://servers.arthmc.xyz/images/placeholder.webp";
      }

      setInfo(id, icon, desc, proxiesEnabled, fSecret);
    }
  }
</script>

<label for="editInfo"
  ><div class="btn btn-circle absolute right-2 top-2 md:btn-sm">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-settings w-[1.5rem] h-[1.5rem] md:w-[1rem] md:h-[1rem]"
      ><circle cx="12" cy="12" r="3" /><path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      /></svg
    >
  </div></label
>

<input type="checkbox" id="editInfo" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="editInfo" class="btn btn-sm btn-circle fixed right-2 top-2"
      >✕</label
    >
    <h3 class="text-2xl font-bold">Settings</h3>
    <div class="divider mt-5 text-xl font-bold">Server Info</div>
    <p class="mb-4">
      Players will see this information on their server list in Minecraft.
    </p>
    <label for="serverDescription" class="block font-bold mb-2"
      >Description
    </label>
    <input
      bind:value={desc}
      type="text"
      id="serverDescription"
      class="input input-bordered"
    />
    <label for="serverIcon" class="block font-bold my-2"
      >Icon
      <p class="font-light">Image can't be taller than it is wide.</p></label
    >
    <div class="flex space-x-2">
      <input
        bind:value={icon}
        type="text"
        id="serverIcon"
        class="input input-bordered"
        placeholder="Enter URL"
      />
      <img src={iconPreview} class="h-[3rem] w-[3rem] rounded-lg" />
    </div>
    <h3 class="text-2xl font-bold mt-5">Advanced Settings</h3>
    <div class="divider mt-5 text-xl font-bold">Proxies</div>
    {#if software == "Paper"}
      <p class="mb-4">If you have a proxy set up, you can enable it here.</p>
      <div class=" w-52">
        <label class="cursor-pointer label">
          <span class="label-text text-lg">Enable Proxies</span>
          <input
            id="proxiesEnabled"
            type="checkbox"
            class="toggle toggle-primary"
          />
        </label>
      </div>
      <label for="serverDescription" class="block font-bold my-2"
        >Forwarding Secret
      </label>
      <input
        bind:value={fSecret}
        type="text"
        id="fSecret"
        class="input input-bordered"
        placeholder={fSecret}
      />
    {:else}<p class="mb-4">Your server type doesn't support proxies.</p>
    {/if}
    <div class="flex justify-end mt-4">
      <label on:click={set} for="editInfo" class="btn btn-primary">Save</label>
    </div>
  </div>
</div>
