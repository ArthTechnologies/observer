<script>
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";
</script>

<Navbar navType="welcome" />
<slot />
<Footer navType="default" />
