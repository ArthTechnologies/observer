<script lang="ts">
  import accountEmail from "$lib/stores/accountEmail";
  type loginStatus = true | false;
  import { t, locale, locales } from "$lib/scripts/i18n";
    import { onMount } from "svelte";
    import { browser } from "$app/environment";
  export let loginStatus: boolean;

  function signOut() {
    localStorage.setItem("token", "");
    loginStatus = false;
    window.location.href = "/signin";
  }

  let accountEmailChopped = "noemail";
 onMount(() => {
if (browser) {
  console.log("checking if youre logged in or not" + localStorage.getItem("loggedIn"));
  if(localStorage.getItem("loggedIn") == "true"){
     //if accountEmail is longer than 20 characters
 if ($accountEmail.length > 18) {
    //slice it to 20 characters
    accountEmailChopped = $accountEmail.slice(0, 18);
    accountEmailChopped += "...";
  } else {
    //else, just use accountEmail
    accountEmailChopped = $accountEmail;
  }

  }

}
 
  
 })
</script>

{#if loginStatus === true}
  <div class="flex-none gap-2 " id="navbtn">
    <div class="dropdown dropdown-end">
      <label
        tabindex="0"
        for="profileDropdown"
        class="btn btn-ghost btn-circle"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="feather feather-user"
          ><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle
            cx="12"
            cy="7"
            r="4"
          /></svg
        >
      </label>
      <ul
        id="profileDropdown"
        tabindex="0"
        class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52"
      >
        <li class="w-0">
          <p class="justify-between">
            {accountEmailChopped}
          </p>
        </li>
        <li><a on:click={signOut}>{$t("account.logout")}</a></li>
      </ul>
    </div>
  </div>
{/if}
