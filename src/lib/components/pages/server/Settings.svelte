<script>
  import { browser } from "$app/environment";
  import {
    apiurl,
    setInfo,
    usingOcelot,
    getServerNode,
  } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
  import { ClipboardIcon, ClipboardList, Info, Settings } from "lucide-svelte";
  import { bind, onMount } from "svelte/internal";
  import { alert, handleDesc } from "$lib/scripts/utils";
  let id;
  let icon = "";
  let iconPreview = "/images/placeholder.webp";
  let desc = "";
  let fSecret = "";
  let proxiesEnabled = false;

  let software;
  let name;
  let subdomain;
  let address = "arthmc.xyz";
  let allowedAccounts = [];
  let userNode;
  let numberIp = "Loading";
  let javaVersion = "0";
  export let type = "smallBtn";
  if (browser) {
    name = localStorage.getItem("serverName");
    id = localStorage.getItem("serverID");
    software = localStorage.getItem("serverSoftware");
    address = localStorage.getItem("address");
    subdomain = localStorage.getItem("serverSubdomain");
   userNode = localStorage.getItem("userNode");
    get();
    fetch("https://dns.google/resolve?name="+userNode?.split("://")[1].split("/")[0]+"&type=A")
      .then((x) => x.json())
      .then((x) => {
        numberIp = x.Answer[0].data;
      });
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





  <div class="bg-base-100 rounded-xl p-3 w-full relative">

    <button
 
      class="btn btn-neutral btn-sm absolute right-2 top-2"
      on:click={set}>{$t("apply")}</button
    >

    <div class="flex p-1 text-sm items-center gap-1.5 mb-1.5">
      <Info size="16" />
      <span>{$t("settings.restartWarning")}</span>
    </div>
    <label for="serverDescription" class="block font-bold mb-2"
      >{$t("settings.l.name")}
    </label>

    <input
      bind:value={name}
      type="text"
      id="serverName"
      class="input input-bordered"
    />
        <label for="serverDescription" class="block font-bold my-2"
      >Java Version
    </label>

    <input
      bind:value={javaVersion}
      type="text"
      id="javaVersion"
      class="input input-bordered"
    />
    <label for="serverDescription" class="block font-bold mb-2 mt-4"
      >Number IP Address
    </label>
    {numberIp}
    <label for="serverDescription" class="block font-bold mb-2 mt-4"
      >Subdomain
    </label>

    <div class="flex gap-2 relative">
      {#if subdomain != undefined}
        <div
          class="h-12 p-6 w-fit rounded-xl bg-base-200 flex items-center justify-center"
        >
          {subdomain}
        </div>
        <button class="btn btn-error" on:click={deleteSubdomain}>Delete</button>
      {:else}
        <label class="input input-bordered flex items-center">
          <input type="text" class="bg-transparent w-32" id="subdomainInput" />
          <p class="opacity-80">.{address}</p>
        </label>
        <button class="btn btn-neutral" on:click={claimSubdomain}>Claim</button>
      {/if}
    </div>
    <label for="serverDescription" class="block font-bold mb-2 mt-4"
    >Accounts with Panel Access
  </label>
  {#if allowedAccounts != undefined}
  {#each allowedAccounts as account}
    <div class="flex items-center gap-2 mt-2">
      <p class="px-2 pb-0.5 rounded-lg bg-base-200">{account.split(":")[1]}</p>
      <p class="px-2 pb-0.5 rounded-lg bg-base-300">{account.split(":")[0]}</p>
    </div>
  {/each}
  {/if}
  <div class="flex items-center gap-2 mt-2">
    <input id="allowAccountInput" type="text" placeholder="Enter Account ID (Ex: 73190d64-95ee-4857-a6e5-0848e9efb29a)" class="input input-bordered input-sm w-full max-w-xs" />
    <button class="btn btn-xs btn-neutral" on:click={allowAccount}>Add</button>
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
    {#if software != "Velocity"}
      <div class="mb-2 space-y-1 text-sm">
        <div class="flex space-x-1">
          <div class="flex">
            <div
              class="bg-neutral rounded-l pl-1.5 p-0.5 pr-2.5 font-bold nocopy"
            >
              {$t("bold")}
            </div>
            <div class="bg-base-300 rounded-r pl-1.5 p-0.5 w-8">§l</div>
          </div>
          <div class="flex">
            <div
              class="bg-neutral rounded-l pl-1.5 p-0.5 pr-2.5 font-bold nocopy"
            >
              {$t("italic")}
            </div>
            <div class="bg-base-300 rounded-r pl-1.5 p-0.5 w-8">§o</div>
          </div>
          <div class="flex">
            <div
              class="bg-neutral rounded-l pl-1.5 p-0.5 pr-2.5 font-bold nocopy"
            >
              {$t("glitchEffect")}
            </div>
            <div class="bg-base-300 rounded-r pl-1.5 p-0.5 w-8">§k</div>
          </div>
        </div>
        <div class="flex space-x-1">
          <div class="flex">
            <div
              class="bg-neutral rounded-l pl-1.5 p-0.5 pr-2.5 font-bold nocopy"
            >
              {$t("reset")}
            </div>
            <div class="bg-base-300 rounded-r pl-1.5 p-0.5 w-8">§r</div>
          </div>
          <div class="flex">
            <button class="btn btn-xs btn-ghost" on:click={copyChar}>
              <ClipboardList size="16" class="mr-1" />
              <p id="copyCharText">{$t("button.copyCharacter")}</p>
            </button>
          </div>
        </div>
      </div>
    {/if}

    <textarea
      class="textarea textarea-bordered w-full h-24 text-[.95rem]"
      bind:value={desc}
      id="serverDescription"
    ></textarea>

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
    {#if software == "Paper"}
      <h3 class="text-2xl font-bold mt-5">
        {$t("settings.h.advancedSettings")}
      </h3>
      <div class="divider mt-5 text-xl font-bold">
        {$t("settings.h.proxies")}
      </div>

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
        >{$t("forwardingSecret")}
      </label>
      <input
        bind:value={fSecret}
        type="text"
        id="fSecret"
        class="input input-bordered"
        placeholder={fSecret}
      />
    {:else if software != "Velocity"}<p class="my-4">
        {$t("settings.l.noProxies")}
      </p>
    {/if}
  </div>


<style>
  .nocopy {
    user-select: none;
  }
</style>
