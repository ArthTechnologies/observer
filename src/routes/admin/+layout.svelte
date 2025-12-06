<script>
  import Nav from "$lib/components/layout/Nav.svelte";
</script>

<div class="flex min-h-screen">
  <Nav />
  <main class="flex-1 md:ml-[22%] bg-base-100">
    <slot />
  </main>
</div>
