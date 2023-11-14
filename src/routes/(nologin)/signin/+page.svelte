<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import EmailSignin from "$lib/components/ui/EmailSignin.svelte";

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { getSettings } from "$lib/scripts/req";
  let address;

  getSettings();

  if (browser) {
    address = window.location.host;
    //add in http or https depending on the protocol
    if (window.location.protocol == "https:") {
      address = "https://" + address;
    } else {
      address = "http://" + address;
    }
    if (localStorage.getItem("token") != "") {
      goto("/");
    }
  }
</script>

<div class="hero min-h-screen bg-base-200">
  <div class="hero-content text-center">
    <div class="max-w-md">
      <h1 class="text-5xl font-bold">{$t("signin.title")}</h1>
      <p class="py-6">{$t("signin.h")}</p>

      <a
        class="btn btn-neutral mb-2 btn-icon-text text-2xs btn-disabled"
        href="https://discord.com/api/oauth2/authorize?client_id=1025856388297150475&redirect_uri={address}/auth/discord&response_type=token&scope=identify"
        ><img alt="microsoft logo" style="width:2.5ch" src="discord.svg" />{$t(
          "signin.discord"
        )}</a
      >
      <div class="max-sm:divider md:mt-4" />

      <div class="h-96">
        <EmailSignin />
      </div>
      <button class="btn btn-sm mt-3 btn-ghost" href="/reset-password"
        >Forgot password?</button
      >
    </div>
  </div>
</div>
