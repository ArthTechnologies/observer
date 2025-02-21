<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import EmailSignin from "$lib/components/ui/EmailSignin.svelte";
  import EmailSigninNew from "$lib/components/ui/EmailSigninNew.svelte";

  import { t, locale, locales } from "$lib/scripts/i18n";
  import { getSettings } from "$lib/scripts/req";
    import { alert } from "$lib/scripts/utils";
  import { MapPin, PersonStanding, ShoppingCart, User } from "lucide-svelte";
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
    if (localStorage.getItem("token") != "" && localStorage.getItem("token") != undefined) {
      goto("/");
      //this tells the navbar to update the icon that is highligted
      window.dispatchEvent(new Event("redrict"));
    }
  }



  
  function discord() {

          setTimeout(() => {
            goto("https://discord.com/api/oauth2/authorize?client_id=1025856388297150475&redirect_uri="+address+"/auth/discord&response_type=token&scope=email+identify");
          }, 100);
        }
</script>

<div
  style="background-size: cover;"
  class="bg-[url('/images/hostingbg3.png')] 0 hero min-h-screen"
>
  <div
    class=" absolute h-screen w-full bg-gradient-to-b from-[#1a141c] to-[#99402b] z-[-1]"
  ></div>
  <div
    class="relative bg-base-100 rounded-xl shadow-xl px-6 sm:px-8 xl:px-12 flex flex-col items-center h-[83%] w-[95%] md:w-[36rem]"
  >
    <ul class="steps scale-90 mt-5 w-full">
      <li class="step step-neutral step-primary" data-content="">
        <MapPin size="18" class="-mt-10 z-50 text-gray-200" />
      </li>
      <li class="step step-neutral step-primary" data-content="">
        <User size="18" class="-mt-10 z-50 text-gray-200" />
      </li>


      <li class="step step-neutral" data-content="">
        <ShoppingCart size="18" class="-mt-10 z-50" />
      </li>
    </ul>
    <!-- Signup Section-->
    <div class="p-4 md:p-6 md:w-[30rem] rounded-xl">
      <p class="text-[1.4rem] font-poppins-bold mb-3">{$t("auth.signup.h")}</p>
      <div class="grid grid-cols-2 gap-3 w-full items-center">
        <div class="flex gap-2.5">
          <button
            on:click={discord}
            class="w-40 btn btn-neutral rounded-xl mb-2 btn-icon-text text-2xs"
            
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
      <EmailSigninNew sign="up" />
      <div class="mt-8"></div>
      <span
        class="text-xs ml-1.5 font-poppins absolute bottom-3 left-2 md:w-[95%] text-center"
        >{@html $t("auth.loginLink")}</span
      >
    </div>
  </div>
</div>
