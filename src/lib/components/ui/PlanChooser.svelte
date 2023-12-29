<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { basicPlanPrice, moddedPlanPrice } from "$lib/scripts/req";
  import {
    AlertTriangleIcon,
    Check,
    ChevronDown,
    Cross,
    XIcon,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  let atCapacity = false;
  export let defaultPlan = "basic";
  onMount(() => {
    if (browser && window.innerWidth > 768) {
      if (defaultPlan == "basic") {
        selectBasic();
      } else if (defaultPlan == "modded") {
        selectModded();
      }
    }
  });

  function selectBasic() {
    document.getElementById("basicSelect").classList.remove("btn-neutral");
    document.getElementById("basicSelect").classList.add("pointer-events-none");
    document.getElementById("basicSelect").innerHTML = "Selected";

    document.getElementById("moddedSelect").classList.add("btn-neutral");
    document
      .getElementById("moddedSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("moddedSelect").innerHTML = "Select";
  }
  function selectModded() {
    document.getElementById("moddedSelect").classList.remove("btn-neutral");
    document
      .getElementById("moddedSelect")
      .classList.add("pointer-events-none");
    document.getElementById("moddedSelect").innerHTML = "Selected";

    document.getElementById("basicSelect").classList.add("btn-neutral");
    document
      .getElementById("basicSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("basicSelect").innerHTML = "Select";
  }
</script>

<Navbar navType="welcome" />

<div class="md:flex relative">
  {#if atCapacity}
    <div
      class="absolute w-screen h-screen bg-black bg-opacity-70 z-[999] flex place-items-center justify-center"
    >
      <div role="alert" class="alert alert-error w-96">
        <AlertTriangleIcon />
        <span
          >We're sorry. We're at capacity right now, please check back later.</span
        >
      </div>
    </div>
  {/if}
  <div
    class=" md:h-screen px-16 px-[2.5rem] lg:px-[7rem] py-[4.5rem] flex flex-col max-md:place-items-center relative"
  >
    <p class="text-lg mb-4 font-bold">Pick a plan</p>

    <div class="flex mb-8">
      <div class="flex flex-col gap-2">
        Basic
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">{basicPlanPrice}</p>

          <p class="w-5 text-sm">per month</p>
        </div>
        <img
          src="/images/basicPlan.png"
          class="rounded-xl h-[5.75rem] w-[9.5rem]"
        />

        <a
          on:click={() => {
            setTimeout(() => {
              location.reload();
            }, 100);
          }}
          id="basicSelect"
          class="btn btn-neutral btn-sm my-0.5 w-full"
          href="/subscribe/basic">Select</a
        >
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" /> Built-in Geyser™ crossplay between
          editions
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" /> One-click worldgen mods like Terralith
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" /> Thousands of plugins one click away
          via Modrinth
        </p>
      </div>
      <div class="divider divider-horizontal m-0 ml-2 mr-5 h-12 mt-7"></div>
      <div class="flex flex-col gap-2">
        Modded
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">
            {moddedPlanPrice}
          </p>

          <p class="w-5 text-sm">per month</p>
        </div>

        <img
          src="/images/moddedPlan.png"
          class="rounded-xl h-[5.75rem] w-[9.5rem]"
        />

        <a
          on:click={() => {
            setTimeout(() => {
              location.reload();
            }, 100);
          }}
          id="moddedSelect"
          class="btn btn-neutral btn-sm my-0.5 w-full"
          href="/subscribe/modded">Select</a
        >
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" /> Add new enemies, biomes, weapons,
          and so much more with mods!
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" /> Turn Minecraft into a whole new game
          with modpacks
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" /> Over 10,000 mods available via CurseForge
          & Modrinth
        </p>
      </div>
    </div>

    <ul class="list-disc mb-8">
      <p class="text-lg mb-4 font-bold">Did you know?</p>
      <li>
        Unlike most other services, Geyser™ crossplay is built-in and doesn't
        require any setup.
      </li>
      <li>
        Our cheapest plan is half the price of the leading competitor Apex
        Hosting's cheapest plan.
      </li>
      <li>
        Arth Hosting's interface was built from the ground up to be as easy to
        use as possible.
      </li>
    </ul>
    <div>
      <!--
              <img src="/images/sitelogo.svg" width="100px" />-->
      <p>
        <!--Arth Technologies<br />-->© 2022-{new Date().getFullYear()}
        <br />
        <!---->
        <a
          href="https://arthmc.xyz/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:link text-[.825rem]">Arth Technologies</a
        >
        <span class="text-[.825rem]">|</span>
        <a
          href="https://arthmc.xyz/privacy"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:link text-[.825rem]">Privacy Policy</a
        >
      </p>
    </div>
  </div>
</div>

<Footer navType="welcone" />
