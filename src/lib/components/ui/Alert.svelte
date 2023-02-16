<script>
    import { browser } from '$app/environment';
    import {fade} from 'svelte/transition';
    export let visible = false;
    export let detail = "";
    $: if (visible) {
            console.log("alert visible: " + visible)
            setTimeout(() => {
            visible = false;
            }, 3500);
        }


</script>
{#if visible}


<div class="break-keep w-1/2 fixed z-50 right-2 top-2 alert alert-error shadow-lg" transition:fade>
    <div>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-alert-circle"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      <span>{detail}</span>
    </div>
  </div>
  {/if}