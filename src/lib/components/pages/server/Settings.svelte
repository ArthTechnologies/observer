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
  let startupFlags = "";
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
        startupFlags = data.startupFlags || "";

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

  function setStartupFlags() {
    fetch(apiurl + "server/" + id + "/settings/setStartupFlags", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ flags: startupFlags }),
    })
      .then((x) => x.json())
      .then((x) => {
        if (x.msg === "Done") {
          alert("Startup flags saved successfully", "success");
        } else {
          alert("Error: " + x.msg);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
      });
  }

  function setJavaVersion() {
    fetch(apiurl + "server/" + id + "/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
      body: JSON.stringify({ javaVersion: parseInt(javaVersion) }),
    })
      .then((x) => x.json())
      .then((x) => {
        if (x.msg === "Done") {
          alert("Java version updated. Restart the server for changes to take effect.", "success");
        } else {
          alert("Error: " + x.msg);
        }
      })
      .catch((err) => {
        alert("Error: " + err);
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

  <!-- Network Section -->
  <div slot="dns" class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold">Network</h2>
      <p class="text-sm text-gray-400 mt-1">Manage your server's network settings and access points</p>
    </div>

    <!-- Subdomain Management -->
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold mb-2">Subdomain</h3>
        <p class="text-sm text-gray-400 mb-4">Claim a subdomain for easy access to your server</p>
      </div>

      <div class="bg-base-200 rounded-lg p-4 space-y-3">
        {#if subdomain}
          <div class="flex items-center justify-between">
            <div class="space-y-1">
              <p class="text-sm text-gray-400">Your subdomain</p>
              <div class="badge badge-lg badge-success">
                {subdomain}.{address}
              </div>
            </div>
            <button class="btn btn-sm btn-error" on:click={deleteSubdomain}>
              Delete Subdomain
            </button>
          </div>
        {:else}
          <div class="flex gap-3 items-center">
            <label class="input input-bordered flex items-center gap-2 flex-1">
              <input type="text" class="grow" id="subdomainInput" placeholder="Choose subdomain" />
              <span class="text-xs text-gray-500">.{address}</span>
            </label>
            <button class="btn btn-sm btn-primary" on:click={claimSubdomain}>
              Claim Subdomain
            </button>
          </div>
        {/if}
      </div>
    </div>

    <!-- Server IP Address Section -->
    <div class="divider"></div>
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold">Server IP Address</h3>
        <p class="text-sm text-gray-400 mt-1">Your server's resolved IP address</p>
      </div>

      <div class="bg-base-200 rounded-lg p-4">
        <div class="flex items-center justify-between p-3 bg-base-300 rounded-lg">
          <span class="font-semibold">IP Address</span>
          <div class="font-mono text-lg font-bold">{numberIp}</div>
        </div>
      </div>
    </div>

    <!-- Ports Section -->
    <div class="divider"></div>
    <div class="space-y-4">
      <div>
        <h3 class="text-lg font-semibold">Server Ports</h3>
        <p class="text-sm text-gray-400 mt-1">Your allocated server ports for connections</p>
      </div>

      <div class="bg-base-200 rounded-lg p-4 space-y-3">
        <!-- Main Port -->
        <div class="flex items-center justify-between p-3 bg-base-300 rounded-lg hover:bg-base-300/80 transition">
          <span class="font-semibold">Main Port</span>
          <div class="font-mono text-lg font-bold">{parseInt(id) + 10000}</div>
        </div>

        <!-- Extra Port 1 -->
        <div class="flex items-center justify-between p-3 bg-base-300 rounded-lg hover:bg-base-300/80 transition">
          <span class="font-semibold">Extra Port 1</span>
          <div class="font-mono text-lg font-bold">{parseInt(id) + 10033}</div>
        </div>

        <!-- Extra Port 2 -->
        <div class="flex items-center justify-between p-3 bg-base-300 rounded-lg hover:bg-base-300/80 transition">
          <span class="font-semibold">Extra Port 2</span>
          <div class="font-mono text-lg font-bold">{parseInt(id) + 10066}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Sub-Users Section -->
  <div slot="access" class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold">Sub-Users</h2>
      <p class="text-sm text-gray-400 mt-1">Grant other players access to manage this server</p>
    </div>

    <!-- Allowed Accounts -->
    <div class="space-y-4">
      <div class="bg-base-200 rounded-lg p-4 space-y-3">
        {#if allowedAccounts && allowedAccounts.length > 0}
          <div class="space-y-2 mb-4">
            <p class="text-sm font-semibold text-gray-300">Current Sub-Users</p>
            {#each allowedAccounts as account (account)}
              <div class="flex items-center justify-between p-3 bg-base-300 rounded-lg">
                <div class="flex flex-col gap-1">
                  <span class="badge badge-neutral">{account.split(":")[0]}</span>
                  <span class="text-xs text-gray-400">{account.split(":")[1]}</span>
                </div>
                <button class="btn btn-xs btn-error" on:click={() => {/* Remove access functionality */}}>
                  Remove
                </button>
              </div>
            {/each}
          </div>
          <div class="divider my-3"></div>
        {/if}

        <div class="space-y-2">
          <label for="allowAccountInput" class="block text-sm font-semibold">
            Add Sub-User
          </label>
          <p class="text-xs text-gray-400 mb-2">Enter an account ID to add them as a sub-user</p>
          <div class="flex gap-2">
            <input
              id="allowAccountInput"
              type="text"
              placeholder="Enter Account ID"
              class="input input-bordered input-sm flex-1"
            />
            <button class="btn btn-sm btn-primary" on:click={allowAccount}>
              Add Sub-User
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Sub-Users Info -->
    <div class="alert alert-info gap-3">
      <Info size={20} />
      <span>Sub-users can manage all operations except deleting the server</span>
    </div>
  </div>

  <!-- Advanced Section -->
  <div slot="advanced" class="space-y-6">
    <!-- Header -->
    <div>
      <h2 class="text-2xl font-bold">Advanced Settings</h2>
      <p class="text-sm text-gray-400 mt-1">Fine-tune your server's Java configuration and startup parameters</p>
    </div>

    <!-- Java Version -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Java Version</h3>
      <div class="bg-base-200 rounded-lg p-4">
        <div class="space-y-2">
          <label for="javaVersionAdvanced" class="block text-sm font-semibold">
            Java Version
          </label>
          <div class="flex gap-2">
            <input
              bind:value={javaVersion}
              type="text"
              id="javaVersionAdvanced"
              class="input input-bordered flex-1"
              placeholder="11, 16, 17, 21..."
            />
            <button class="btn btn-primary" on:click={setJavaVersion}>
              Save
            </button>
          </div>
          <p class="text-xs text-gray-400">Server will restart to apply changes</p>
        </div>
      </div>
    </div>

    <!-- Startup Flags -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold">Startup Flags</h3>
      <div class="bg-base-200 rounded-lg p-4">
        <div class="space-y-2">
          <label for="startupFlagsInput" class="block text-sm font-semibold">
            JVM Startup Flags
          </label>
          <textarea
            bind:value={startupFlags}
            id="startupFlagsInput"
            class="textarea textarea-bordered w-full h-32 font-mono text-xs"
            placeholder="Enter JVM startup flags..."
          ></textarea>
          <button class="btn btn-primary w-full" on:click={setStartupFlags}>
            Save Startup Flags
          </button>
          <p class="text-xs text-gray-400">Server will restart to apply changes</p>
        </div>
      </div>
    </div>
  </div>

  <!-- Scheduler Section -->
  <div slot="scheduler">
    <SettingsScheduler />
  </div>
</SettingsLayout>


<style lang="scss">
  .nocopy {
    user-select: none;
  }
</style>
