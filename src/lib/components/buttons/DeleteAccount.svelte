<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  import { apiurl } from "$lib/scripts/req";
  import Alert from "../ui/Alert.svelte";
  import { alert } from "$lib/scripts/utils";
  let accountType = "email";
  if (browser) {
    if (localStorage.getItem("accountEmail").includes("@")) {
      accountType = "email";
    } else {
      accountType = localStorage.getItem("accountEmail").split(":")[0];
    }
  }
  function del() {
    if (browser) {
      if (accountType == "email") {
        fetch(
          apiurl +
            "accounts/email?email=" +
            localStorage.getItem("accountEmail") +
            "&password=" +
            document.getElementById("password").value,

          {
            method: "DELETE",
            headers: {
              token: localStorage.getItem("token"),
              username: localStorage.getItem("accountEmail"),
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("data" + JSON.stringify(data));
            if (!data.success) {
              alert($t("alert.wrongPassword"));
            } else {
              localStorage.clear();
              window.location.href = "/signin";
            }
          });
      } else if (accountType == "discord") {
        fetch(
          apiurl + "accounts/discord",

          {
            method: "DELETE",
            headers: {
              token: localStorage.getItem("token"),
              username: localStorage.getItem("accountEmail").split(":")[1],
            },
          }
        )
          .then((res) => res.json())
          .then((data) => {
            console.log("data" + JSON.stringify(data));
            if (!data.success) {
              alert($t("alert.wrongPassword"));
            } else {
              localStorage.clear();
              window.location.href = "/signin";
            }
          });
      }
    }
  }
</script>

<label
  for="deleteAccount"
  class="btn btn-error grow md:grow sm:w-44 ml-1 md:m-0"
  >{$t("account.button.deleteAccount")}</label
>
<input type="checkbox" id="deleteAccount" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="deleteAccount"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("account.delete.title")}</h3>
    <p class="py-4">
      {$t("account.delete.desc")}
    </p>
    {#if accountType == "email"}
      <input
        type="password"
        id="password"
        class="input input-bordered input-error mr-1"
        placeholder={$t("typeYourPassword")}
      />
    {/if}

    <button class="btn btn-error" on:click={del}>{$t("button.delete2")}</button>
  </div>
</div>
