<script lang="ts">
  import { apiurl, customerPortalLink } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { ClipboardList, MessagesSquare } from "lucide-svelte";

  let servers = [];
  var email: string = "";
  let promise = null;
  let accountId;
  //gets subs and servers from localstorage
  var subs = {
    subscriptions: [],
    servers: [],
  };
  let address;
  if (browser) {
    accountId = localStorage.getItem("accountId");
    servers = JSON.parse(localStorage.getItem("servers"));
    address = localStorage.getItem("address");

    promise = fetch(apiurl + "info/billing", {
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
      <div class="flex px-6 py-4 bg-base-100 rounded-xl w-3/4 shadow mt-6">
<div class="w-1/2">    
      <div class="font-poppins mb-1.5">{$t("subscriptions")}</div>
<div class="flex gap-1">
  {#await promise}
    <div
      class="bg-slate-700 animate-pulse
   w-14 h-5 rounded-md"
    ></div>
  {:then}
    {#each subs.subscriptions as subscription}
      <div class="bg-base-300 p-1.5 rounded-md">
       <p class="font-poppins-bold text-sm text-gray-200">
        {subscription.name.charAt(0).toUpperCase() + subscription.name.slice(1)} Plan
        </p>
        <p class="text-sm">
          {subscription.price} {subscription.currency} / {subscription.interval}
        </p>
        <p class="text-sm">
          Status: {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}  
</p>
      </div>  
    {/each}
  {/await}
</div>
</div>

 <div class="w-1/2">
  <div class="font-poppins mb-1.5">{$t("navbar.servers")}</div>
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
      </div>
      <div
        class="flex flex-wrap justify-center button-container sm:space-x-3 w-[90%] mt-6"
      >
        {#if customerPortalLink != ""}
          <a
            id="manage"
            target="_blank"
            rel="noopener noreferrer"
            href="{customerPortalLink}?prefilled_email={email}"
            class="btn btn-neutral grow md:grow sm:w-44 ml-1 md:m-0"
            >{$t("button.manage")}</a
          >
        {/if}

        <a
          id="subscribe"
          href="/signup/subscribe"
          class="btn btn-success btn-block md:grow sm:w-44 mt-2.5 sm:m-0"
          on:click={subscribe}
        >
          {#if subs.subscriptions == 0}
            {$t("button.subscribe")}
          {:else}
            {$t("button.newsubscribe")}
          {/if}
        </a>
      </div>
    </div>
    <div id="refunds" class=" md:ml-12 py-8 space-y-2">
      <div class="flex items-center gap-2 font-bold text-xl">
        <MessagesSquare />{$t("bill.refunds.title")}
      </div>
      <ul class="list-disc pl-[1.45rem]">
        <li>
          {$t("bill.refunds.1")}
        </li>
        <li>
          {$t("bill.refunds.2")}
        </li>
        <li class="relative max-lg:mb-8">
          {$t("bill.refunds.3a")}
          <b>{$t("bill.refunds.3b")}</b>
          {$t("bill.refunds.3c")}
          <button
            class="btn btn-xs btn-neutral ml-2 absolute max-lg:-bottom-7 max-lg:-left-2"
            on:click={() => {
              navigator.clipboard.writeText(accountId);
            }}
            ><div class="flex items-center" style="text-wrap: nowrap;">
              <ClipboardList size="16" class="mr-1" />
              {$t("button.copyToClipboard")}
            </div></button
          >
        </li>
        <li>
          {$t("bill.refunds.4")}
        </li>
      </ul>
    </div>
  </div>
</div>
