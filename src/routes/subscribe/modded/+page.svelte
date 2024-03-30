<script lang="ts">
  import { onMount } from "svelte";
  import { EmbeddedCheckout } from "svelte-stripe";
  import { loadStripe } from "@stripe/stripe-js";
  import { apiurl, stripeKey } from "$lib/scripts/req";
  import { ArrowLeft } from "lucide-svelte";
  import { browser } from "$app/environment";
  import PlanChooser from "$lib/components/ui/PlanChooser.svelte";

  let stripe = null;
  let clientSecret = null;
  let currency = "usd";
  let locale = "en";
  let email = "";
  onMount(async () => {
    if (browser) {
      email = localStorage.getItem("accountEmail");
      if (email.split(":")[0] == "email") {
        email = email.split(":")[1];
      } else {
        email = "";
      }

      if (localStorage.getItem("lang") != null) {
        locale = localStorage.getItem("lang");
      } else {
        locale = navigator.language;
      }
      locale = locale.split("-")[0];
    }
    stripe = await loadStripe(stripeKey);
    clientSecret = await fetch(
      apiurl +
        "checkout/modded" +
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
