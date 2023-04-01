<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  function del() {
    if (browser) {
      fetch(
        "http://localhost:4000/accounts?email=" +
          localStorage.getItem("accountEmail") +
          "&password=" +
          document.getElementById("password").value,

        {
          method: "DELETE",
          headers: {
            token: localStorage.getItem("token"),
            email: localStorage.getItem("accountEmail"),
          },
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("data" + JSON.stringify(data));
          if (!data.success) {
            alert("Wrong password.");
          } else {
            localStorage.clear();
            window.location.href = "https://servers.arthmc.xyz/signin";
          }
        });
    }
  }
</script>

<label
  for="deleteAccount"
  class="btn btn-error grow md:grow sm:w-44 ml-1 md:m-0">Delete Account</label
>
<input type="checkbox" id="deleteAccount" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative">
    <label
      for="deleteAccount"
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">Are you sure?</h3>
    <p class="py-4">
      Your account will be instantly deleted. This cannot be undone.
    </p>
    <input
      type="password"
      id="password"
      class="input input-bordered input-error mr-1"
      placeholder="Type your password"
    />

    <button class="btn btn-error" on:click={del}>{$t("button.delete2")}</button>
  </div>
</div>
