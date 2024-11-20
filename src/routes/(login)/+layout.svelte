<script>
  import Sidebar from "$lib/components/layout/Sidebar.svelte";
</script>

<div class="flex bg-base-200 min-h-screen">
  <div class="w-1/5">
    <Sidebar></Sidebar>
  </div>
  <div class="m-4 sm:m-6 md:m-8 pb-12 lg:mt-16 w-4/5">
    <slot />
  </div>
</div>
