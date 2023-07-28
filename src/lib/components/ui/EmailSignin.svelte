<script>
  import { onMount } from "svelte";
  import { signupEmail } from "$lib/scripts/req";
  import { loginEmail } from "$lib/scripts/req";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";
  import Alert from "$lib/components/ui/Alert.svelte";
  let visible = false;
  let msg = "";
  let goodPwd = true;
  let matchPwd = true;
  let networkerror = false;
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
            goto(
              "https://buy.stripe.com/dR63fv4bX3qjc1i28a?prefilled_email=" +
                document.getElementById("email").value +
                "&prefilled_promo_code=2023"
            );
          } else {
            visible = true;
            msg = x;

            setTimeout(() => {
              visible = false;
            }, 3500);
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
        } else {
          visible = true;
          msg = "Invalid email or password";
          setTimeout(() => {
            visible = false;
          }, 3500);
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
    }, 3500);
  } else if (!goodPwd) {
    msg = "Password must be at least 7 characters long";
    visible = true;
    setTimeout(() => {
      visible = false;
      goodPwd = true;
    }, 3500);
  }
</script>

<div class="tabs ml-2">
  <a id="sin" on:click={signIn} class="tab tab-lifted">{$t("signin")}</a>
  <a id="sup" on:click={signUp} class="tab tab-lifted tab-active"
    >{$t("signup")}</a
  >
</div>
{#if sign === "in"}
  <div class="bg-base-300 border-4 border-base-100 rounded-xl w-96">
    <div class="text-center p-6">
      <div class="max-w-md space-y-5">
        {#if networkerror === true}
          <div class="badge badge-error gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-4 h-4 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              /></svg
            >
            You encountered a network error.
          </div>
        {/if}

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

                <!-- eye icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="feather feather-eye swap-off"
                  ><path
                    d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                  /><circle cx="12" cy="12" r="3" /></svg
                >

                <!-- close icon -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="swap-on feather feather-eye-off"
                  ><path
                    d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                  /><line x1="1" y1="1" x2="23" y2="23" /></svg
                >
              </label>
            </div>
          </div>

          <button on:click={submit} class="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div class="bg-base-300 border-4 border-base-100 rounded-xl w-96 pl-2">
    <div class="p-6 text-center">
      <div class="max-w-md space-y-5">
        {#if networkerror === true}
          <div class="badge badge-error gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              class="inline-block w-4 h-4 stroke-current"
              ><path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              /></svg
            >
            You encountered a network error.
          </div>
        {/if}

        <p class="text-xl">Sign up via Email:</p>
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

              <!-- eye icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-eye swap-off"
                ><path
                  d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                /><circle cx="12" cy="12" r="3" /></svg
              >

              <!-- close icon -->
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="swap-on feather feather-eye-off"
                ><path
                  d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
                /><line x1="1" y1="1" x2="23" y2="23" /></svg
              >
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
            >{$t("button.submit")}</button
          >
        </div>
      </div>
    </div>
  </div>
{/if}
<Alert detail={msg} {visible} />
