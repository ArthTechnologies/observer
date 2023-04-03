<script lang="ts">
  import { createServer } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  let servers = 0;
  if (browser) {
    servers = localStorage.getItem("servers");
  }
  var email: string = "";
  //get subs and servers from localstorage
  var subs = 0;
  if (browser) {
    subs = localStorage.getItem("subs");
  }
  //set email to the value of localstorage.getItem("email") if window is defined
  if (browser) {
    email = localStorage.getItem("accountEmail");
    console.log(email);
  }
  function subscribe() {
    //set localstorage item "subscribed" to true if localstorage is defined
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
    <div class="stat bg-base-200 text-center rounded-xl w-3/4 shadow">
      <div class="stat-title">{$t("navbar.servers")}</div>
      <div class="stat-value">{servers}</div>
    </div>
    <div
      class="flex flex-wrap justify-center button-container sm:space-x-3 w-[90%]"
    >
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://billing.stripe.com/p/login/fZeaHs7161SWaWcaEE?prefilled_email={email}"
        class="btn grow md:grow sm:w-44 ml-1 md:m-0">{$t("button.manage")}</a
      >

      <a
        target="_blank"
        rel="noopener noreferrer"
        href="https://buy.stripe.com/dR63fv4bX3qjc1i28a?prefilled_email={email}&prefilled_promo_code=2023"
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
