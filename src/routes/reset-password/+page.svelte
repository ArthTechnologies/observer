<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import Navbar from "$lib/components/layout/Navbar.svelte";
  import { ArrowLeft } from "lucide-svelte";
  import { apiurl } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  let enablePay = true;
  let backurl = "/signin";
  if (browser) {
    if (localStorage.getItem("enablePay") == "false") {
      enablePay = false;
    }
  }
  function reset() {
    let email = document.getElementById("email").value;
    let cc = document.getElementById("cc").value;
    let password = document.getElementById("password").value;
    let confPassword = document.getElementById("confirmPassword").value;

    if (password != confPassword) {
      alert($t("alert.passwordsDontMatch"));
    } else {
      fetch(
        apiurl +
          "accounts/email/resetPassword?password=" +
          password +
          "&confirmPassword=" +
          confPassword +
          "&email=" +
          email +
          "&last4=" +
          cc,
        {
          method: "POST",
        }
      )
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            if (data.reason.includes("Wrong last 4"))
              alert($t("alert.wrongLast4digits"));
            else if (data.reason.includes("Too many attempts"))
              alert(
                $t("alert.tooManyAttempts") +
                  5 -
                  data.attempts +
                  $t("alert.tooManyAttempts2")
              );
            else alert(data.reason);
          } else {
            alert($t("alert.passwordResetSuccess"));
            window.location.href = "/signin";
          }
        });
    }
  }

  //if url has "?backurl=...", set backurl to that
  if (browser) {
    if (window.location.href.includes("?backurl=")) {
      backurl = window.location.href.split("?backurl=")[1];
      //remove the backurl from the url
      window.history.replaceState({}, document.title, "/reset-password");
    }
  }
</script>

<Navbar navType="welcome" />

<div class="hero min-h-screen">
  <div class="hero-content flex flex-col place-items-start">
    <a href={backurl} class="btn btn-sm btn-ghost"
      ><ArrowLeft />
      <p class="ml-1.5">{$t("button.back")}</p></a
    >
    <div
      class="bg-base-200 rounded-box w-full max-w-3xl p-5 border-4 border-base-300"
    >
      <p class="font-bold">{$t("account.resetPassword.title")}</p>
      <p class="text-gray-500">
        {$t("account.resetPassword.desc")}
      </p>
      <div class="flex flex-col mt-2">
        <label for="email " class="font-bold">{$t("email")}</label>
        <input id="email" class="input input-bordered" type="text" />
      </div>
      {#if enablePay}
        <div class="flex flex-col mt-2">
          <label for="email " class="font-bold"
            >{$t("account.resetPassword.l.last4")}</label
          >
          <input id="cc" class="input input-bordered" type="text" />
        </div>
      {/if}
      <div class="flex flex-col mt-2">
        <label for="password " class="font-bold"
          >{$t("account.resetPassword.l.newPassword")}</label
        >
        <input id="password" class="input input-bordered" type="password" />
      </div>
      <div class="flex flex-col mt-2">
        <label for="confirmPassword " class="font-bold"
          >{$t("account.resetPassword.l.confirmPassword")}</label
        >
        <input
          id="confirmPassword"
          class="input input-bordered"
          type="password"
        />
      </div>
      <button on:click={reset} class="btn btn-secondary mt-5"
        >{$t("account.button.resetPassword")}</button
      >
    </div>
  </div>
</div>
