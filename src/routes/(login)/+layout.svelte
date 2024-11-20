<script>
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import Sidebar from "$lib/components/layout/Sidebar.svelte";
</script>

<div class="flex max-md:flex-col max-md:items-center bg-base-200 min-h-screen">
  <div class="w-[25%] max-md:hidden">
    <Sidebar />
  </div>
  <div class="w-full md:hidden">
    <Navbar />
  </div>
  <div class="m-4 sm:m-6 md:m-8 pb-12 lg:mt-16 w-[75%]">
    <slot />
  </div>
</div>
