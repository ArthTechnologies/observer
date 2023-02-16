<script lang="ts">
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import "../app.css";
  import "$lib/styles/components.scss";
  import { browser, dev } from "$app/environment";

  import { onMount } from "svelte";
  import { themeChange } from "theme-change";
  import Alert from "$lib/components/ui/Alert.svelte";

  onMount(() => {
    themeChange(false);
    // 👆 false parameter is required for svelte
  });
  // will break if not used here
</script>

<slot />
