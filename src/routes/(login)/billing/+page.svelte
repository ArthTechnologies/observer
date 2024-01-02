<script lang="ts">
  import { apiurl, customerPortalLink } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";

  let servers = [];
  var email: string = "";
  let promise = null;
  //gets subs and servers from localstorage
  var subs = {
    subscriptions: 0,
    basicSubscriptions: 0,
    moddedSubscriptions: 0,
  };
  let address;
  if (browser) {
    servers = JSON.parse(localStorage.getItem("servers"));
    address = localStorage.getItem("address");

    promise = fetch(apiurl + "servers/purchases", {
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
  <div class="flex flex-col grow items-center max-w-[55rem] mb-10 space-y-6">
    <h1 class="divider px-10 text-3xl font-semibold">{$t("bill.title")}</h1>
    <div class="px-6 py-4 bg-base-200 rounded-xl w-3/4 shadow">
      <div>{$t("subscriptions")}</div>
      <div class="flex gap-1">
        {#await promise}
          <div
            class="bg-slate-700 animate-pulse
           w-14 h-5 rounded-md"
          ></div>
        {:then}
          {#if subs.subscriptions > 0 && subs.basicSubscriptions == 0 && subs.moddedSubscriptions == 0}
            {#each Array(subs.subscriptions) as server}
              <div
                class="bg-gradient-to-tr from-orange-500 to-pink-600 w-min px-1.5 rounded-md text-sm text-black font-bold"
              >
                {subs.subscriptions.length}
              </div>
            {/each}
          {/if}
          {#each Array(subs.basicSubscriptions) as server}
            <div
              class="bg-gradient-to-tr from-orange-500 to-pink-600 w-min px-1.5 rounded-md text-sm text-black"
            >
              {$t("basic")}
            </div>
          {/each}

          {#each Array(subs.moddedSubscriptions) as server}
            <div
              class="bg-gradient-to-tr from-cyan-500 to-indigo-600 w-min px-1.5 rounded-md text-sm text-black"
            >
              {$t("modded")}
            </div>
          {/each}
        {/await}
      </div>

      <div class="mt-1">{$t("navbar.servers")}</div>
      <div class="flex gap-1">
        {#each servers as server}
          {#if JSON.stringify(server).includes(":not created yet")}
            <div
              class="bg-base-300 w-min px-1.5 rounded-md text-sm text-gray-500"
            >
              {address}:{10000 + parseInt(server.id)}
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
      class="flex flex-wrap justify-center button-container sm:space-x-3 w-[90%]"
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
</div>
