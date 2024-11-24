<script>

  import Sidebar from "$lib/components/layout/Nav.svelte";
</script>

<div class="flex max-md:flex-col max-md:items-center bg-base-200 min-h-screen">
  <div class="w-full md:w-[22%]">
    <Sidebar />
  </div>
  <div class="p-4 sm:p-6 md:p-8 pb-12 lg:pt-16 w-full md:w-[78%]">
    <slot />
  </div>
</div>
