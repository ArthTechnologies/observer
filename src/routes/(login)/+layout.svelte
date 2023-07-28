<script>
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import Footer from "$lib/components/layout/Footer.svelte";
</script>

<div class="flex flex-col justify-between">
  <Navbar navType="default" />
  <div class="m-4 sm:m-6 md:m-8">
    <slot />
  </div>
  <Footer navType="default" />
</div>
