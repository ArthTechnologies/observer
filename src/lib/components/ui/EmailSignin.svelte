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
  let sign = "in";
  function pwdVisibility() {
    var x = document.getElementById("pwd");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  }
  function enterPwd() {
    if (event.keyCode == 13) {
      submit();
    }
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
          console.log("x: " + x);
          if (x === true) {
            console.log("redricting...");
            goto("/");
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
        if (x) {
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

<div class="divider" />
<div class="tabs ">
  <a id="sin" on:click={signIn} class="tab tab-lifted tab-active"
    >{$t("signin")}</a
  >
  <a id="sup" on:click={signUp} class="tab tab-lifted">{$t("signup")}</a>
</div>
{#if sign === "in"}
  <div
    class="hero bg-base-300 border-dashed border-2 border-accent-content rounded "
  >
    <div class="hero-content text-center">
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
        <p class="text-xl">{$t("signin.h.email")}</p>
        <input
          id="email"
          type="text"
          placeholder={$t("signin.l.email")}
          class="input w-full max-w-xs"
        />
        <div class="space-x-2 space-y-5">
          <input
            type="password"
            id="pwd"
            on:keypress={enterPwd}
            placeholder={$t("signin.l.pwd")}
            class="input w-full max-w-xs"
          />

          <button on:click={submit} class="btn btn-primary">Submit</button>
        </div>
      </div>
    </div>
  </div>
{:else}
  <div
    class="hero bg-base-300 border-dashed border-2 border-accent-content rounded "
  >
    <div class="hero-content text-center">
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
        <input
          type="password"
          id="pwd"
          placeholder={$t("signin.l.pwd")}
          class="input w-full max-w-xs"
        />

        <div class="space-x-2 space-y-5">
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
