<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl, basicPlanPrice, moddedPlanPrice } from "$lib/scripts/req";
  import {
    AlertTriangleIcon,
    BadgeDollarSign,
    Check,
    ChevronDown,
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
    document.getElementById("basicSelect").classList.add("bg-base-300");
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
    document.getElementById("moddedSelect").classList.add("bg-base-300");
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
  let basicPlanPrice2 = 3.49;
  let moddedPlanPrice2 = 4.99;

  if (browser) {
    onMount(() => {
      if (localStorage.getItem("address") == "arthmc.xyz") {
        const ramBoost = document.getElementById("ramBoost");
        const billQuarterly = document.getElementById("billQuarterly");

        if (localStorage.getItem("ramBoost") == "true") {
          ramBoost?.setAttribute("checked", "true");

          basicPlanPrice2 = 7.99;
          moddedPlanPrice2 = 7.99;
          if (localStorage.getItem("billQuarterly") == "true") {
            billQuarterly?.setAttribute("checked", "true");
            billingCycle = $t("perQuarter");
            basicPlanPrice2 = 23.49;
            moddedPlanPrice2 = 23.49;
          }
        } else if (localStorage.getItem("billQuarterly") == "true") {
          billQuarterly?.setAttribute("checked", "true");

          basicPlanPrice2 = 9.99;
          moddedPlanPrice2 = 13.99;
          billingCycle = $t("perQuarter");
        }

        let currency = localStorage.getItem("currency");
        if (currency == "mxn") {
          basicPlanPrice2 = (basicPlanPrice2 * 18).toFixed(0);
          moddedPlanPrice2 = (moddedPlanPrice2 * 18).toFixed(0);
          //round up to nearest 5
          basicPlanPrice2 = Math.ceil(basicPlanPrice2 / 5) * 5;
          moddedPlanPrice2 = Math.ceil(moddedPlanPrice2 / 5) * 5;
        }
      } else {
        const currencyChooser = document.getElementById("currencyChooser");
        currencyChooser?.classList.add("hidden");

        const addonChooser = document.getElementById("addonChooser");
        addonChooser?.classList.add("hidden");
      }
    });
  }

  function updatePrice() {
    const ramBoost = document.getElementById("ramBoost");
    const billQuarterly = document.getElementById("billQuarterly");

    localStorage.setItem("ramBoost", ramBoost?.checked.toString());
    localStorage.setItem("billQuarterly", billQuarterly?.checked.toString());
    location.reload();
  }
</script>

<Navbar navType="welcome" />

<div class="md:flex relative bg-base-200 h-full">
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
    class=" px-16 px-[2.5rem] lg:px-[7rem] py-[4.5rem] flex flex-col max-md:place-items-center relative"
  >
    <p class="text-xl mb-4 font-bold">{$t("subscribe.pickAPlan")}</p>

    <div class="flex mb-2">
      <div class="flex flex-col gap-2">
        {$t("basic")}
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">
            ${basicPlanPrice2}
          </p>

          <p class="w-5 text-sm">{billingCycle}</p>
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
        <p class="flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.crossplay")}
        </p>
        <p class="flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.worldgen")}
        </p>
        <p class="flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.plugins")}
        </p>
      </div>
      <div class="divider divider-horizontal m-0 ml-2 mr-5 h-12 mt-7"></div>
      <div class="flex flex-col gap-2">
        {$t("modded")}
        <div class="flex gap-2">
          <p class="text-accent-content text-4xl font-bold">
            ${moddedPlanPrice2}
          </p>

          <p class="w-5 text-sm">{billingCycle}</p>
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
        <p class="flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods1")}
        </p>
        <p class="flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.modpacks")}
        </p>
        <p class="flex items-center gap-2 text-sm xl:text-[.95rem] w-[9.5rem]">
          <Check size="16" class="shrink-0" />
          {$t("subscribe.list.mods2")}
        </p>
      </div>
    </div>

    <div class="mb-8 max-md:w-80 2xl:w-[35rem]" id="addonChooser">
      <p class="text-lg mb-4 font-bold">Add-ons</p>
      <div class="gap-4 grid grid-cols-2">
        <div
          class="rounded-xl bg-gradient-to-tr from-[#010101] to-[#170800] p-2 px-3 shadow-2xl"
        >
          <div class="flex justify-between">
            <div>
              <div class="flex gap-2 font-bold max-md:text-sm">
                <MemoryStick size="24" class="shrink-0" />
                RAM Boost
              </div>
              <p class="text-[.93rem] 2xl:w-52">
                More players, more mods, more fun. 8GB of RAM for one unbeatable
                price.
              </p>
            </div>
            <input
              id="ramBoost"
              type="checkbox"
              class="checkbox"
              on:click={updatePrice}
            />
          </div>
        </div>
        <div
          class="rounded-xl xl:h-24 bg-gradient-to-tr from-[#010101] to-[#001606] p-2 px-3 shadow-2xl"
        >
          <div class="flex justify-between">
            <div>
              <div class="flex gap-2 font-bold max-md:text-sm">
                <BadgeDollarSign size="24" class="shrink-0" />
                Bill Quarterly
              </div>
              <p class="text-[.93rem] 2xl:w-48 mt-0.5">
                Pay every 3 months instead of 1 and save.
              </p>
            </div>
            <input
              id="billQuarterly"
              type="checkbox"
              class="checkbox"
              on:click={updatePrice}
            />
          </div>
        </div>
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
