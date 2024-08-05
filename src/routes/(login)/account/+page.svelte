<script lang="ts">
  import { fade } from "svelte/transition";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import DeleteAccount from "$lib/components/buttons/DeleteAccount.svelte";
  import { browser } from "$app/environment";
  import { FileType2, Hash, Mail } from "lucide-svelte";
  let accountType = "email";
  let accountName;
  let accountEmail;
  let accountId;
  if (browser) {
    accountName = localStorage.getItem("accountEmail")?.split(":")[1];

    if (localStorage.getItem("accountEmail").includes("@")) {
      accountType = "email";
    } else {
      accountType = localStorage.getItem("accountEmail").split(":")[0];
    }
    accountEmail = localStorage.getItem("email");
    accountId = localStorage.getItem("accountId");
  }
</script>

<div class="flex place-content-center">
  <div class="flex flex-col grow items-center max-w-[55rem] mb-10 space-y-6">
    <h1 class="divider px-10 text-3xl font-semibold">{$t("account.title")}</h1>
    <div class="w-[55%] px-5 py-3 bg-base-300 flex flex-col gap-1 rounded-xl">
      <p class="text-lg font-bold mb-1">{accountName}</p>
      <div class="flex gap-2 items-center">
        <div
          class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1"
        >
          <FileType2 size="16" />
          {$t("account.type")}
        </div>
        {#if accountType == "email"}
          {$t("email")}
        {:else if accountType == "discord"}
          Discord
        {/if}
      </div>
      <div class="flex gap-2 items-center">
        <div
          class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1 truncate"
        >
          <Mail size="16" />
          {$t("account.email")}
        </div>

        <p>{accountEmail}</p>
      </div>
      <div class="flex gap-2 items-center">
        <div
          class="flex bg-neutral p-1.5 rounded-lg items-center text-sm font-bold gap-1"
        >
          <Hash size="16" />
          {$t("account.id")}
        </div>

        {accountId}
      </div>
    </div>

    <div class="flex flex-wrap justify-center button-container gap-3 w-[62%]">
      <a
        href="/billing"
        class="btn btn-neutral grow md:grow sm:w-44 ml-1 md:m-0"
        >{$t("account.button.managePayments")}</a
      >
      {#if accountType == "email"}
        <a
          href="/reset-password?backurl=/account"
          class="btn btn-secondary grow md:grow sm:w-44 ml-1 md:m-0"
          >{$t("account.button.resetPassword")}</a
        >
      {/if}

      <DeleteAccount />
    </div>
  </div>
</div>
