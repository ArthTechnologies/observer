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
    class="alert flex gap-3 alert-error w-2/3 md:w-1/3 fixed z-50 right-2 top-2  shadow-lg"
    transition:fade
  >

      <AlertCircle />
     {detail}

  </div>
{/if}
