

<script lang="ts" context="module">

    import { browser } from "$app/environment";
    import FullscreenTerminal from "$lib/components/buttons/FullscreenTerminal.svelte";
    import { t } from "$lib/scripts/i18n";
    import { readTerminal, writeTerminal } from "$lib/scripts/req";
    import { SendIcon } from "lucide-svelte";
  
    
    export let id: number;

    if (browser	) {
        id = localStorage.getItem("serverID");
    }
    function writeCmd(event) {
    //take input value
    let input = document.getElementById("input").value;

    //if theres a / at the beginning, remove it
    if (input.startsWith("/")) {
      input = input.substring(1);
    }
    //if key pressed is enter, send alert
    if (event.keyCode == 13) {
send(input);
    }
  }

  function send(input) {
    writeTerminal(id, input);
      //clear input
      document.getElementById("input").value = "";

      //wait 200 ms then read terminal
      setTimeout(() => {
        readCmd();
      }, 200);
  }
  let scrollCorrected = false;
  export function readCmd() {


    if (browser) {

      readTerminal(id).then((response) => {
        let difference = 0;

        const terminalContainer = document.getElementById("terminalContainer");
        const terminal = document.getElementById("terminal");
        const filteredResponse = response
          .replace(/\x1B\[[0-9;]*[mG]/g, "")
          .replace(/\n/g, "<p>");

        //response replace newlines with <p>, remove things that start with [ and end with m
        if (response.length < 100000) {
          terminalContainer.scrollTop +=
            50 *
            (filteredResponse.split("<p>").length -
              terminal.innerHTML.split("<p>").length);
          if (
            filteredResponse.length - terminal.innerHTML.length !=
            difference
          ) {
            difference = filteredResponse.length - terminal.innerHTML.length;

            terminal.innerHTML = filteredResponse;
          }
        } else {
          terminalContainer.scrollTop +=
            50 *
            (filteredResponse
              .substring(filteredResponse.length - 100000)
              .split("<p>").length -
              terminal.innerHTML.split("<p>").length);
          terminal.innerHTML = filteredResponse.substring(
            filteredResponse.length - 100000,
          );
        }

        //scroll down the height of the new lines added
        if (
          terminal.innerHTML.split("<p>").length <
          filteredResponse.split("<p>").length
        ) {
          //adding to scrollTop doesn't get it to the complete bottom,
          //so this remedies that by snapping it to the bottom if needed.
          let difference =
            terminalContainer.scrollHeight - terminalContainer.scrollTop;
          const terminalContainerContainer = document.getElementById(
            "terminalContainerContainer",
          );
          console.log(difference, terminalContainerContainer?.clientHeight);
          if (difference <= terminalContainerContainer?.clientHeight) {
            setTimeout(() => {
              terminalContainer.scrollTop = terminalContainer.scrollHeight;
            }, 1);
          }
        }

        //if this is the first time the terminal is loaded, this will scroll to the bottom.
        if (scrollCorrected == false) {
          terminalContainer.scrollTop = terminalContainer.scrollHeight;

          scrollCorrected = true;
        }
      });
    }
  }
  function calculateElementWidth(screenWidth) {
  let ratio;

  if (screenWidth <= 1500) {
    ratio = 0.0002335 * screenWidth + 0.13105; // Segment 1
  } else if (screenWidth <= 1700) {
    ratio = 0.000176 * screenWidth + 0.2173;   // Segment 2
  } else if (screenWidth <= 1900) {
    ratio = 0.0001385 * screenWidth + 0.28105; // Segment 3
  } else if (screenWidth <= 2100) {
    ratio = 0.0001125 * screenWidth + 0.33045; // Segment 4
  } else if (screenWidth <= 2300) {
    ratio = 0.0000905 * screenWidth + 0.37665; // Segment 5
  } else {
    // Extrapolate for larger widths (use last segment's slope)
    ratio = 0.0000905 * screenWidth + 0.37665;
  }

  return ratio * screenWidth;
}

function updateElementWidth() {
  const screenWidth = window.innerWidth;
  const elementWidth = calculateElementWidth(screenWidth);
  //if larger than 1280px, set to elementWidth. otherwise, full
  const terminalContainer = document.getElementById("terminalContainerContainer");
  const input = document.getElementById("input");
  if (screenWidth > 1280) {
    terminalContainer.style.width = elementWidth + "px";
    input.style.width = elementWidth + "px";
  } else {
    terminalContainer.style.width = "100%";
    input.style.width = "100%";
  }
}


</script>

<script lang="ts">
import { onMount } from "svelte";
  if (browser) {
  onMount(() => {
    window.addEventListener("resize", updateElementWidth);
    updateElementWidth(); // Initial call to set width on mount
  });

}
</script>

<div class="bg-base-300 rounded-xl px-4 py-3 shadow-xl neutralGradientStroke" id="terminalContainerContainer">
        <p class=" font-bold font-ubuntu text-gray-100 mb-2">Server Console</p>
  <div  class="relative mb-3 w-full ">
    <FullscreenTerminal />
    <div
      id="terminalContainer"
      class="bg-base-100 rounded-xl overflow-auto  h-[30rem] 2xl:h-[35rem] mb-2 "
    >
      <div class="p-5 text-sm xl:text-[1rem] font-mono relative ">
        <p id="terminal" />
      </div>
    </div>
  </div>
<div class=" w-full flex items-center gap-2 relative">
  <input
  on:keypress={writeCmd}
  id="input"
  type="text"
  placeholder={$t("p.enterCommand")}
  class="input  bg-base-100 w-full"
/>
<button class="btn btn-ghost btn-circle absolute right-0" on:click={()=>send(document.getElementById("input").value)}
><SendIcon size=20  /></button>


</div>
</div>

<style>
   .neutralGradientStroke {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 3px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>