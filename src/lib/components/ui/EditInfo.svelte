<script>
  import { browser } from "$app/environment";
  import { setInfo } from "$lib/scripts/req";
  import { src_url_equal } from "svelte/internal";
  import { Settings } from "lucide-svelte";
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
    <Settings class="w-[1.5rem] h-[1.5rem] md:w-[1rem] md:h-[1rem]" />
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
