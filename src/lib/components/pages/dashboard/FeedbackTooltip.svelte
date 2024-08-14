<script lang="ts">
  import { Info, Mail } from "lucide-svelte";

  export let feedback: string;
</script>

{#if feedback != "null" && feedback != undefined}
  {#if feedback == "unused" || feedback.includes("_")}
    <div
      class="tooltip tooltip-right z-50 hidden sm:block"
      data-tip="Feedback: {feedback}"
    >
      <Info size="16" class="mt-0.5" />
    </div>
  {:else}
    <div
      class="tooltip tooltip-right z-50 hidden sm:block"
      data-tip="Feedback: {feedback}"
    >
      <Mail size="16" class="mt-0.5" />
    </div>
  {/if}
{/if}
