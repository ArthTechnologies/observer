<script lang="ts">
  import { fade } from "svelte/transition";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import DeleteAccount from "$lib/components/buttons/DeleteAccount.svelte";
</script>

<div class="flex place-content-center">
  <div class="flex flex-col grow items-center max-w-[55rem] mb-10 space-y-6">
    <h1 class="divider px-10 text-3xl font-semibold">{$t("account.title")}</h1>

    <div class="flex flex-wrap justify-center button-container gap-3 w-[90%]">
      <a href="/pay" class="btn grow md:grow sm:w-44 ml-1 md:m-0"
        >{$t("account.button.managePayments")}</a
      >
      <a
        href="/reset-password?backurl=/account"
        class="btn btn-secondary grow md:grow sm:w-44 ml-1 md:m-0"
        >{$t("account.button.resetPassword")}</a
      >
      <DeleteAccount />
    </div>
  </div>
</div>
