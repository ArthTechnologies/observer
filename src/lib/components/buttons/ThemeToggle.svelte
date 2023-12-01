<script lang="ts">
  import darkMode from "$lib/stores/darkMode";
  import { Moon, Sun } from "lucide-svelte";
</script>

<label class="hover:text-gray-200 btn btn-circle btn-ghost swap swap-rotate">
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
