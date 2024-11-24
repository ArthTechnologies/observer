<script lang="ts">
  import Footer from "$lib/components/layout/SignedOutNav.svelte";

</script>

<div>
  <Navbar navType="welcome" disableButtons="true" />
  <slot />
  <Footer navType="default" />
</div>
