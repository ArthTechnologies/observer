<script>
    import { browser } from "$app/environment";
    import { writeTerminal } from "$lib/scripts/req";
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
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-maximize-2"
            ><polyline points="15 3 21 3 21 9" /><polyline
                points="9 21 3 21 3 15"
            /><line x1="21" y1="3" x2="14" y2="10" /><line
                x1="3"
                y1="21"
                x2="10"
                y2="14"
            /></svg
        >
    </div></label
>

<input type="checkbox" id="fullscreenTerminal" class="modal-toggle" />
<div class="modal bg-base-100 h-screen w-screen">
    <label
        for="fullscreenTerminal"
        class="btn btn-sm btn-circle fixed right-2 top-2"
        ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-minimize-2"
            ><polyline points="4 14 10 14 10 20" /><polyline
                points="20 10 14 10 14 4"
            /><line x1="14" y1="10" x2="21" y2="3" /><line
                x1="3"
                y1="21"
                x2="10"
                y2="14"
            /></svg
        ></label
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
