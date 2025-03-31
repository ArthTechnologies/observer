<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import EmailSignin from "$lib/components/ui/EmailSignin.svelte";
  import EmailSigninNew from "$lib/components/ui/EmailSigninNew.svelte";

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { getSettings } from "$lib/scripts/req";
  import { PersonStanding, ShoppingCart, Box, ArrowLeft } from "lucide-svelte";
  let address;
  let plan = undefined;
  let locationName = "Loading...";  
  getSettings();

  if (browser) {
    locationName = localStorage.getItem("userNode");
    if (locationName.includes("https://")) {
      locationName = locationName.split("https://")[1];
      locationName = locationName.split(".")[0];
    
    } else {
      goto("/auth/chooseLocation");	  
    }
    plan = document.location.search.split("plan=")[1];
    address = window.location.host;
    //add in http or https depending on the protocol
    if (window.location.protocol == "https:") {
      address = "https://" + address;
    } else {
      address = "http://" + address;
    }
    if (
      localStorage.getItem("token") != "" &&
      localStorage.getItem("token") != undefined
    ) {
      goto("/");
      //this tells the navbar to update the icon that is highligted
      window.dispatchEvent(new Event("redrict"));
    }
  }

  function discord() {

          setTimeout(() => {
            goto("/auth/chooseLocation");
            //goto("https://discord.com/api/oauth2/authorize?client_id=1025856388297150475&redirect_uri="+address+"/auth/discord&response_type=token&scope=email+identify");
          }, 100);
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
    class="relative bg-base-100 rounded-xl shadow-xl px-5 md:px-8 xl:px-12 flex flex-col items-center max-sm:w-[95%]"
  >
    <div
      class="max-md:hidden mt-5 px-4 py-1 bg-neutral rounded-full font-semibold text-sm flex items-center gap-1"
    >
      
      <a href="/auth/chooseLocation" class="btn btn-xs btn-circle btn-ghost -ml-2"><ArrowLeft size=18 /></a>{locationName}
    </div>
    <!-- Signup Section-->
    <div class="p-4 md:p-6 md:w-96 rounded-xl">
      <p class="text-[1.4rem] font-poppins-bold mb-3">{$t("auth.login.h")}</p>
      <div class="grid grid-cols-2 gap-3 w-full items-center">
        <div class="flex gap-2.5">
          <button
            class="w-40 btn btn-neutral rounded-xl mb-2 btn-icon-text text-2xs"
            on:click={discord}
            ><img
              alt="microsoft logo"
              style="width:2.5ch"
              src="/discord.svg"
            />Discord</button
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
        ><a href="/signup/location" class="hover:link">Sign Up</a> · <a class="hover:link"href="/reset-password">{$t("account.button.resetPassword")}</a></span
      >
    </div>
  </div>
</div>
