<script>
  import { browser } from "$app/environment";
  import { AlertCircle } from "lucide-svelte";
  import { fade } from "svelte/transition";
  export let visible = false;
  export let detail = "";
  $: if (visible) {
    console.log("alert visible: " + visible);
    setTimeout(() => {
      visible = false;
    }, 3500);
  }
</script>

{#if visible}
  <div
    class="break-keep w-1/2 fixed z-50 right-2 top-2 alert alert-error shadow-lg"
    transition:fade
  >
    <div>
      <AlertCircle />
      <span>{detail}</span>
    </div>
  </div>
{/if}
