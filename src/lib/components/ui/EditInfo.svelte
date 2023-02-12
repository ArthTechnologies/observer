<script>
  import { browser } from "$app/environment";
  import { setInfo } from "$lib/scripts/req";
  let id;
  let icon = "";
  let desc = "";
  if (browser) {
    id = localStorage.getItem("serverID");

    setTimeout(() => {
      icon = document.getElementById("xIcon").src;
      desc = document.getElementById("xDesc").value;
    }, 1000);
  }
  function set() {
    //download the file from the input with id="icon"

    if (browser) {
      setInfo(id, icon, desc);
    }
  }
</script>

<label for="editInfo"
  ><div class="btn btn-sm btn-circle mr-2 mt-2">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-edit-2"
      ><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" /></svg
    >
  </div></label
>

<input type="checkbox" id="editInfo" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label for="editInfo" class="btn btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >
    <h3 class="text-lg font-bold">Edit Server Info</h3>
    <p class="py-4">
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
    <input
      bind:value={icon}
      type="text"
      id="serverIcon"
      class="input input-bordered"
      placeholder="Enter URL"
    />

    <div class="flex justify-end mt-4">
      <label on:click={set} for="editInfo" class="btn btn-primary">Save</label>
    </div>
  </div>
</div>
