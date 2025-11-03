<script lang="ts">
  import { onMount, src_url_equal } from "svelte/internal";
  import { changeServerState } from "$lib/scripts/req";

  import { getServer } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { AlertOctagon, ArrowRight, Loader, Plus, PlusIcon } from "lucide-svelte";
  //Status variables

  let startcolor = "accent";
  let starttext = "Start";
  let loading = false;
  let email = "noemail";
  let softwareType = "server";
  let address;
  
  if (browser) {
    address = localStorage.getItem("address")
  }
  let po = "?";
  let apo = 0;
  let lock = false;
  //Software variables
  type serverType =
    | "paper"
    | "spigot"
    | "bukkit"
    | "waterfall"
    | "velocity"
    | "forge"
    | "fabric"
    | "quilt"
    | "mohist"
    | "vanilla";

  export let id: number;
  export let timestamp: number = 0;

  const daysUntil = timestamp => Math.ceil((timestamp * 1000 - Date.now()) / (1000 * 60 * 60 * 24));
</script>


<div
  
  class="bg-base-300 w-[3.75rem] h-[3.75rem] rounded-lg max-lg:hidden flex justify-center items-center"
><AlertOctagon size=32/></div>
<div class="-mt-1">
  <p class="font-poppins-bold text-gray-200 text-sm md:text-lg truncate max-md:hidden">Expired Server</p>
  <div class="md:hidden flex items-center justify-center"><PlusIcon size=20/></div>
  <!-- Only shows in sidebar mode-->
  <div class="max-md:hidden">
    <p class="font-poppins text-xs mb-0.5 -mt-1">
      {#if timestamp != -1}
        Slot {parseInt(id)} will be reset in {daysUntil(timestamp)} days.
      {:else}
        Slot {parseInt(id)} has been freed up due to expired subscription.
      {/if}
    </p>
        <p class="font-poppins text-xs mb-0.5 -mt-1">
      Contact support to renew.
    </p>
  </div>
</div>

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
