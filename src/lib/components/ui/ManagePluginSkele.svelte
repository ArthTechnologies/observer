<script>
  import { ChevronUp } from "lucide-svelte";
</script>

<div class="flex flex-col">
  <div
    class="flex items-center justify-between bg-base-300 rounded-lg w-full h-16 pr-3 py-2 pl-2.5 space-x-1"
  >
    <div class="flex items-center space-x-1">
      <div class="bg-slate-700 rounded-lg w-[13rem] h-[1.5rem] animate-pulse" />
      <div
        class="bg-slate-700 rounded-lg w-[1.5rem] h-[1.5rem] animate-pulse"
      />
    </div>
    <div class="flex space-x-1 items-center">
      <div
        class="bg-slate-700 rounded-lg w-[13rem] h-[1.75rem] animate-pulse hidden sm:block"
      />

      <div class="px-2">
        <ChevronUp class="animate-pulse" color="#2f3c4d" />
      </div>
    </div>
  </div>

</div>
