<script>
  import { browser } from "$app/environment";
  import { apiurl, setInfo, usingOcelot } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { Settings } from "lucide-svelte";
  let id;
  let icon = "";
  let iconPreview = "/images/palceholder.webp";
  let desc = "";
  let fSecret = "";
  let proxiesEnabled = false;
  let automaticStartup = false;
  let software;
  let name;
  export let type = "smallBtn";
  if (browser) {
    name = localStorage.getItem("serverName");
    id = localStorage.getItem("serverID");
    software = localStorage.getItem("serverSoftware");
  }
  function get() {
    let baseurl = apiurl;
    if (usingOcelot)
      baseurl =
        JSON.parse(localStorage.getItem("serverNodes"))[id.toString()] + "/";
    const url = baseurl + "server/" + id + "/getInfo";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        email: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        desc = data.desc;
        fSecret = data.secret;

        //add checked property to toggle

        if (data.automaticStartup) {
          document.getElementById("automaticStartup").checked = true;
        } else {
          document.getElementById("automaticStartup").checked = false;
        }

        document.getElementById("fSecret").value = data.secret;
        if (data.iconUrl != undefined) {
          console.log("icon is " + data.iconUrl);
          icon = data.iconUrl;
        } else {
          console.log("setting placeholder");
          icon = "/images/placeholder.webp";
        }

        if (document.getElementById("proxiesEnabled") != null) {
          if (data.proxiesEnabled) {
            document.getElementById("proxiesEnabled").checked = true;
          } else {
            document.getElementById("proxiesEnabled").checked = false;
          }
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
      });
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
      if (document.getElementById("automaticStartup") != null) {
        if (document.getElementById("automaticStartup").checked) {
          automaticStartup = true;
        } else {
          automaticStartup = false;
        }
      }
      console.log(icon == "");
      if (icon == "") {
        icon = "https://servers.arthmc.xyz/images/placeholder.webp";
      }

      setInfo(id, icon, desc, proxiesEnabled, fSecret, automaticStartup);

      if (localStorage.getItem("serverName") != name) {
        fetch(apiurl + "server/" + id + "/rename?newName=" + name, {
          method: "POST",
          headers: {
            email: localStorage.getItem("accountEmail"),
            token: localStorage.getItem("token"),
          },
        })
          .then((x) => x.json())
          .then((x) => {
            //if successful
            if (!JSON.stringify(x).includes("ERROR")) {
              if (document.getElementById("serverName") != null) {
                document.getElementById("serverName").innerText = name;
              }
            }
          });
      }
    }
  }
</script>

{#if type == "smallBtn"}
  <label for="editInfo"
    ><div
      class="btn btn-neutral btn-circle absolute right-2 top-2 md:btn-sm"
      on:click={get}
    >
      <Settings class="w-[1.5rem] h-[1.5rem] md:w-[1rem] md:h-[1rem]" />
    </div></label
  >
{:else if type == "fullBtn"}
  <label for="editInfo"
    ><div class="btn btn-neutral" on:click={get}>
      <Settings class="mr-1.5" />{$t("button.settings")}
    </div></label
  >
{/if}

<input type="checkbox" id="editInfo" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label
      for="editInfo"
      class="btn btn-neutral btn-sm btn-circle fixed right-2 top-2">✕</label
    >
    <h3 class="text-2xl font-bold mb-3">{$t("button.settings")}</h3>
    <label for="serverDescription" class="block font-bold mb-2"
      >{$t("settings.l.name")}
    </label>
    <input
      bind:value={name}
      type="text"
      id="serverName"
      class="input input-bordered"
    />
    <div class=" w-96 mt-2">
      <label class="cursor-pointer flex items-center">
        <span class="label-text max-md:w-48 w-72"
          >{$t("settings.l.automaticStartup")}</span
        >
        <input
          id="automaticStartup"
          type="checkbox"
          class="toggle toggle-primary"
        />
      </label>
    </div>
    <div class="divider mt-3 text-xl font-bold">
      {$t("settings.h.serverInfo")}
    </div>
    <p class="mb-4">
      {$t("settings.desc.serverInfo")}
    </p>
    <label for="serverDescription" class="block font-bold mb-2"
      >{$t("description")}
    </label>
    <input
      bind:value={desc}
      type="text"
      id="serverDescription"
      class="input input-bordered"
    />
    <label for="serverIcon" class="block font-bold my-2"
      >{$t("settings.l.icon")}
      <p class="font-light">{$t("settings.desc.icon")}</p></label
    >
    <div class="flex space-x-2">
      <input
        bind:value={icon}
        type="text"
        id="serverIcon"
        class="input input-bordered"
        placeholder={$t("settings.p.enterURL")}
      />
      <img src={iconPreview} class="h-[3rem] w-[3rem] rounded-lg" />
    </div>
    <h3 class="text-2xl font-bold mt-5">{$t("settings.h.advancedSettings")}</h3>
    <div class="divider mt-5 text-xl font-bold">{$t("settings.h.proxies")}</div>
    {#if software == "Paper"}
      <p class="mb-4">{$t("settings.desc.proxies")}</p>
      <div class=" w-52">
        <label class="cursor-pointer label">
          <span class="label-text text-lg"
            >{$t("settings.l.enableProxies")}</span
          >
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
    {:else}<p class="mb-4">{$t("settings.l.noProxies")}</p>
    {/if}
    <div class="flex justify-end mt-4">
      <label on:click={set} for="editInfo" class="btn btn-primary"
        >{$t("save")}</label
      >
    </div>
  </div>
</div>
