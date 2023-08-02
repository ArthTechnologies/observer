<script>
  import { browser } from "$app/environment";
  import { writeTerminal } from "$lib/scripts/req";
  import { Maximize2, Minimize2 } from "lucide-svelte";
  let id;

  if (browser) {
    id = localStorage.getItem("serverID");
  }
  function writeCmd(event) {
    //take input value
    let input = document.getElementById("input2").value;
    //if theres a / at the beginning, remove it
    if (input.startsWith("/")) {
      input = input.substring(1);
    }
    //if key pressed is enter, send alert
    if (event.keyCode == 13) {
      writeTerminal(id, input);
      //clear input
      document.getElementById("input2").value = "";
    }
  }

  setInterval(() => {
    if (browser) {
      document.getElementById("terminal2").innerHTML =
        document.getElementById("terminal").innerHTML;
    }
  }, 100);
</script>

<label for="fullscreenTerminal"
  ><div class="btn btn-sm btn-circle absolute right-2 top-2">
    <Maximize2 size="17" />
  </div></label
>

<input type="checkbox" id="fullscreenTerminal" class="modal-toggle" />
<div class="modal bg-base-100 h-screen w-screen">
  <label
    for="fullscreenTerminal"
    class="btn btn-sm btn-circle fixed right-2 top-2"
    ><Minimize2 size="17" /></label
  >
  <div class="flex flex-col space-y-3 items-center m-2.5 md:m-5 w-full">
    <div
      class="p-5 bg-base-300 rounded-xl shadow-xl overflow-auto max-sm:-mt-8 h-[78vh] rounded-xl w-full"
    >
      <div class=" sm:text-xs xl:text-base font-mono relative">
        <p id="terminal2" />
      </div>
    </div>
    <input
      on:keypress={writeCmd}
      id="input2"
      type="text"
      placeholder="Enter Command"
      class="input input-secondary bg-base-200 w-full"
    />
  </div>
</div>
