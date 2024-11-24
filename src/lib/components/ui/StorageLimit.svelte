<script lang="ts">
  import { browser } from "$app/environment";
  import { downloadProgressShort, fileSizeShort } from "$lib/scripts/utils";
  import { apiurl, usingOcelot, getServerNode } from "$lib/scripts/req";
  import { HardDrive } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import { onMount } from "svelte";
  let storageRatio = "0/0mB";
  let theme = "dark";
  let res = {};
  let modsplugins = 0;
  let limit = 0;
  let first = 0;
  let second = 0;
  let third = 0;
  let firstColor = "bg-neutral";
  let secondColor = "bg-slate-500";
  let thirdColor = "bg-slate-700";
  let firstName = "Mods/Plugins";
  let secondName = "Worlds";
  let thirdName = "Misc";
  let misc = 0;
  onMount(() => {
    if (browser) {
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
            modsplugins = data.plugins + data.mods;
            limit = data.limit;
            misc = data.used - modsplugins - data.worlds;

            first = Math.max(modsplugins, data.worlds, misc);
            second = Math.min(modsplugins, data.worlds, misc);
            third = modsplugins + data.worlds + misc - first - second;

            if (first == modsplugins) {
              firstName = "Mods/Plugins";
            } else if (first == data.worlds) {
              firstName = "World";
            } else {
              firstName = "Misc";
            }

            if (second == modsplugins) {
              secondName = "Mods/Plugins";
            } else if (second == data.worlds) {
              secondName = "World";
            } else {
              secondName = "Misc";
            }

            if (third == modsplugins) {
              thirdName = "Mods/Plugins";
            } else if (third == data.worlds) {
              thirdName = "World";
            } else {
              thirdName = "Misc";
            }
          }
        });
    }
  });
</script>

<div
  id="ratioVisualizer"
  class="relative bg-base-300 border-base-100 border-2 rounded-lg px-4 flex items-center w-44 font-semibold text-sm uppercase text-gray-200 gap-1.5"
>
  <HardDrive class="z-[5]" />
  <span class="z-[5]">{$t("using")} {storageRatio}</span>

  <div
    class="absolute left-0 h-full {firstColor} z-[3] rounded-l-[0.4rem] tooltip"
    style="width: {(first / limit) * 100}%"
    data-tip={firstName}
  ></div>
  <div
    class="absolute left-0 h-full {secondColor} z-[2] rounded-l-xl tooltip"
    style="width: {(second / limit) * 100 + (first / limit) * 100}%;"
    data-tip={secondName}
  ></div>
  <div
    class="absolute left-0 h-full {thirdColor} z-[1] rounded-l-xl tooltip"
    style="width: {(third / limit) * 100 +
      (second / limit) * 100 +
      (first / limit) * 100}%"
    data-tip={thirdName}
  ></div>
</div>
