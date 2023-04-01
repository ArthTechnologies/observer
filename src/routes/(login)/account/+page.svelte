<script lang="ts">
  import { fade } from "svelte/transition";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import DeleteAccount from "$lib/components/buttons/DeleteAccount.svelte";
</script>

<div class="flex place-content-center">
  <div class="flex flex-col grow items-center max-w-[55rem] mb-10 space-y-6">
    <h1 class="divider px-10 text-3xl font-semibold">Your Account</h1>

    <div
      class="flex flex-wrap justify-center button-container sm:space-x-3 w-[90%]"
    >
      <a href="/pay" class="btn grow md:grow sm:w-44 ml-1 md:m-0"
        >Manage Payments</a
      >
      <a
        href="/request-placeholder"
        class="btn btn-primary grow md:grow sm:w-44 ml-1 md:m-0">Change Email</a
      >
      <a
        href="/request-placeholder"
        class="btn btn-secondary grow md:grow sm:w-44 ml-1 md:m-0"
        >Change Password</a
      >
      <DeleteAccount />
    </div>
  </div>
</div>
