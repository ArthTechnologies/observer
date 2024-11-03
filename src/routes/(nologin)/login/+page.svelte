<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import EmailSignin from "$lib/components/ui/EmailSignin.svelte";
  import EmailSigninNew from "$lib/components/ui/EmailSigninNew.svelte";

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { getSettings } from "$lib/scripts/req";
  import { PersonStanding, ShoppingCart, Box } from "lucide-svelte";
  let address;
  let plan = undefined;
  getSettings();

  if (browser) {
    plan = document.location.search.split("plan=")[1];
    address = window.location.host;
    //add in http or https depending on the protocol
    if (window.location.protocol == "https:") {
      address = "https://" + address;
    } else {
      address = "http://" + address;
    }
    if (localStorage.getItem("token") != "") {
      goto("/");
      //this tells the navbar to update the icon that is highligted
      window.dispatchEvent(new Event("redrict"));
    }
  }
</script>

<div
  style="background-size: cover;"
  class="bg-[url('/images/hostingbg3.png')] 0 hero min-h-screen"
>
  <div
    class="absolute h-screen w-full bg-gradient-to-b from-[#1a141c] to-[#99402b] z-[-1]"
  ></div>
  <div
    class="relative bg-base-300 rounded-xl shadow-xl px-5 md:px-8 xl:px-12 flex flex-col items-center max-sm:w-[95%]"
  >
    <div
      class="max-md:hidden mt-5 px-4 py-2 bg-primary rounded-full text-white font-semibold text-sm flex items-center gap-2"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="lucide lucide-pickaxe"
        ><path d="M14.531 12.469 6.619 20.38a1 1 0 1 1-3-3l7.912-7.912" /><path
          d="M15.686 4.314A12.5 12.5 0 0 0 5.461 2.958 1 1 0 0 0 5.58 4.71a22 22 0 0 1 6.318 3.393"
        /><path
          d="M17.7 3.7a1 1 0 0 0-1.4 0l-4.6 4.6a1 1 0 0 0 0 1.4l2.6 2.6a1 1 0 0 0 1.4 0l4.6-4.6a1 1 0 0 0 0-1.4z"
        /><path
          d="M19.686 8.314a12.501 12.501 0 0 1 1.356 10.225 1 1 0 0 1-1.751-.119 22 22 0 0 0-3.393-6.319"
        /></svg
      >
      {$t("auth.welcomeBack")}
    </div>
    <!-- Signup Section-->
    <div class="p-4 md:p-6 md:w-96 rounded-xl">
      <p class="text-[1.4rem] font-poppins-bold mb-3">{$t("auth.login.h")}</p>
      <div class="grid grid-cols-2 gap-3 w-full items-center">
        <div class="flex gap-2.5">
          <a
            class="w-40 btn btn-neutral rounded-xl mb-2 btn-icon-text text-2xs"
            href="https://discord.com/api/oauth2/authorize?client_id=1025856388297150475&redirect_uri={address}/auth/discord&response_type=token&scope=email+identify"
            ><img
              alt="microsoft logo"
              style="width:2.5ch"
              src="/discord.svg"
            />Discord</a
          >
          <a
            class="max-sm:hidden w-40 btn btn-neutral rounded-xl mb-2 btn-icon-text btn-disabled"
            href="https://discord.com/api/oauth2/authorize?client_id=1025856388297150475&redirect_uri={address}/auth/discord&response_type=token&scope=email+identify"
            ><span class="flex flex-shrink-0 items-center scale-95">
              <img
                alt="microsoft logo"
                style="width:2.5ch"
                src="/google.png"
                class="opacity-25"
              />Coming Soon
            </span></a
          >
        </div>
      </div>
      <p class="text-[1.4rem] font-poppins-bold mb-3 mt-4">
        {$t("auth.password.h")}
      </p>
      <EmailSigninNew sign="in" />
      <div class="mt-8"></div>
      <span
        class="text-xs ml-1.5 font-poppins absolute bottom-3 left-2 w-[95%] text-center"
        >{@html $t("auth.signupLink")}</span
      >
    </div>
  </div>
</div>
