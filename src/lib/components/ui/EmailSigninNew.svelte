<script>
  import { onMount } from "svelte";
  import { signupEmail } from "$lib/scripts/req";
  import { loginEmail } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import { fade } from "svelte/transition";
  import { Eye, EyeOff, ArrowRight } from "lucide-svelte";

  import { alert } from "$lib/scripts/utils";
  import { Turnstile } from "svelte-turnstile";

  let visible = false;

  let goodPwd = true;
  let matchPwd = true;
  let cloudflareVerified = false;
  let cloudflareVerifyToken = "";
  let cloudflareVerify = true;
  let cloudflareVerifyKey = "";
  let checkingIfCloudflareVerify = true;
  export let sign = "up";
  let pwdVisible = "password";
  let lang = "us";
  let plan = undefined;
  function pwdVisibility() {
    if (pwdVisible == "password") {
      pwdVisible = "text";
    } else {
      pwdVisible = "password";
    }
  }

  if (browser) {
    plan = document.location.search.split("plan=")[1];
    let intervalId = setInterval(() => {
      if (localStorage.getItem("enableCloudflareVerify") != undefined) {
        cloudflareVerify = JSON.parse(
          localStorage.getItem("enableCloudflareVerify")
        );
        cloudflareVerifyKey = localStorage.getItem("cloudflareVerifySiteKey");
        checkingIfCloudflareVerify = false;
        clearInterval(intervalId);
      }
    }, 50);

    lang = navigator.language;
    if (localStorage.getItem("lang") != null) {
      lang = localStorage.getItem("lang");
    }
    document.addEventListener("keyup", function (event) {
      if (event.keyCode === 13) {
        submit();
      }
    });
  }
  //set goodPwd to false if length of the element with id="pwd" is less than 8
  function checkPwd() {
    if (document.getElementById("pwd").value.length < 7) {
      goodPwd = false;
    } else {
      goodPwd = true;
    }
    console.log(goodPwd);
    if (
      document.getElementById("pwd").value !=
      document.getElementById("confPwd").value
    ) {
      matchPwd = false;
    } else {
      matchPwd = true;
    }
    console.log(matchPwd);
  }

  function submit() {
    if (sign == "up") {
      checkPwd();
      if (goodPwd && matchPwd) {
        const res = signupEmail(
          document.getElementById("email").value,
          document.getElementById("pwd").value,
          cloudflareVerifyToken
        ).then((x) => {
          if (x === true) {
            console.log("redricting...");
            if (localStorage.getItem("enablePay") == "true") {
              fetch("https://backend.arthmc.xyz/analytics/accountCreated", {
                method: "POST",
              });
              //change this to your own stripe checkout link
              if (plan == undefined) {
                goto("/subscribe/basic");
              } else {
                goto("/subscribe/" + plan);
              }
            } else {
              goto("/");
              //this tells the navbar to update the icon that is highligted
              window.dispatchEvent(new Event("redrict"));
            }
          } else {
            if (x.includes("Email already exists"))
              alert($t("alert.emailAlreadyExists"));
            else if (x.inclues("Password is too short"))
              alert($t("alert.passwordIsTooShort"));
            else alert(x);
          }
        });
      }
    } else if (sign == "in") {
      const res = loginEmail(
        document.getElementById("email").value,
        document.getElementById("pwd").value,
        cloudflareVerifyToken
      ).then((x) => {
        console.log("x: " + x);
        if (x === true) {
          console.log("REDIRECTING...");
          goto("/");
          //this tells the navbar to update the icon that is highligted
          window.dispatchEvent(new Event("redrict"));
        } else {
          visible = true;
          alert("Invalid email or password");
        }
      });
    }
  }
  $: if (!matchPwd) {
    alert($t("alert.passwordsDontMatch"));
  } else if (!goodPwd) {
    alert($t("alert.passwordIsTooShort"));
  }

  function cloudflareVerifyCallback(event) {
    setTimeout(() => {
      cloudflareVerified = true;
      cloudflareVerifyToken = event.detail.token;
    }, 600);
  }
</script>

<div class="relative">
  {#if sign === "in"}
    <div class="rounded-xl">
      <div class="text-center">
        <div class="max-w-md space-y-5">
          <div class="flex flex-col items-center space-y-4">
            <input
              id="email"
              type="text"
              placeholder={$t("auth.email")}
              class="input w-full"
            />

            <div class="w-full flex space-x-2">
              <div class="w-full flex space-x-2">
                <input
                  type={pwdVisible}
                  id="pwd"
                  placeholder={$t("auth.password")}
                  class="input w-full max-w-xs"
                />
                <label class="btn btn-circle swap swap-rotate btn-ghost mb-1">
                  <!-- this hidden checkbox controls the state -->
                  <input type="checkbox" on:click={pwdVisibility} />

                  <Eye size="28" class="swap-off" />

                  <EyeOff size="28" class="swap-on" />
                </label>
              </div>
            </div>
            <div class="w-[100%] flex justify-center h-[4.1rem]">
              {#if !checkingIfCloudflareVerify}
                <Turnstile
                  on:turnstile-callback={cloudflareVerifyCallback}
                  language={lang}
                  siteKey={cloudflareVerifyKey}
                />
              {/if}
            </div>
            <button on:click={submit} class="btn btn-neutral rounded-xl"
              >{$t("auth.continue")}<ArrowRight class="ml-1.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div class="rounded-xl">
      <div class=" text-center">
        <div class="max-w-md space-y-5">
          <div class="flex flex-col items-start space-y-4">
            <input
              id="email"
              type="text"
              placeholder={$t("auth.email")}
              class="input sm:w-full"
            />
            <div class="w-full flex space-x-2">
              <div class="w-full flex space-x-2">
                <input
                  type={pwdVisible}
                  id="pwd"
                  placeholder={$t("auth.password")}
                  class="input sm:w-full max-sm:w-48 max-w-xs"
                />
                <label class="btn btn-circle swap swap-rotate btn-ghost">
                  <!-- this hidden checkbox controls the state -->
                  <input type="checkbox" on:click={pwdVisibility} />

                  <Eye size="28" class="swap-off" />

                  <EyeOff size="28" class="swap-on" />
                </label>
              </div>
            </div>
            <input
              type="password"
              id="confPwd"
              placeholder={$t("auth.confirmPassword")}
              class="input sm:w-full"
            />

            <div class="space-y-5 flex flex-col md:items-center md:w-full">
              <div class="w-[100%] flex justify-center h-[4.1rem]">
                {#if !checkingIfCloudflareVerify}
                  <Turnstile
                    on:turnstile-callback={cloudflareVerifyCallback}
                    language={lang}
                    siteKey={cloudflareVerifyKey}
                  />
                {/if}
              </div>
              <button on:click={submit} class="btn btn-neutral rounded-xl"
                >{$t("auth.continue")}<ArrowRight class="ml-1.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>
