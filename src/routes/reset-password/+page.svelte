<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";

  import { ArrowLeft } from "lucide-svelte";
  import { apiurl } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
    import SignedOutNav from "$lib/components/layout/SignedOutNav.svelte";
  let providerMode = true;
  let backurl = "/login";
  let locations = [];
  if (browser) {
    if (localStorage.getItem("providerMode") == "false") {
      providerMode = false;
    }

    fetch("https://ocelot.arthmc.xyz/nodeInfo")
      .then((res) => res.json())
      .then((data) => {
        for (let i = 0; i < data.length; i++) {
          locations.push(data[i][0].split("https://")[1].split(".")[0]);
        }
        let select = document.getElementById("locationSelect");
        select.innerHTML = "";
        locations.forEach((location) => {
          let option = document.createElement("option");
          option.value = location;
          option.innerHTML = location;
          select.appendChild(option);
        });
      });
  }
  function reset() {
    let email = document.getElementById("email").value;
    let day = document.getElementById("day").value;
    let month = document.getElementById("month").value;
    let year = document.getElementById("year").value;
    //turn into unix date
    let created = new Date(`${year}-${month}-${day}`).getTime() / 1000;
    let password = document.getElementById("password").value;
    let confPassword = document.getElementById("confirmPassword").value;
    const select = document.getElementById("locationSelect");
    const location = select.options[select.selectedIndex].value;
    let reseturl = "https://" + location + ".arthmc.xyz/";
    if (password != confPassword) {
      alert($t("alert.passwordsDontMatch"));
    } else {
      fetch(
        reseturl +
          "accounts/email/resetPassword" +
          "?email=" +
          email +
          "&created=" +
          created,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: password,
            confPassword: confPassword,
          }),
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
            alert($t("alert.passwordResetSuccess"), "success");
            window.location.href = "/login";
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

<SignedOutNav navType="welcome" />

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
      {#if providerMode}
        <div class="flex flex-col mt-2">
          <label for="email " class="font-bold"
            >Date when you first subscribed (Look in your emails)</label
          >
        <div class="flex gap-2 w-32 mt-1">
            <input id="day" class="input input-bordered w-10" type="text" placeholder="1" />
            <input id="month" class="input input-bordered w-12" type="text" placeholder="2"/>
            <input id="year" class="input input-bordered w-20" type="text" placeholder="2030" />
        </div>
        </div>
      {/if}

      <div class="flex flex-col mt-2">
        <label for="password " class="font-bold"
          >Select Location</label
        >
        <select id="locationSelect" class="select select-bordered w-full">
          <option disabled selected>Loading...</option>
        </select>
      </div>
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
