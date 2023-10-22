<script lang="ts">
  type loginStatus = true | false;
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { onMount } from "svelte";
  import { browser } from "$app/environment";
  import { User } from "lucide-svelte";
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

      //if accountEmail is longer than 20 characters
      if (accountEmail.length > 18) {
        //slice it to 20 characters
        accountEmailChopped = accountEmail.slice(0, 18);
        accountEmailChopped += "...";
      } else {
        //else, just use accountEmail
        accountEmailChopped = accountEmail;
      }
    }
  });
</script>

{#if loginStatus === true}
  <div class="flex-none gap-2" id="navbtn">
    <div class="dropdown dropdown-end">
      <label
        tabindex="0"
        for="profileDropdown"
        class="btn btn-ghost btn-circle"
      >
        <User />
      </label>
      <ul
        id="profileDropdown"
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52"
      >
        <li class="">
          <p class="justify-between">
            {accountEmailChopped}
          </p>
        </li>
        <li><a href="/account">{$t("account.manageAccount")}</a></li>
        <li><a on:click={signOut}>{$t("account.logout")}</a></li>
      </ul>
    </div>
  </div>
{/if}
