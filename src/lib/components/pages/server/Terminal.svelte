

<script lang="ts" context="module">

    import { browser } from "$app/environment";
    import FullscreenTerminal from "$lib/components/buttons/FullscreenTerminal.svelte";
    import { t } from "$lib/scripts/i18n";
    import { readTerminal, writeTerminal } from "$lib/scripts/req";
    
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
      writeTerminal(id, input);
      //clear input
      document.getElementById("input").value = "";

      //wait 200 ms then read terminal
      setTimeout(() => {
        readCmd();
      }, 200);
    }
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

</script>
<div id="terminalContainerContainer" class="relative mb-1.5 w-full z-[0]">
    <FullscreenTerminal />
    <div
      id="terminalContainer"
      class="bg-base-100 rounded-xl overflow-auto w-full h-[30rem] 2xl:h-[35rem]"
    >
      <div class="p-5 text-sm xl:text-base font-mono relative">
        <p id="terminal" />
      </div>
    </div>
  </div>
  <input
    on:keypress={writeCmd}
    id="input"
    type="text"
    placeholder={$t("p.enterCommand")}
    class="input input-secondary bg-base-200 w-full"
  />
