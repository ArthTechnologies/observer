<script>
  import { onMount } from "svelte";
  import { signupEmail } from "$lib/scripts/req";
  import { loginEmail } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/ui/Alert.svelte";
  import { Eye, EyeOff } from "lucide-svelte";
  import { stripePaymentLink } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  let visible = false;

  let goodPwd = true;
  let matchPwd = true;

  let sign = "up";
  let pwdVisible = "password";
  function pwdVisibility() {
    if (pwdVisible == "password") {
      pwdVisible = "text";
    } else {
      pwdVisible = "password";
    }
  }

  if (browser) {
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
  //give the element with id="pwd" the class "tab-active"
  function signUp() {
    document.getElementById("sup").classList.add("tab-active");
    //remove the class "tab-active" from the element with id="sin"
    document.getElementById("sin").classList.remove("tab-active");
    sign = "up";
  }
  function signIn() {
    document.getElementById("sin").classList.add("tab-active");
    //remove the class "tab-active" from the element with id="sin"
    document.getElementById("sup").classList.remove("tab-active");
    sign = "in";
  }

  onMount(() => {
    //run signUp() if token == "" if window is defined
    if (browser) {
      if (localStorage.getItem("token") == "") {
        signUp();
      }
    }
  });

  function submit() {
    if (sign == "up") {
      checkPwd();
      if (goodPwd && matchPwd) {
        const res = signupEmail(
          document.getElementById("email").value,
          document.getElementById("pwd").value
        ).then((x) => {
          if (x === true) {
            console.log("redricting...");
            if (localStorage.getItem("enablePay") == "true") {
              //change this to your own stripe checkout link
              goto(
                stripePaymentLink +
                  "?prefilled_email=" +
                  document.getElementById("email").value +
                  "&prefilled_promo_code=2023"
              );
            } else {
              goto("/");
              //this tells the navbar to update the icon that is highligted
              window.dispatchEvent(new Event("redrict"));
            }
          } else {
            alert(x);
          }
        });
      }
    } else if (sign == "in") {
      const res = loginEmail(
        document.getElementById("email").value,
        document.getElementById("pwd").value
      ).then((x) => {
        console.log("x: " + x);
        if (x === true) {
          console.log("REDIRECTING...");
          goto("/");
          //this tells the navbar to update the icon that is highligted
          window.dispatchEvent(new Event("redrict"));
        } else {
          visible = true;
          msg = "Invalid email or password";
          setTimeout(() => {
            visible = false;
          }, 4500);
        }
      });
    }
  }
  $: if (!matchPwd) {
    msg = "Passwords do not match";
    visible = true;
    setTimeout(() => {
      visible = false;
      matchPwd = true;
    }, 4500);
  } else if (!goodPwd) {
    msg = "Password must be at least 7 characters long";
    visible = true;
    setTimeout(() => {
      visible = false;
      goodPwd = true;
    }, 4500);
  }
</script>

<div class="tabs ml-2 tabs-lifted flex items-start">
  <a id="sin" on:click={signIn} class="tab">{$t("signin")}</a>
  <a id="sup" on:click={signUp} class="tab tab-lifted tab-active"
    >{$t("signup")}</a
  >
</div>
{#if sign === "in"}
  <div class="bg-base-300 border-4 border-base-100 rounded-xl w-96">
    <div class="text-center p-6">
      <div class="max-w-md space-y-5">
        <div class="space-x-2 space-y-5">
          <p class="text-xl">{$t("signin.h.email")}</p>
          <input
            id="email"
            type="text"
            placeholder={$t("signin.l.email")}
            class="input w-full max-w-xs"
          />

          <div class="w-full flex space-x-2">
            <div class="w-full flex space-x-2">
              <input
                type={pwdVisible}
                id="pwd"
                placeholder={$t("signin.l.pwd")}
                class="input w-full max-w-xs"
              />
              <label class="btn btn-circle swap swap-rotate btn-ghost">
                <!-- this hidden checkbox controls the state -->
                <input type="checkbox" on:click={pwdVisibility} />

                <Eye size="28" class="swap-off" />

                <EyeOff size="28" class="swap-on" />
              </label>
            </div>
          </div>

          <button on:click={submit} class="btn btn-primary"
            >{$t("continue")}</button
          >
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-base-300 border-4 border-base-100 rounded-xl w-96 pl-2">
    <div class="p-6 text-center">
      <div class="max-w-md space-y-5">
        <p class="text-xl">{$t("signin.h.signupEmail")}</p>
        <input
          id="email"
          type="text"
          placeholder={$t("signin.l.email")}
          class="input w-full max-w-xs"
        />
        <div class="w-full flex space-x-2">
          <div class="w-full flex space-x-2">
            <input
              type={pwdVisible}
              id="pwd"
              placeholder={$t("signin.l.pwd")}
              class="input w-full max-w-xs"
            />
            <label class="btn btn-circle swap swap-rotate btn-ghost">
              <!-- this hidden checkbox controls the state -->
              <input type="checkbox" on:click={pwdVisibility} />

              <Eye size="28" class="swap-off" />

              <EyeOff size="28" class="swap-on" />
            </label>
          </div>
        </div>

        <div class="space-y-5">
          <input
            type="password"
            id="confPwd"
            placeholder={$t("signin.l.cpwd")}
            class="input w-full max-w-xs"
          />
          <button on:click={submit} class="btn btn-primary"
            >{$t("continue")}</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
