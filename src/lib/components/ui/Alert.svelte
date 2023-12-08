<script>
  import { browser } from "$app/environment";
  import {
    AlertCircle,
    CheckCircle,
    CheckCircle2,
    InfoIcon,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fade } from "svelte/transition";
  let visible = false;
  export let msg = "";
  export let type = "error";
  onMount(() => {
    visible = true;
    setTimeout(() => {
      visible = false;
    }, 4500);
  });
</script>

{#if visible}
  <div
    class="alert flex gap-3 bg-{type} text-black w-2/3 md:w-1/3 fixed z-[1000] right-2 top-2 shadow-lg"
    transition:fade
  >
    {#if type === "error"}
      <AlertCircle />
    {:else if type == "success"}
      <CheckCircle2 />
    {:else}
      <InfoIcon />
    {/if}
    {msg}
  </div>
{/if}
