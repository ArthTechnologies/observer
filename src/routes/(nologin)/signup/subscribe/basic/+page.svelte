<script lang="ts">
  import { onMount } from "svelte";
  import { EmbeddedCheckout } from "svelte-stripe";
  import { loadStripe } from "@stripe/stripe-js";
  import { apiurl, stripeKey } from "$lib/scripts/req";
  import { AlertTriangle, ArrowLeft, Info } from "lucide-svelte";
  import { browser } from "$app/environment";
  import PlanChooser from "$lib/components/ui/PlanChooser.svelte";
  import { alert } from "$lib/scripts/utils";
  import { t } from "$lib/scripts/i18n";
    import PlanChooserOld from "$lib/components/ui/PlanChooserOld.svelte";

  let stripe = null;
  let clientSecret = null;
  let currency = "usd";
  let locale = "en";
  let email = "";
  let noEmail = false;
  onMount(async () => {
    if (browser) {
      if (localStorage.getItem("currency") == null) {
        fetch("https://ip2c.org/s")
          .then((response) => response.text())
          .then((data) => {
            if (data.split(";")[1] == "MX") {
              localStorage.setItem("currency", "mxn");
              currency = "mxn";
            } else {
              localStorage.setItem("currency", "usd");
              currency = "usd";
            }
          });
      } else {
        currency = localStorage.getItem("currency");
      }

      if (localStorage.getItem("lang") != null) {
        locale = localStorage.getItem("lang");
      } else {
        locale = navigator.language;
      }
      locale = locale.split("-")[0];

      email = localStorage.getItem("email");
      if (email == undefined || email == "undefined") {
        noEmail = true;
        return;
      }
      let priceId;

      let billQuarterly = localStorage.getItem("billQuarterly");
      if (billQuarterly == "true") {
        priceId = "price_1R2G07JYPXquzaSz2ABwCb0U";
      } else {
        priceId = "price_1R2FxgJYPXquzaSzQyzJBmsx";
      }
      stripe = await loadStripe(stripeKey);
      clientSecret = await fetch(
        apiurl +
          "checkout/" +
          priceId +
          "?customer_email=" +
          email +
          "&currency=" +
          currency +
          "&locale=" +
          locale,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data);

          return data.clientSecret;
        });
    }
  });

  function emailSubmit() {
    email = document.getElementById("emailInput").value;
    if (email == "" || !email.includes("@") || !email.includes(".")) {
      alert("Please enter a valid address.", "error");
      return;
    }
    localStorage.setItem("email", email.toLowerCase());
    fetch(apiurl + "accounts/email?email=" + email, {
      method: "POST",
      headers: {
        accountname: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    }).then((res) => {
      if (res.status == 200) {
        location.reload();
      } else {
        alert("An error occurred. Please try again.", "error");
      }
    });
  }
</script>

<div class="flex relative">
  <div class="hidden min-[1080px]:flex w-1/3 min-h-screen">
<PlanChooser/>
  </div>
  <div
    class="bg-[#525f7f] max-[1080px]:w-screen min-[1080px]:w-2/3 min-h-screen pt-10 pb-16 relative"
  >
    <a
      href="/signup/subscribe/choosePlan"
      class="absolute top-2 left-2 btn btn-ghost btn-sm min-[1080px]:hidden"
      ><ArrowLeft class="mr-1.5" size="18" /> Back</a
    >
    <EmbeddedCheckout {stripe} {clientSecret} />
  </div>
  {#if noEmail}
    <div
      class="z-50 absolute w-full h-full backdrop-blur-sm backdrop-brightness-[0.35] flex items-center justify-center"
      style="margin:0rem;"
    >
      <div
        class="bg-base-100 rounded-xl p-5 bg-opacity-95 backdrop-blur relative"
      >
        <h3 class="text-xl font-bold">Billing Email</h3>
        <div
          class="bg-info w-[32rem] h-16 rounded-lg text-black p-2 flex items-center mb-6 space-x-2 mt-2"
        >
          <Info size="48" />
          <span class="text-sm"
            >We were unable to get your email from Discord, so you need to enter
            an email address for billing purposes. You won't need this to sign
            in.</span
          >
        </div>
        <div class="flex gap-1">
          <input
            type="text"
            id="emailInput"
            class="input input-bordered mr-1"
            placeholder={$t("signin.l.email")}
          />

          <button on:click={emailSubmit} class="btn btn-neutral">Submit</button>
        </div>
      </div>
    </div>
  {/if}
</div>
