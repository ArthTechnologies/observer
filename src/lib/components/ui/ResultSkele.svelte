<script>
  import { Plus } from "lucide-svelte";
</script>

<!-- Note: "min-[500px]" represents a breakpoint decently smaller than "sm", where
        descriptions are likely to wrap to new lines, resulting in a taller search result.-->
<div
  class="bg-base-200 h-[8.375rem] min-[500px]:h-[6.875rem] p-3 rounded-lg flex space-x-3 relative"
>
  <div
    class="w-16 h-16 shrink-0 md:w-20 md:h-20 bg-slate-700 animate-pulse rounded-lg"
  />
  <div class="flex flex-col justify-between pt-1.5 pb-0.5">
    <div class="flex space-x-1 items-end">
      <div
        class="bg-slate-700 animate-pulse w-[7rem] md:w-[10rem] h-4 rounded-lg"
      />
      <div
        class="bg-slate-700 animate-pulse w-[3rem] md:w-[5rem] h-3 rounded-lg"
      />
    </div>
    <div
      class="bg-slate-700 animate-pulse w-[10rem] min-[500px]:w-[12.5rem] md:w-[17.5rem] h-8 min-[500px]:h-3.5 rounded-lg"
    />
    <div class="bg-slate-700 animate-pulse w-[5.68rem] h-7 rounded-lg" />
  </div>
  <div
    class="w-[3rem] h-[6.875rem] min-[500px]:h-[5.375rem] absolute right-[.75rem] flex items-center justify-center"
  >
    <Plus color="#2f3c4d" class="animate-pulse" />
  </div>
</div>
