<script lang="ts">
  import { browser } from "$app/environment";
  import darkMode from "$lib/stores/darkMode";
  import { Moon, Sun } from "lucide-svelte";
  let supportsDaisyUIThemeSwitcher = false;
  let supportsOklch = true;
  if (browser) {
    console.log(navigator.userAgent);
    // checks if the browser (supports DaisyUI theme switcher) is chrome 105+, firefox 121+, or safari 15.4+
    supportsDaisyUIThemeSwitcher =
      (navigator.userAgent.includes("Chrome") &&
        parseInt(navigator.userAgent.match(/Chrome\/(\d+)\./)[1]) >= 105) ||
      (navigator.userAgent.includes("Firefox") &&
        parseInt(navigator.userAgent.match(/Firefox\/(\d+)\./)[1]) >= 121) ||
      (navigator.userAgent.includes("Safari") &&
        parseInt(navigator.userAgent.match(/Version\/(\d+)\./)[1]) >= 15);

    //to-do: find out what versions of edge and maybe opera supports this

    // checks if the browser (supports oklch and thus custom themes) isn't chrome 110-, firefox 112-, edge 110-, or opera 96-
    try {
      supportsOklch = !(
        (navigator.userAgent.includes("Chrome") &&
          parseInt(navigator.userAgent.match(/Chrome\/(\d+)\./)[1]) <= 110) ||
        (navigator.userAgent.includes("Firefox") &&
          parseInt(navigator.userAgent.match(/Firefox\/(\d+)\./)[1]) <= 112) ||
        (navigator.userAgent.includes("Edge") &&
          parseInt(navigator.userAgent.match(/Edge\/(\d+)\./)[1]) <= 110) ||
        (navigator.userAgent.includes("Opera") &&
          parseInt(navigator.userAgent.match(/Opera\/(\d+)\./)[1]) <= 96)
      );
    } catch (e) {
      console.log(e);
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

{#if supportsOklch}
  {#if supportsDaisyUIThemeSwitcher}
    <label class=" btn btn-circle btn-ghost swap swap-rotate">
      <!-- this hidden checkbox controls the state -->
      <input
        class="theme-controller"
        value="light"
        type="checkbox"
        on:click={refreshTheme}
      />

      <Sun class="swap-on" />

      <Moon class="swap-off" />
    </label>
  {:else}
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
  {/if}
{/if}
