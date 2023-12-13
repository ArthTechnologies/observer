<script>
  import { browser } from "$app/environment";
  import { Languages } from "lucide-svelte";
  import { onMount } from "svelte";
  function en() {
    localStorage.setItem("lang", "en-US");
    window.location.reload();
  }
  function es() {
    localStorage.setItem("lang", "es-ES");
    window.location.reload();
  }
  onMount(() => {
    if (browser) {
      window.addEventListener("click", handleWindowClick);
    }
  });

  function handleWindowClick(event) {
    const dropdown = document.getElementById("languageDropdown");

    // Check if the clicked element is outside of the dropdown
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }
  }

  function closeDropdown() {
    document.getElementById("languageDropdown").open = false;
  }
</script>

<details
  id="languageDropdown"
  class="dropdown dropdown-top pointer-events-auto"
>
  <summary class="btn btn-ghost btn-sm btn-square">
    <Languages size="20" />
  </summary>
  <ul
    class="p-2 shadow menu dropdown-content z-[1] bg-base-200 rounded-box w-52"
  >
    <li on:click={en}><a>English</a></li>
    <li on:click={es}><a>Español</a></li>
  </ul>
</details>
