<script lang="ts">
  import { browser } from "$app/environment";
  import darkMode from "$lib/stores/darkMode";
  import { Moon, Sun } from "lucide-svelte";

  if (browser) {
    if (localStorage.getItem("theme") == "light") {
    }
  }

  function refreshTheme() {
    if (browser) {
      window.dispatchEvent(new CustomEvent("refreshTheme", { detail: {} }));
      if (localStorage.getItem("theme") == "light") {
      } else if (localStorage.getItem("theme") == "dark") {
      }
    }
  }
</script>

<label class=" btn btn-circle btn-ghost swap swap-rotate">
  <!-- this hidden checkbox controls the state -->
  <input
    data-toggle-theme="light,dark"
    data-act-class="ACTIVECLASS"
    type="checkbox"
    bind:value={$darkMode}
    on:click={refreshTheme}
  />

  <Sun class="swap-on" />

  <Moon class="swap-off" />
</label>
