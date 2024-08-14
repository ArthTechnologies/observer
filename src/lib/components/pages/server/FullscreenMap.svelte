<script>
  import { browser } from "$app/environment";
  import { writeTerminal } from "$lib/scripts/req";
  import { Maximize2, Minimize2, X } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  let id;
  let scrollCorrected = false;
  let isFocused = false;

  if (browser) {
    id = localStorage.getItem("serverID");
  }
</script>

<label for="fullscreenMap"
  ><div class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2 z-20">
    <Maximize2 size="17" />
  </div></label
>

<input type="checkbox" id="fullscreenMap" class="modal-toggle" />
<div
  class="modal bg-base-100 h-screen w-screen max-sm:items-start items-center p-8"
>
  <div class="w-full h-[900px] relative">
    <iframe
      title="Webmap of the server's world"
      type="text/html"
      src="http://192.168.1.85:{parseInt(id) + 10200}"
      class="shadow-xl w-full rounded-xl"
      height="950"
    ></iframe>
    <label
      for="fullscreenMap"
      class="btn btn-base-300 btn-sm btn-circle absolute right-2 -top-10"
      >✕</label
    >
  </div>
</div>
