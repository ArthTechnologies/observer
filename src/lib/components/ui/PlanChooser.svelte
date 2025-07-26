<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Footer from "$lib/components/layout/SignedOutNav.svelte";

  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import {
    AlertTriangleIcon,
    Building2,
    Castle,

    Home,

  } from "lucide-svelte";
  import { onMount } from "svelte";
  let basicClass="neutralGradientStroke bg-base-100";	
  let plusClass="neutralGradientStroke bg-base-100";
  let premiumClass="neutralGradientStroke bg-base-100";

  let billingCycle = $t("perMonth");

  let atCapacity = false;
  onMount(() => {
    

    if (browser) {

      if (!localStorage.getItem("userNode")?.includes("http")) {
        atCapacity = true;
      }
      if (window.location.pathname == "/signup/subscribe/basic") {
        basicClass="primaryGradientStroke bg-gradient-to-b from-base-100 to-[#192a3e]";
      } else if (window.location.pathname == "/signup/subscribe/plus") {
        plusClass="primaryGradientStroke bg-gradient-to-b from-base-100 to-[#192a3e]";
      } else if (window.location.pathname == "/signup/subscribe/premium") {
        premiumClass="primaryGradientStroke bg-gradient-to-b from-base-100 to-[#192a3e]";
      }
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

  });


  let basicPlanPrice = 3.49;
  let plusPlanPrice = 4.99;
  let premiumPlanPrice = 7.99;

  if (browser) {
    onMount(() => {
      if (localStorage.getItem("address") == "arthmc.xyz") {
        if (localStorage.getItem("quarterly") == "true") {
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

    fetch(
      "https://ocelot.arthmc.xyz/nodeInfo"
    ).then((response) => {
      if (response.status == 200) {
        response.json().then((data) => {
          for (let i = 0; i < data.length; i++) {
            if (data[i][0]+"/" == localStorage.getItem("userNode")) {
              if (parseInt(data[i][1]) >= parseInt(data[i][2])) {
                atCapacity = true;
              }
            }
          }
        });
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

  function selectBasic() {
    
    goto("/signup/subscribe/basic");
    setTimeout(() => {
      location.reload();
    }, 300);  
  }
function selectPlus() {
    
    goto("/signup/subscribe/plus");
    setTimeout(() => {
      location.reload();
    }, 300);  
  }
  function selectPremium() {
    
    goto("/signup/subscribe/premium");
    setTimeout(() => {
      location.reload();
    }, 300);  
  }
</script>


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
<div class="min-[1080px]:flex relative bg-base-200 h-full w-full">

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
    class="px-[2rem] min-[1200px]:px-[3rem] py-[4.5rem] flex flex-col max-md:place-items-center relative"
  >
    <p class="text-xl mb-4 font-poppins-bold">{$t("subscribe.pickAPlan")}</p>
<div class="flex flex-col gap-1.5">
  <a  id="basicSelect" on:click={selectBasic}  class="{basicClass} flex md:max-lg:px-4 gap-2.5 items-center p-3 w-[18.5rem] truncate md:h-[4.5rem] rounded-lg  bg-opacity-50 cursor-pointer"
  >
      <div
    
      class="w-[3.25rem] h-[3.25rem] rounded-lg bg-base-300 bg-opacity-80 flex items-center justify-center"
    ><Home />
  </div>
    <div class="-mt-1">
      <p class="font-poppins-bold text-gray-200 text-sm md:text-lg truncate">Basic</p>


        <div class="flex gap-2">
          <p class="bg-base-300 bg-opacity-80 px-1.5 rounded text-xs font-poppins">$3.99/mo</p>
          <p class="bg-base-300 bg-opacity-80 px-1.5 rounded text-xs font-poppins">4GB RAM</p>

        </div>
    
    </div>
    </a>
      <a  id="plusSelect" on:click={selectPlus}  class="{plusClass} flex md:max-lg:px-4 gap-2.5 items-center p-3 w-[18.5rem] truncate md:h-[4.5rem] rounded-lg  bg-opacity-50 cursor-pointer"
    >
        <div
      
        class="w-[3.25rem] h-[3.25rem] rounded-lg bg-base-300 bg-opacity-80 flex items-center justify-center"
      ><Castle />
    </div>
      <div class="-mt-1">
        <p class="font-poppins-bold text-gray-200 text-sm md:text-lg truncate">Plus</p>


          <div class="flex gap-2">
            <p class="bg-base-300 bg-opacity-80 px-1.5 rounded text-xs font-poppins">$5.99/mo</p>
            <p class="bg-base-300 bg-opacity-80 px-1.5 rounded text-xs font-poppins">6GB RAM</p>

          </div>
      
      </div>
      </a>
      <a  id="premiumSelect" on:click={selectPremium} class="{premiumClass} flex md:max-lg:px-4 gap-2.5 items-center p-3 w-[18.5rem] truncate md:h-[4.5rem] rounded-lg  bg-opacity-50 cursor-pointer"
      >
          <div
        
          class="w-[3.25rem] h-[3.25rem] rounded-lg bg-base-300 bg-opacity-80 flex items-center justify-center"
        ><Building2 />
      </div>
        <div class="-mt-1">
          <p class="font-poppins-bold text-gray-200 text-sm md:text-lg truncate">Premium</p>
  
  
            <div class="flex gap-2">
              <p class="bg-base-300 bg-opacity-80 px-1.5 rounded text-xs font-poppins">$7.99/mo</p>
              <p class="bg-base-300 bg-opacity-80 px-1.5 rounded text-xs font-poppins">8GB RAM</p>
  
            </div>
        
        </div>
        </a>
</div>

    <div class="mt-12">
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
 

  .primaryGradientStroke {
    position: relative;

    z-index: 1;
  }

  .primaryGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #135664, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }

  .neutralGradientStroke {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStroke:hover::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>

