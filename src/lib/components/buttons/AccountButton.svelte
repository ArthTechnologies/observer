<script lang="ts">
  // ... (your existing imports and types)

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { ChevronUp, User } from "lucide-svelte";
  export let loginStatus: boolean;

  function signOut() {
    localStorage.setItem("token", "");
    localStorage.setItem("loggedIn", "false");
    loginStatus = false;
    window.location.href = "/signin";
  }
  let accountEmail = "noemail";
  let accountEmailChopped = "noemail";
  onMount(() => {
    if (browser) {
      accountEmail = localStorage.getItem("accountEmail");

      if (accountEmail.length > 18) {
        accountEmailChopped = accountEmail.slice(0, 18) + "...";
      } else {
        accountEmailChopped = accountEmail;
      }
      // Add event listener to close dropdown on window click
      window.addEventListener("click", handleWindowClick);
    }
  });
  function handleWindowClick(event) {
    const dropdown = document.getElementById("profileDropdown");

    // Check if the clicked element is outside of the dropdown
    if (dropdown && !dropdown.contains(event.target)) {
      closeDropdown();
    }
  }

  function closeDropdown() {
    document.getElementById("profileDropdown").open = false;
  }
</script>

{#if loginStatus === true}
  <div class=" flex-none gap-2" id="navbtn">
    <details class="dropdown dropdown-end z-50" id="profileDropdown">
      <summary
        tabindex="0"
        id="account"
        class="hover:text-gray-200 btn btn-ghost btn-circle"
      >
        <User />
      </summary>
      <ul
        tabindex="0"
        class="p-2 shadow menu menu-compact bg-base-200 dropdown-content rounded-box w-52 bg-opacity-95 backdrop-blur relative pt-10"
      >
        <p class="px-4 pb-2 pt-[.1rem] font-bold text-xl absolute left-2 top-2">
          Your Account
        </p>
        <!--<button
          class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
          on:click={closeDropdown}
        >
          <ChevronUp />
        </button>-->

        <p class="px-4 py-2">
          {accountEmailChopped}
        </p>

        <li>
          <a on:click={closeDropdown} href="/account"
            >{$t("account.manageAccount")}</a
          >
        </li>
        <li><a on:click={signOut}>{$t("account.logout")}</a></li>
      </ul>
    </details>
  </div>
{/if}
