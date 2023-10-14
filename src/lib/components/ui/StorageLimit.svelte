<script lang="ts">
    import { browser } from "$app/environment";
    import {
        downloadProgressShort,
        fileSizeShort,
    } from "$lib/scripts/numShort";
    import { apiurl, usingOcelot } from "$lib/scripts/req";
    import { HardDrive } from "lucide-svelte";
    let storageRatio = "0/0mB";
    if (browser) {
        let baseurl = apiurl;
        if (usingOcelot)
            baseurl =
                JSON.parse(localStorage.getItem("serverNodes"))[
                    localStorage.getItem("serverID")
                ] + "/";
        fetch(
            baseurl +
                "server/" +
                localStorage.getItem("serverID") +
                "/storageInfo",
            {
                method: "GET",
                headers: {
                    email: localStorage.getItem("accountEmail"),
                    token: localStorage.getItem("token"),
                },
            }
        )
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                if (data.limit == -1) {
                    storageRatio = fileSizeShort(data.used);
                } else {
                    storageRatio = downloadProgressShort(data.used, data.limit);
                    const ratioVisualizer =
                        document.getElementById("ratioVisualizer");
                    ratioVisualizer.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${(data.used / data.limit) * 100}%,
  #088587 ${(data.used / data.limit) * 100}%,
  #088587 100%
)`;
                }
            });
    }
</script>

<div
    id="ratioVisualizer"
    class="bg-base-200 border-base-300 border-2 rounded-lg px-4 flex items-center w-44 font-semibold text-sm uppercase text-white gap-1.5"
>
    <HardDrive /> Using {storageRatio}
</div>
