<script lang="ts">
  import { apiurl, customerPortalLink } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { ClipboardList, MessagesSquare } from "lucide-svelte";

  let servers = [];
  var email: string = "";
  let promise = null;
  let accountID;
  //gets subs and servers from localstorage
  var subs = {
    subscriptions: 0,
    basicSubscriptions: 0,
    moddedSubscriptions: 0,
  };
  let address;
  if (browser) {
    accountID = localStorage.getItem("accountId");
    servers = JSON.parse(localStorage.getItem("servers"));
    address = localStorage.getItem("address");

    promise = fetch(apiurl + "info/subscriptions", {
      method: "GET",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        console.log(json);
        subs = json;
      });

    //sets email to the value of localstorage.getItem("email")

    email = localStorage.getItem("accountEmail");
    console.log(email);
  }
  function subscribe() {
    //sets localstorage item "subscribed" to true
    if (browser) {
      localStorage.setItem("subscribed", "true");
    }
  }

  //turn all @s into %40s
  email = email.replace("@", "%40");
</script>

<div class="flex place-content-center">
  <div class="flex flex-col grow max-w-[55rem] space-y-6">
    <div class="flex flex-col items-center">
      <h1 class="divider px-10 text-3xl font-semibold">{$t("bill.title")}</h1>
      <div class="px-6 py-4 bg-base-200 rounded-xl w-3/4 shadow mt-6">
        <div>{$t("subscriptions")}</div>
        <div class="flex gap-1">
          {#await promise}
            <div
              class="bg-slate-700 animate-pulse
           w-14 h-5 rounded-md"
            ></div>
          {:then}
            {#if subs.subscriptions > 0 && subs.basicSubscriptions == 0 && subs.moddedSubscriptions == 0}
              <div
                class="bg-gradient-to-tr from-orange-500 to-pink-600 w-min px-1.5 rounded-md text-sm text-black font-bold"
              >
                {subs.subscriptions}
              </div>
            {/if}
            {#if subs.basicSubscriptions > 0}
              <div
                class="bg-gradient-to-tr from-orange-400 to-pink-500 px-1.5 rounded-md text-sm text-black"
              >
                {subs.basicSubscriptions}x {$t("basic")}
              </div>
            {/if}

            {#if subs.moddedSubscriptions > 0}
              <div
                class="bg-gradient-to-tr from-cyan-400 to-indigo-500 px-1.5 rounded-md text-sm text-black"
              >
                {subs.moddedSubscriptions}x {$t("modded")}
              </div>
            {/if}

            {#if subs.freeServers > 0}
              <div class="bg-success px-1.5 rounded-md text-sm text-black">
                {subs.freeServers}x {$t("free")}
              </div>
            {/if}
          {/await}
        </div>

        <div class="mt-1">{$t("navbar.servers")}</div>
        <div class="flex gap-1">
          {#each servers as server}
            {#if JSON.stringify(server).includes(":not created yet")}
              <div
                class="bg-base-300 w-min px-1.5 rounded-md text-sm text-gray-500"
              >
                {address}:{10000 + parseInt(server.split(":")[0])}
              </div>
            {:else}
              <div class="bg-base-300 w-min px-1.5 rounded-md text-sm">
                {address}:{10000 + parseInt(server.id)}
              </div>
            {/if}
          {/each}
        </div>
      </div>
      <div
        class="flex flex-wrap justify-center button-container sm:space-x-3 w-[90%] mt-6"
      >
        {#if customerPortalLink != ""}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="{customerPortalLink}?prefilled_email={email}"
            class="btn btn-neutral grow md:grow sm:w-44 ml-1 md:m-0"
            >{$t("button.manage")}</a
          >
        {/if}

        <a
          href="/subscribe"
          class="btn btn-success btn-block md:grow sm:w-44 mt-2.5 sm:m-0"
          on:click={subscribe}
        >
          {#if subs == 0}
            {$t("button.subscribe")}
          {:else}
            {$t("button.newsubscribe")}
          {/if}
        </a>
      </div>
    </div>
    <div class="ml-12 py-8 space-y-2">
      <div class="flex items-center gap-2 font-bold text-xl">
        <MessagesSquare />Refunds & Disputes
      </div>
      <ul class="list-disc pl-[1.45rem]">
        <li>
          Arth Hosting offers refunds for major technical issues experienced
        </li>
        <li>Other issues are on a case-by-case basis</li>
        <li class="relative">
          Contact <b>support@arthmc.xyz</b> to request a refund and include your
          Account ID
          <button
            class="btn btn-xs btn-neutral ml-2 absolute"
            on:click={() => {
              navigator.clipboard.writeText(accountID);
            }}
            ><ClipboardList size="16" class="mr-1" />
            {$t("button.copyToClipboard")}</button
          >
        </li>
        <li>
          Disputing a payment with your bank before attempting to request a
          refund may result in termination of service
        </li>
      </ul>
    </div>
  </div>
</div>
