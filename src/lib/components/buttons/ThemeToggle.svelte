<script lang="ts">
  import { browser } from "$app/environment";
  import darkMode from "$lib/stores/darkMode";
  import { Moon, Sun } from "lucide-svelte";
  let highlightColor = "gray-200";
  if (browser) {
    if (localStorage.getItem("theme") == "light") {
      highlightColor = "primary";
    }
  }
</script>

<label
  class="hover:text-{highlightColor} btn btn-circle btn-ghost swap swap-rotate"
>
  <!-- this hidden checkbox controls the state -->
  <input
    data-toggle-theme="light,dark"
    data-act-class="ACTIVECLASS"
    type="checkbox"
    bind:value={$darkMode}
  />

  <Sun class="swap-on" />

  <Moon class="swap-off" />
</label>
