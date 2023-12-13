<script lang="ts">
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
</script>

<div>
  <Navbar navType="welcome" disableButtons="true" />
  <slot />
  <Footer navType="default" />
</div>
