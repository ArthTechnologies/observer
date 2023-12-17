<script lang="ts">
  import { ChevronDown, Cross, XIcon } from "lucide-svelte";
  import { loadStripe } from "@stripe/stripe-js";
  import { EmbeddedCheckout } from "svelte-stripe";
  import { onMount } from "svelte";
  import { apiurl } from "$lib/scripts/req";

  let stripe = null;
  let clientSecret = null;

  onMount(async () => {
    stripe = await loadStripe(
      "pk_live_51Lzn2zJYPXquzaSzOpvIIfZl98HVgKP6gLoWFgQqykAbONLIXPNn2leGhMVIhNKJ4urq9mq3OGfV97R9rYxz9n77008C2WOdrZ"
    );
    clientSecret = await fetch(apiurl + "checkout/modded", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        return data.clientSecret;
      });
  });
</script>

<div class="md:flex">
  <div
    class=" md:h-screen px-16 px-[2.5rem] lg:px-[7rem] py-[6rem] flex flex-col max-md:place-items-center"
  >
    <p class="text-lg mb-4 font-bold">Pick a plan</p>

    <div class="flex mb-16">
      <div class="flex flex-col gap-2">
        Basic
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">$4.00</p>

          <p class="w-5 text-sm">per month</p>
        </div>
        <img src="/images/basicPlan.png" class="rounded-xl h-20" />
        <button class="btn btn-neutral btn-sm mt-0.5 w-full">Select</button>
      </div>
      <div class="divider divider-horizontal m-0 ml-8 mr-4 h-12 mt-7"></div>
      <div class="flex flex-col gap-2">
        Modded
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">$6.00</p>

          <p class="w-5 text-sm">per month</p>
        </div>
        <img src="/images/moddedPlan.png" class="rounded-xl h-20" />
        <button class="btn btn-neutral btn-sm mt-0.5 w-full">Select</button>
      </div>
    </div>
    <div class="max-md:ml-9">
      <div class="flex gap-2">
        <div class="flex justify-between w-[19.35rem]">
          <p>Arth Hosting: Basic Plan x1</p>

          <p>$6.00</p>
        </div>
        <button class="btn btn-ghost btn-xs btn-square">
          <XIcon size="16" />
        </button>
      </div>
      <div class="flex gap-2">
        <div class="flex justify-between w-[19.35rem]">
          <p>Arth Hosting: Modded Plan x1</p>

          <p>$6.00</p>
        </div>
        <button class="btn btn-ghost btn-xs btn-square">
          <XIcon size="16" />
        </button>
      </div>
      <div class="divider my-2 w-[19.5rem]"></div>
      <div class="flex justify-between w-[19.35rem]">
        <b>Subtotal</b>
        <p>$10.00</p>
      </div>
      <div class="flex justify-between w-[19.35rem]">
        <p>Tax</p>
        <p>$0.00</p>
      </div>
      <div class="divider my-2 w-[19.5rem]"></div>
      <div class="flex justify-between w-[19.35rem]">
        <b>Total</b>
        <p>$10.00</p>
      </div>
    </div>
    <div class="flex gap-1.5 items-center mt-12">
      <img src="/images/poweredByStripe.svg" class="w-24" />
      <div class="divider divider-horizontal h-6 mx-0"></div>
      <a
        href="https://stripe.com/legal/end-users"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:link text-xs mr-1">Terms</a
      >
      <a
        href="https://stripe.com/privacy"
        target="_blank"
        rel="noopener noreferrer"
        class="hover:link text-xs">Privacy</a
      >
    </div>
  </div>

  <div class="md:h-screen bg-[#525f7f] w-full py-16">
    <EmbeddedCheckout {stripe} {clientSecret} />
  </div>
</div>

<style>
</style>
