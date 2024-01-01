<script lang="ts">
  import { HelpCircle } from "lucide-svelte";

  export let tooltipText: string;
</script>

<div class="tooltip tooltip-right z-50 hidden sm:block" data-tip={tooltipText}>
  <div class="btn btn-circle btn-ghost btn-md">
    <HelpCircle />
  </div>
</div>
