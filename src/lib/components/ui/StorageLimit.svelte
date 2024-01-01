<script lang="ts">
  import { browser } from "$app/environment";
  import { downloadProgressShort, fileSizeShort } from "$lib/scripts/utils";
  import { apiurl, usingOcelot } from "$lib/scripts/req";
  import { HardDrive } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import { onMount } from "svelte";
  let storageRatio = "0/0mB";
  let theme = "dark";
  let res = {};
  onMount(() => {
    if (browser) {
      //this listens for whenever the theme is changed
      window.addEventListener("refreshTheme", () => {
        setTimeout(() => {
          setGradient();
        });
      });
      let baseurl = apiurl;
      if (usingOcelot)
        baseurl =
          JSON.parse(localStorage.getItem("serverNodes"))[
            localStorage.getItem("serverID")
          ] + "/";
      fetch(
        baseurl + "server/" + localStorage.getItem("serverID") + "/storageInfo",
        {
          method: "GET",
          headers: {
            username: localStorage.getItem("accountEmail"),
            token: localStorage.getItem("token"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          res = data;
          if (data.limit == -1) {
            storageRatio = fileSizeShort(data.used);
          } else {
            storageRatio = downloadProgressShort(data.used, data.limit);

            setGradient();
          }
        });
    }
  });

  function setGradient() {
    if (browser) {
      const ratioVisualizer = document.getElementById("ratioVisualizer");
      theme = localStorage.getItem("theme");
      console.log("refreshing theme" + theme);
      if (theme == "dark") {
        ratioVisualizer.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.0) ${(res.used / res.limit) * 100}%,
  #088587 ${(res.used / res.limit) * 100}%,
  #088587 100%
)`;
      } else if (theme == "light") {
        ratioVisualizer.style.background = `linear-gradient(
  to right,
  rgba(0, 0, 0, 0.9) 0%,
  rgba(0, 0, 0, 0.7) ${(res.used / res.limit) * 100}%,
  #088587 ${(res.used / res.limit) * 100}%,
  #088587 100%)`;
      }
    }
  }
</script>

<div
  id="ratioVisualizer"
  class="bg-base-200 border-base-300 border-2 rounded-lg px-4 flex items-center w-44 font-semibold text-sm uppercase text-white gap-1.5"
>
  <HardDrive />
  {$t("using")}
  {storageRatio}
</div>
