<script lang="ts">
  import { onMount } from "svelte";
  import { EmbeddedCheckout } from "svelte-stripe";
  import { loadStripe } from "@stripe/stripe-js";
  import { apiurl, stripeKey } from "$lib/scripts/req";
  import { ArrowLeft } from "lucide-svelte";
  import { browser } from "$app/environment";
  import PlanChooser from "$lib/components/ui/PlanChooser.svelte";
  import { alert } from "$lib/scripts/utils";

  let stripe = null;
  let clientSecret = null;
  let currency = "usd";
  let locale = "en";
  let email = "";
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
      if (email == undefined)
        alert(
          "We were unable to get your email from Discord. Please try again with an email account."
        );
      stripe = await loadStripe(stripeKey);
      clientSecret = await fetch(
        apiurl +
          "checkout/basic" +
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
</script>

<div class="flex">
  <div class="hidden md:flex w-1/2 min-h-screen">
    <PlanChooser />
  </div>
  <div
    class="bg-[#525f7f] max-md:w-screen md:w-1/2 min-h-screen pt-10 pb-16 relative"
  >
    <a
      href="/subscribe/choosePlan"
      class="absolute top-2 left-2 btn btn-ghost btn-sm md:hidden"
      ><ArrowLeft class="mr-1.5" size="18" /> Back</a
    >
    <EmbeddedCheckout {stripe} {clientSecret} />
  </div>
</div>
