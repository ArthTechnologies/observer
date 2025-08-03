<script>
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { CpuIcon, MemoryStick } from "lucide-svelte";
  let billedQuarterly = true;
        const selectPlan = (plan) => {
          let priceId;

    const event = new CustomEvent('planSelect', {
      detail: { billQuarterly: billedQuarterly, priceId: getPriceId(billedQuarterly,plan) }
    });
    dispatchEvent(event);
  
      const plans = ['basic', 'premium', 'plus'];
  for (const p of plans) {
    const el = document.getElementById(p + "Plan");
    if (el) {
      el.classList.remove("opacity-50", "pointer-events-none");
    }
  }
    document.getElementById(plan+"Plan")?.classList.add("opacity-50", "pointer-events-none");
  };
  function getPriceId(billQuarterly, plan) {
  if (plan === "basic") {
    return billQuarterly
      ? "price_1RqfTEJYPXquzaSzw5syXRoh"
      : "price_1R2FxgJYPXquzaSzQyzJBmsx";
  }
  if (plan === "plus") {
    return billQuarterly
      ? "price_1RqfVEJYPXquzaSzUvlz5wcL"
      : "price_1R2G3zJYPXquzaSzRRkaQC4J";
  }
  if (plan === "premium") {
    return billQuarterly
      ? "price_1RqfUeJYPXquzaSzRvqDjfVQ"
      : "price_1RrQfbJYPXquzaSzycdO5k05";
  }
  return null; // fallback if input is invalid
}
</script>

<div
  class=" relative flex  max-md:overflow-x-scroll w-full justify-center mt-10"
>
  <div
    class="w-48 flex flex-col items-start gap-2.5 bg-base-300 bg-opacity-[85%] backdrop-blur-[1px] rounded-l-2xl px-3 md:px-6 py-5 grayGradientStroke"
  >
    <p class=" font-bold text-[1.25rem] md:text-2xl text-left -mb-3 md:mb-0">
      Basic
    </p>

    <div class=" flex gap-4 -mb-3.5 md:mb-3.5 hidden">
      <div class="hidden w-20 outline p-2 rounded">
        <p class="text-center font-poppins-bold text-xl ">4GB</p>
        <div
          class="flex font-poppins font-bold items-center gap-1 justify-center text-sm"
        >
          <MemoryStick size="18" />RAM
        </div>
      </div>
      <div class="md:hidden p-2 rounded">
    
        <div
          class="flex font-poppins font-bold items-center gap-1 justify-center"
        >
          <MemoryStick size="20" />4GB
        </div>
      </div>
      <div class="w-24 outline outline-[#d1d1d1] p-2 rounded max-md:hidden">
        <p class="text-center font-poppins-bold text-xl">10GB</p>
        <div
          class="flex font-poppins font-bold items-center gap-0.5 justify-center text-sm"
        >
          <CpuIcon size="16" />Storage
        </div>
      </div>
    </div>
    <p class="font-poppins font-bold text-xl  text-center max-md:flex flex-col mb-0.5">
      $3.99<span class="text-sm">/mo</span>
    </p>
<div class="flex items-center font-poppins gap-1.5 text-sm"><input type="checkbox"  bind:checked={billedQuarterly}  class="toggle toggle-xs" /> Billed Quarterly</div>
<div class="divider w-full h-[1px] bg-gray-400 my-2"></div>
<ul class="list-disc font-poppins list-inside text-sm">
      <li>4GB RAM</li>
      <li>10GB Storage</li>
      <li>Ryzen 7 CPUs</li>
      </ul>

      <button
      id="basicPlan"
     on:click={() => selectPlan("basic")}
        class="text-sm w-full h-12 px-5 cursor-pointer flex flex-col justify-center items-center bg-gradient-to-b from-[#E93843] to-[#F56922] hover:brightness-90 rounded-full text-gray-100 whiteGradientStroke font-poppins-bold text-[#ebeef5]"
      >
    Select
    </button>
 
  </div>
  <div
    class="w-48 flex flex-col items-start gap-2.5 bg-base-300 bg-opacity-[85%] backdrop-blur-[1px] px-3 md:px-6 py-5 grayGradientStroke"
  >
    <p class=" font-bold text-[1.25rem] md:text-2xl text-left -mb-3 md:mb-0">
      Plus
    </p>

    <div class=" flex gap-4 -mb-3.5 md:mb-3.5 hidden">
      <div class="hidden w-20 outline p-2 rounded">
        <p class="text-center font-poppins-bold text-xl ">4GB</p>
        <div
          class="flex font-poppins font-bold items-center gap-1 justify-center text-sm"
        >
          <MemoryStick size="18" />RAM
        </div>
      </div>
      <div class="md:hidden p-2 rounded">
    
        <div
          class="flex font-poppins font-bold items-center gap-1 justify-center"
        >
          <MemoryStick size="20" />4GB
        </div>
      </div>
      <div class="w-24 outline outline-[#d1d1d1] p-2 rounded max-md:hidden">
        <p class="text-center font-poppins-bold text-xl">10GB</p>
        <div
          class="flex font-poppins font-bold items-center gap-0.5 justify-center text-sm"
        >
          <CpuIcon size="16" />Storage
        </div>
      </div>
    </div>
    <p class="font-poppins font-bold text-xl  text-center max-md:flex flex-col mb-0.5">
      $5.99<span class="text-sm">/mo</span>
    </p>
<div class="flex items-center font-poppins gap-1.5 text-sm"><input type="checkbox"  bind:checked={billedQuarterly}  class="toggle toggle-xs" /> Billed Quarterly</div>
<div class="divider w-full h-[1px] bg-gray-400 my-2"></div>
<ul class="list-disc font-poppins list-inside text-sm">
      <li>6GB RAM</li>
      <li>15GB Storage</li>
      <li>Ryzen 7 CPUs</li>
      </ul>
 
      <button
      id="plusPlan"
      on:click={() => selectPlan("plus")}
        class="text-sm w-full h-12 px-5 cursor-pointer flex flex-col justify-center items-center bg-gradient-to-b from-[#E93843] to-[#F56922] hover:brightness-90 rounded-full text-gray-100 whiteGradientStroke font-poppins-bold text-[#ebeef5]"
      >
    Select
    </button>

  </div>
    <div
    class="w-48 flex flex-col items-start gap-2.5 bg-base-300 bg-opacity-[85%] backdrop-blur-[1px] rounded-r-2xl px-3 md:px-6 py-5 goldGradientStroke"
  >
    <p class="text-[#edcfb0] font-bold text-[1.25rem] md:text-2xl text-left -mb-3 md:mb-0">
      Premium
    </p>

    <div class=" flex gap-4 -mb-3.5 md:mb-3.5 hidden">
      <div class="hidden w-20 outline p-2 rounded">
        <p class="text-center font-poppins-bold text-xl ">4GB</p>
        <div
          class="flex font-poppins font-bold items-center gap-1 justify-center text-sm"
        >
          <MemoryStick size="18" />RAM
        </div>
      </div>
      <div class="md:hidden p-2 rounded">
    
        <div
          class="flex font-poppins font-bold items-center gap-1 justify-center"
        >
          <MemoryStick size="20" />4GB
        </div>
      </div>
      <div class="w-24 outline outline-[#d1d1d1] p-2 rounded max-md:hidden">
        <p class="text-center font-poppins-bold text-xl">15GB</p>
        <div
          class="flex font-poppins font-bold items-center gap-0.5 justify-center text-sm"
        >
          <CpuIcon size="16" />Storage
        </div>
      </div>
    </div>
    <p class="font-poppins font-bold text-xl  text-center max-md:flex flex-col mb-0.5 text-[#edcfb0]">
      $7.99<span class="text-sm opacity-80">/mo</span>
    </p>
<div class="flex items-center font-poppins gap-1.5 text-sm"><input type="checkbox" bind:checked={billedQuarterly}  class="toggle toggle-xs" /> Billed Quarterly</div>
<div class="divider w-full h-[1px] bg-gray-400 my-2"></div>
<ul class="list-disc font-poppins list-inside text-sm">
      <li>8GB RAM</li>
      <li class="text-[.85rem]">20GB Storage</li>
      <li>Ryzen 7 CPUs</li>
      </ul>

      <button
      id="premiumPlan"
      on:click={() => selectPlan("premium")}
        class="text-sm w-full h-12 px-5 cursor-pointer flex flex-col justify-center items-center bg-gradient-to-b from-[#E93843] to-[#F56922] hover:brightness-90 rounded-full text-gray-100 whiteGradientStroke font-poppins-bold text-[#ebeef5]"
      >
        Select
    </button>

  </div>
</div>

<style>
  .grayGradientStroke {
    position: relative;

    z-index: 1;
  }

  .grayGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2px; /* Space between button and border */
    background: linear-gradient(180deg, #eeeeee9c, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }

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

    .goldGradientStroke {
    position: relative;

    z-index: 1;
  }

  .goldGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2px; /* Space between button and border */
    background: linear-gradient(180deg, #f1d6b8, #d09670);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>
