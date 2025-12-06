<script lang="ts">
  import { browser } from "$app/environment";
  import {
    apiurl,
    setInfo,
    usingOcelot,
    getServerNode,
  } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { ClipboardList, Info, AlertCircle } from "lucide-svelte";
  import { onMount } from "svelte";
  import { alert } from "$lib/scripts/utils";
  import DeleteServer from "$lib/components/ui/DeleteServer.svelte";
  import SettingsLayout from "./SettingsLayout.svelte";
  import SettingsScheduler from "./SettingsScheduler.svelte";

  let id: string;
  let icon = "";
  let iconPreview = "/images/placeholder.webp";
  let desc = "";
  let fSecret = "";
  let proxiesEnabled = false;
  let activeSection = "general";

  let software: string;
  let name: string;
  let subdomain: string;
  let address = "arthmc.xyz";
  let allowedAccounts: string[] = [];
  let userNode: string;
  let numberIp = "Loading";
  let javaVersion = "0";
  export let type = "smallBtn";

  if (browser) {
    name = localStorage.getItem("serverName") || "";
    id = localStorage.getItem("serverID") || "";
    software = localStorage.getItem("serverSoftware") || "";
    address = localStorage.getItem("address") || "arthmc.xyz";
    subdomain = localStorage.getItem("serverSubdomain") || "";
    userNode = localStorage.getItem("userNode") || "";
    get();
    if (userNode) {
      fetch("https://dns.google/resolve?name="+userNode?.split("://")[1].split("/")[0]+"&type=A")
        .then((x) => x.json())
        .then((x) => {
          if (x.Answer?.[0]) numberIp = x.Answer[0].data;
        })
        .catch(() => {
          numberIp = "Unable to resolve";
        });
    }
  }
  function get() {
    let baseurl = apiurl;
    if (usingOcelot) baseurl = getServerNode(id);
    const url = baseurl + "server/" + id + "/settings";
    fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        token: localStorage.getItem("token"),
        username: localStorage.getItem("accountEmail"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        desc = data.desc;
        fSecret = data.secret;
        allowedAccounts = data.allowedAccounts;
        javaVersion = data.javaVersion; 

        if (document.getElementById("fSecret") != null) {
       
        document.getElementById("fSecret").value = data.secret;
      }
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
        desc = document.getElementById("rawDesc")?.innerText;
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

      console.log(icon == "");
      if (icon == "") {
        icon = "https://servers.arthmc.xyz/images/placeholder.webp";
      }
      let newName = name;
      setInfo(id, icon, desc, proxiesEnabled, fSecret, javaVersion, newName);



      alert("Settings applied.", "success");
    }
  }

  function claimSubdomain() {

    try {let baseUrl = userNode.split("://")[1].split("/")[0].split(".")[0];
    console.log("claiming subdomain" + baseUrl);
    const subdomain2 = document.getElementById("subdomainInput").value;
    fetch(apiurl + "server/" + id + "/claimSubdomain?subdomain=" + subdomain2+"&baseUrl="+baseUrl, {
      method: "POST",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((x) => x.json())
      .then((x) => {
        if (x.msg == "Done") {
          localStorage.setItem("serverSubdomain", subdomain2);

          window.location.reload();
        } else {
          alert("Error: " + x.msg);
        }
      }); }catch(e) {
      alert("Error: " + e);
      }
  }

  function deleteSubdomain() {
    fetch(apiurl + "server/" + id + "/deleteSubdomain?subdomain=" + subdomain, {
      method: "POST",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((x) => x.json())
      .then((x) => {
        if (x.msg == "Done") {
          localStorage.removeItem("serverSubdomain");

          window.location.reload();
        } else {
          alert("Error: " + x.msg);
        }
      });
  }

  function copyChar() {
    navigator.clipboard.writeText("§");
  }

  function allowAccount() {
    const account = document.getElementById("allowAccountInput").value;
    //clear input
    document.getElementById("allowAccountInput").value = "";
    fetch(apiurl + "server/" + id + "/allowAccount?accountId=" + account, {
      method: "POST",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((x) => x.json())
      .then((x) => {
        if (x.msg == "Done") {
          window.location.reload();
        } else {
          alert("Error: " + x.msg);
        }
      });
  }
</script>

<SettingsLayout bind:activeSection>
  <div slot="general" class="space-y-6">
    <!-- Header with Apply Button -->
    <div class="flex items-start justify-between">
      <div>
        <h2 class="text-2xl font-bold">General Settings</h2>
        <p class="text-sm text-gray-400 mt-1">Manage your server's basic settings</p>
      </div>
      <button
        class="btn btn-primary btn-sm"
        on:click={set}
      >
        {$t("apply")}
      </button>
    </div>

    <!-- Warning Alert -->
    <div class="alert alert-info gap-3">
      <Info size={20} />
      <span>{$t("settings.restartWarning")}</span>
    </div>

    <!-- Basic Settings Section -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Basic Information</h3>

      <div class="space-y-2">
        <label for="serverName" class="block text-sm font-semibold">
          {$t("settings.l.name")}
        </label>
        <input
          bind:value={name}
          type="text"
          id="serverName"
          class="input input-bordered w-full"
          placeholder="Enter server name"
        />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label for="javaVersion" class="block text-sm font-semibold">
            Java Version
          </label>
          <input
            bind:value={javaVersion}
            type="text"
            id="javaVersion"
            class="input input-bordered w-full"
            placeholder="11, 16, 17, 21..."
          />
        </div>

        <div class="space-y-2">
          <label class="block text-sm font-semibold">
            Server IP Address
          </label>
          <div class="input input-bordered flex items-center cursor-text bg-base-200 opacity-75">
            {numberIp}
          </div>
        </div>
      </div>
    </div>

    <!-- Subdomain Section -->
    <div class="divider"></div>
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Subdomain Management</h3>

      <div class="flex gap-3">
        {#if subdomain}
          <div class="badge badge-lg badge-success">
            {subdomain}.{address}
          </div>
          <button class="btn btn-sm btn-error" on:click={deleteSubdomain}>
            Delete
          </button>
        {:else}
          <label class="input input-bordered flex items-center gap-2 flex-1">
            <input type="text" class="grow" id="subdomainInput" placeholder="subdomain" />
            <span class="text-xs text-gray-500">.{address}</span>
          </label>
          <button class="btn btn-sm btn-neutral" on:click={claimSubdomain}>
            Claim
          </button>
        {/if}
      </div>
    </div>

    <!-- Access Control Section -->
    <div class="divider"></div>
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Panel Access Control</h3>

      <div class="space-y-3">
        {#if allowedAccounts && allowedAccounts.length > 0}
          <div class="space-y-2">
            {#each allowedAccounts as account (account)}
              <div class="flex items-center gap-2 p-2 bg-base-200 rounded-lg">
                <div class="badge badge-neutral">{account.split(":")[0]}</div>
                <span class="flex-1 text-sm">{account.split(":")[1]}</span>
              </div>
            {/each}
          </div>
        {/if}

        <div class="flex gap-2">
          <input
            id="allowAccountInput"
            type="text"
            placeholder="Enter Account ID"
            class="input input-bordered input-sm flex-1"
          />
          <button class="btn btn-sm btn-primary" on:click={allowAccount}>
            Add Access
          </button>
        </div>
      </div>
    </div>

    <!-- Server Info Section -->
    <div class="space-y-6 mt-8 pt-6 border-t border-base-200">
      <div>
        <h2 class="text-xl font-bold mb-2">{$t("settings.h.serverInfo")}</h2>
        <p class="text-sm text-gray-400">{$t("settings.desc.serverInfo")}</p>
      </div>

      <!-- Server Description -->
      <div class="space-y-3">
        <label for="serverDescription" class="block text-sm font-semibold">
          {$t("description")}
        </label>

        {#if software !== "Velocity"}
          <div class="flex flex-wrap gap-2 p-3 bg-base-200 rounded-lg">
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold bg-neutral px-2 py-1 rounded nocopy">§l</span>
              <span class="text-xs text-gray-400">{$t("bold")}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold bg-neutral px-2 py-1 rounded nocopy">§o</span>
              <span class="text-xs text-gray-400">{$t("italic")}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold bg-neutral px-2 py-1 rounded nocopy">§k</span>
              <span class="text-xs text-gray-400">{$t("glitchEffect")}</span>
            </div>
            <div class="flex items-center gap-1">
              <span class="text-xs font-bold bg-neutral px-2 py-1 rounded nocopy">§r</span>
              <span class="text-xs text-gray-400">{$t("reset")}</span>
            </div>
            <button class="btn btn-xs btn-ghost ml-auto" on:click={copyChar}>
              <ClipboardList size="16" />
              {$t("button.copyCharacter")}
            </button>
          </div>
        {/if}

        <textarea
          class="textarea textarea-bordered w-full h-24"
          bind:value={desc}
          id="serverDescription"
          placeholder="Enter server description..."
        ></textarea>
      </div>

      <!-- Server Icon -->
      <div class="space-y-3">
        <label for="serverIcon" class="block text-sm font-semibold">
          {$t("settings.l.icon")}
          <p class="font-normal text-xs text-gray-400 mt-0.5">{$t("settings.desc.icon")}</p>
        </label>
        <div class="flex gap-3 items-end">
          <input
            bind:value={icon}
            type="text"
            id="serverIcon"
            class="input input-bordered flex-1"
            placeholder={$t("settings.p.enterURL")}
          />
          <img src={iconPreview} alt="Server icon preview" class="h-12 w-12 rounded-lg object-cover" />
        </div>
      </div>
    </div>

    <!-- Advanced Settings (Paper only) -->
    {#if software === "Paper"}
      <div class="space-y-6 mt-8 pt-6 border-t border-base-200">
        <div>
          <h2 class="text-xl font-bold">{$t("settings.h.advancedSettings")}</h2>
          <p class="text-sm text-gray-400">{$t("settings.desc.proxies")}</p>
        </div>

        <div class="space-y-4">
          <label class="cursor-pointer flex items-center gap-3 p-4 rounded-lg hover:bg-base-200 transition">
            <input
              id="proxiesEnabled"
              type="checkbox"
              class="toggle toggle-primary"
              bind:checked={proxiesEnabled}
            />
            <span class="text-sm font-semibold">{$t("settings.l.enableProxies")}</span>
          </label>

          <div class="space-y-2">
            <label for="fSecret" class="block text-sm font-semibold">
              {$t("forwardingSecret")}
            </label>
            <input
              bind:value={fSecret}
              type="text"
              id="fSecret"
              class="input input-bordered w-full"
              placeholder="Enter forwarding secret..."
            />
          </div>
        </div>
      </div>
    {:else if software !== "Velocity"}
      <div class="mt-8 pt-6 border-t border-base-200">
        <p class="text-sm text-gray-400">{$t("settings.l.noProxies")}</p>
      </div>
    {/if}

    <!-- Danger Zone -->
    <div class="space-y-6 mt-8 pt-6 border-t-2 border-error/20">
      <div>
        <h2 class="text-xl font-bold text-error">Delete Server</h2>
        <p class="text-sm text-gray-400">This is irreversible</p>
      </div>
      <DeleteServer />
    </div>
  </div>

  <!-- Scheduler Section (Empty placeholder) -->
  <div slot="scheduler">
    <SettingsScheduler />
  </div>
</SettingsLayout>


<style lang="scss">
  .nocopy {
    user-select: none;
  }
</style>
