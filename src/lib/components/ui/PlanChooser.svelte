<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import {
    AlertTriangleIcon,
    BadgeDollarSign,
    Check,
    CpuIcon,
    Cross,
    MemoryStick,
    XIcon,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  let atCapacity = false;
  let billingCycle = $t("perMonth");
  onMount(() => {
    if (browser && window.innerWidth > 768) {
      if (window.location.pathname == "/subscribe/basic") {
        selectBasic();
      } else if (window.location.pathname == "/subscribe/plus") {
        selectPlus();
      } else if (window.location.pathname == "/subscribe/premium") {
        selectPremium();
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
    document.getElementById("basicSelect").classList.add("opacity-70");

    document.getElementById("basicSelect").classList.add("pointer-events-none");
    document.getElementById("basicSelect").innerHTML = "Selected";

    document.getElementById("plusSelect").classList.add("btn-neutral");
    document
      .getElementById("plusSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("plusSelect").innerHTML = "Select";
    document.getElementById("premiumSelect").classList.add("btn-neutral");
    document
      .getElementById("premiumSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("premiumSelect").innerHTML = "Select";
  }
  function selectPlus() {
    document.getElementById("plusSelect").classList.remove("btn-neutral");
    document.getElementById("plusSelect").classList.add("opacity-70");
    document.getElementById("plusSelect").classList.add("pointer-events-none");
    document.getElementById("plusSelect").innerHTML = "Selected";

    document.getElementById("basicSelect").classList.add("btn-neutral");
    document
      .getElementById("basicSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("basicSelect").innerHTML = "Select";

    document.getElementById("premiumSelect").classList.add("btn-neutral");
    document
      .getElementById("premiumSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("premiumSelect").innerHTML = "Select";
  }
  function selectPremium() {
    document.getElementById("premiumSelect").classList.remove("btn-neutral");
    document.getElementById("premiumSelect").classList.add("opacity-70");
    document
      .getElementById("premiumSelect")
      .classList.add("pointer-events-none");
    document.getElementById("premiumSelect").innerHTML = "Selected";

    document.getElementById("basicSelect").classList.add("btn-neutral");
    document
      .getElementById("basicSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("basicSelect").innerHTML = "Select";

    document.getElementById("plusSelect").classList.add("btn-neutral");
    document
      .getElementById("plusSelect")
      .classList.remove("pointer-events-none");
    document.getElementById("plusSelect").innerHTML = "Select";
  }
  let basicPlanPrice = 3.49;
  let plusPlanPrice = 4.99;
  let premiumPlanPrice = 7.99;

  if (browser) {
    onMount(() => {
      if (localStorage.getItem("address") == "arthmc.xyz") {
        if (localStorage.getItem("billQuarterly") == "true") {
          document.getElementById("billPeriod").selectedIndex = 1;

          basicPlanPrice = 9.99;
          plusPlanPrice = 13.99;
          premiumPlanPrice = 23.49;
          billingCycle = $t("perQuarter");
        }

        let currency = localStorage.getItem("currency");
        if (currency == "mxn") {
          basicPlanPrice = (basicPlanPrice * 18).toFixed(0);
          plusPlanPrice = (plusPlanPrice * 18).toFixed(0);
          premiumPlanPrice = (premiumPlanPrice * 18).toFixed(0);
          //round up to nearest 5
          basicPlanPrice = Math.ceil(basicPlanPrice / 5) * 5;
          plusPlanPrice = Math.ceil(plusPlanPrice / 5) * 5;
          premiumPlanPrice = Math.ceil(premiumPlanPrice / 5) * 5;
        }
      } else {
        const currencyChooser = document.getElementById("currencyChooser");
        currencyChooser?.classList.add("hidden");

        const addonChooser = document.getElementById("addonChooser");
        addonChooser?.classList.add("hidden");
      }
    });
  }

  function updateBillPeriod() {
    let dropdown = document.getElementById("billPeriod")?.value;
    if (dropdown == $t("billMonthly")) {
      localStorage.setItem("billQuarterly", "false");
    } else if (dropdown == $t("billQuarterly")) {
      localStorage.setItem("billQuarterly", "true");
    }
    location.reload();
  }
</script>

<Navbar navType="welcome" />

<div class="min-[1080px]:flex relative bg-base-200 h-full w-full">
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
  <div
    class="absolute top-3 right-3 max-[1080px]:right-16 z-50 flex flex-col gap-1.5 items-end"
  >
    <div id="currencyChooser" class="flex space-x-1 flex hidden">
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
    <select
      id="billPeriod"
      on:change={updateBillPeriod}
      class="select select-sm select-ghost"
    >
      <option selected>{$t("billMonthly")}</option>
      <option>{$t("billQuarterly")}</option>
    </select>
  </div>

  <div
    class="px-[2.5rem] min-[1080px]:px-4 min-[1200px]:px-[2.5rem] 2xl:px-[7rem] py-[4.5rem] flex flex-col max-md:place-items-center relative"
  >
    <p class="text-xl mb-4 font-poppins-bold">{$t("subscribe.pickAPlan")}</p>

    <div class="sm:flex mb-2">
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          {$t("basic")}
          <div class="badge badge-neutral rounded-lg font-poppins gap-1.5">
            <MemoryStick size="16" class="shrink-0" />
            3GB
          </div>
        </div>
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-poppins-bold">
            ${basicPlanPrice}
          </p>

          <p class="w-5 text-sm">{billingCycle}</p>
        </div>

        <a
          on:click={() => {
            setTimeout(() => {
              location.reload();
            }, 100);
          }}
          id="basicSelect"
          class="h-12 my-3 px-5 cursor-pointer flex items-center bg-gradient-to-b from-[#E93843] to-[#F56922] hover:brightness-90 rounded-full text-white whiteGradientStroke font-poppins-bold justify-center bg-gradient-to-b from-[#E93843] to-[#F56922]"
          href="/subscribe/basic">{$t("select")}</a
        >
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.crossplay")}
        </p>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.worldgen")}
        </p>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.plugins")}
        </p>
      </div>
      <div
        class="max-[1200px]:invisible max-[1200px]:m-0 divider divider-horizontal m-0 ml-2 mr-5 h-12 mt-7"
      ></div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          {$t("plus")}
          <div class="badge badge-neutral rounded-lg font-poppins gap-1.5">
            <MemoryStick size="16" class="shrink-0" />
            5GB
          </div>
        </div>

        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-poppins-bold">
            ${plusPlanPrice}
          </p>

          <p class="w-5 text-sm">{billingCycle}</p>
        </div>

        <a
          on:click={() => {
            setTimeout(() => {
              location.reload();
            }, 100);
          }}
          id="plusSelect"
          class="h-12 my-3 px-5 cursor-pointer flex items-center bg-gradient-to-b from-[#E93843] to-[#F56922] hover:brightness-90 rounded-full text-white whiteGradientStroke font-poppins-bold justify-center"
          href="/subscribe/plus">{$t("select")}</a
        >
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods1")}
        </p>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.modpacks")}
        </p>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods2")}
        </p>
      </div>

      <div
        class="max-[1200px]:invisible max-[1200px]:m-0 divider divider-horizontal m-0 ml-2 mr-5 h-12 mt-7"
      ></div>
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          Premium <div
            class="badge badge-neutral rounded-lg font-poppins gap-1.5"
          >
            <MemoryStick size="16" class="shrink-0" />
            8GB
          </div>
        </div>
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-poppins-bold">
            ${premiumPlanPrice}
          </p>

          <p class="w-5 text-sm">{billingCycle}</p>
        </div>

        <a
          on:click={() => {
            setTimeout(() => {
              location.reload();
            }, 100);
          }}
          class="h-12 my-3 px-5 cursor-pointer flex items-center bg-gradient-to-b from-[#E93843] to-[#F56922] hover:brightness-90 rounded-full text-white whiteGradientStroke font-poppins-bold justify-center"
          id="premiumSelect"
          href="/subscribe/premium"
        >
          <p>{$t("select")}</p>
        </a>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          Unmatched price for performance at only $1/GB of RAM
        </p>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods2")}
        </p>
        <p
          class="hidden sm:flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]"
        >
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.crossplay")}
        </p>
      </div>
    </div>
    <ul class="list-disc mb-8 mt-24">
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

<style>
  .whiteGradientStroke {
    position: relative;

    z-index: 1;
  }

  .whiteGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2px; /* Space between button and border */
    background: linear-gradient(180deg, #ffffff, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>
