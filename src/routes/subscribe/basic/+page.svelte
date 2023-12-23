<script lang="ts">
  import { onMount } from "svelte";
  import { EmbeddedCheckout } from "svelte-stripe";
  import { loadStripe } from "@stripe/stripe-js";
  import { apiurl, stripeKey } from "$lib/scripts/req";
  import { ArrowLeft } from "lucide-svelte";
  import { browser } from "$app/environment";

  let stripe = null;
  let clientSecret = null;
  onMount(async () => {
    stripe = await loadStripe(stripeKey);
    clientSecret = await fetch(apiurl + "checkout/basic", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);

        return data.clientSecret;
      });
  });
</script>

<div class="bg-[#525f7f] w-screen min-h-screen pt-10 pb-16 relative">
  <a
    href="/subscribe"
    class="absolute top-2 left-2 btn btn-ghost btn-sm md:hidden"
    ><ArrowLeft class="mr-1.5" size="18" /> Back</a
  >
  <EmbeddedCheckout {stripe} {clientSecret} />
</div>
