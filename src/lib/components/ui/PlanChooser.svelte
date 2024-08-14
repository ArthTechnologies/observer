<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl, basicPlanPrice, moddedPlanPrice } from "$lib/scripts/req";
  import {
    AlertTriangleIcon,
    Check,
    ChevronDown,
    Cross,
    XIcon,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  let atCapacity = false;
  onMount(() => {
    if (browser && window.innerWidth > 768) {
      if (window.location.pathname == "/subscribe/basic") {
        selectBasic();
      } else if (window.location.pathname == "/subscribe/modded") {
        selectModded();
      }
    }

    if (browser) {
      const usd = document.getElementById("usd");
      const mxn = document.getElementById("mxn");
      if (localStorage.getItem("currency") == "mxn") {
        usd?.classList.add("btn-neutral");
        usd?.classList.add("hover:bg-base-100");
        usd?.classList.remove("pointer-events-none");
        mxn?.classList.remove("btn-neutral");
        mxn?.classList.remove("hover:bg-base-100");
        mxn?.classList.add("pointer-events-none");
      }
    }

    fetch(apiurl + "info/capacity")
      .then((x) => x.json())
      .then((x) => {
        atCapacity = x.atCapacity;
      });
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
  let basicPlanPrice2 = basicPlanPrice;
  let moddedPlanPrice2 = moddedPlanPrice;

  //we dont have a system for panel owners to set prices for different
  //countries yet, so for now this is arth hosting only.
  if (browser) {
    if (localStorage.getItem("address") == "arthmc.xyz") {
      if (localStorage.getItem("currency") == null) {
        getBasicPrice().then((x) => {
          basicPlanPrice2 = x;
        });
        getModdedPrice().then((x) => {
          moddedPlanPrice2 = x;
        });
      } else {
        if (localStorage.getItem("currency") == "mxn") {
          basicPlanPrice2 = "$60";
          moddedPlanPrice2 = "$80";
        } else {
          basicPlanPrice2 = "$3.49";
          moddedPlanPrice2 = "$4.99";
        }
      }
    } else {
      const currencyChooser = document.getElementById("currencyChooser");
      currencyChooser?.classList.add("hidden");
    }
  }
  function getBasicPrice() {
    return fetch("https://ip2c.org/s")
      .then((response) => response.text())
      .then((data) => {
        if (data.split(";")[1] == "MX") {
          return "$60";
        } else {
          return "$3.49";
        }
      });
  }

  function getModdedPrice() {
    return fetch("https://ip2c.org/s")
      .then((response) => response.text())
      .then((data) => {
        if (data.split(";")[1] == "MX") {
          return "$80";
        } else {
          return "$4.99";
        }
      });
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
        <span>{$t("atCapacity")}</span>
      </div>
    </div>
  {/if}
  <div id="currencyChooser" class="flex space-x-1 absolute top-3 right-3 z-50">
    <button
      id="usd"
      class="btn btn-sm pointer-events-none"
      on:click={() => {
        if (browser) {
          const usd = document.getElementById("usd");
          const mxn = document.getElementById("mxn");
          usd?.classList.remove("btn-neutral");
          usd?.classList.remove("hover:bg-base-100");
          usd?.classList.add("pointer-events-none");
          mxn?.classList.add("btn-neutral");
          mxn?.classList.add("hover:bg-base-100");
          mxn?.classList.remove("pointer-events-none");

          localStorage.setItem("currency", "usd");
          location.reload();
        }
      }}>$</button
    >
    <button
      id="mxn"
      class="btn btn-neutral btn-sm hover:bg-base-100"
      on:click={() => {
        if (browser) {
          const usd = document.getElementById("usd");
          const mxn = document.getElementById("mxn");
          usd?.classList.add("btn-neutral");
          usd?.classList.add("hover:bg-base-100");
          usd?.classList.remove("pointer-events-none");
          mxn?.classList.remove("btn-neutral");
          mxn?.classList.remove("hover:bg-base-100");
          mxn?.classList.add("pointer-events-none");

          localStorage.setItem("currency", "mxn");
          location.reload();
        }
      }}>MX$</button
    >
  </div>
  <div
    class=" md:h-screen px-16 px-[2.5rem] lg:px-[7rem] py-[4.5rem] flex flex-col max-md:place-items-center relative"
  >
    <p class="text-xl mb-4 font-bold">{$t("subscribe.pickAPlan")}</p>

    <div class="flex mb-8">
      <div class="flex flex-col gap-2">
        {$t("basic")}
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">
            {basicPlanPrice2}
          </p>

          <p class="w-5 text-sm">{$t("perMonth")}</p>
        </div>
        <img
          src="/images/basicPlan.webp"
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
          href="/subscribe/basic">{$t("select")}</a
        >
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.crossplay")}
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.worldgen")}
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.plugins")}
        </p>
      </div>
      <div class="divider divider-horizontal m-0 ml-2 mr-5 h-12 mt-7"></div>
      <div class="flex flex-col gap-2">
        {$t("modded")}
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">
            {moddedPlanPrice2}
          </p>

          <p class="w-5 text-sm">{$t("perMonth")}</p>
        </div>

        <img
          src="/images/moddedPlan.webp"
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
          href="/subscribe/modded">{$t("select")}</a
        >
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods1")}
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.modpacks")}
        </p>
        <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods2")}
        </p>
      </div>
    </div>

    <ul class="list-disc mb-8">
      <p class="text-lg mb-4 font-bold">{$t("subscribe.didYouKnow")}</p>
      <li>
        {$t("subscribe.didYouKnow.geyser")}
      </li>
      <li>
        {$t("subscribe.didYouKnow.price")}
      </li>
      <li>
        {$t("subscribe.didYouKnow.interface")}
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
          class="hover:link text-[.825rem]">{$t("privacyPolicy")}</a
        >
      </p>
    </div>
  </div>
</div>

<Footer navType="welcone" />
