<script>
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { alert } from "$lib/scripts/utils";
  import { fade } from "svelte/transition";

  let isLoggedIn = false;

  function login() {
    if (browser) {
      let input = document.getElementById("input")?.value;
      document.getElementById("input").value = "";
      fetch(apiurl + "dashboard/verifyToken?tempToken=" + input, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            isLoggedIn = true;
          } else {
            alert("Invalid token");
          }
        });
    }
  }
</script>

{#if !isLoggedIn}
  <div class="absolute mt-4 w-96" transition:fade={{ duration: 600 }}>
    <div class="bg-base-100 w-96 shadow-xl">
      <figure>
        <img src="images/dashboard_bg.png" alt="bg" class="rounded-t-lg" />
      </figure>
      <div class="card-body bg-base-300 rounded-b-lg">
        <h2 class="card-title">Dashboard</h2>
        <p>Enter your temporary token</p>
        <div class="flex gap-2">
          <label class="input input-bordered flex items-center gap-2 w-2/3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              fill="currentColor"
              class="h-4 w-4 opacity-70"
            >
              <path
                fill-rule="evenodd"
                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                clip-rule="evenodd"
              />
            </svg>
            <input
              id="input"
              type="text"
              placeholder="Type here"
              class="bg-base-100 w-3/4"
            />
          </label>
          <button class="btn btn-neutral" on:click={login}>Enter</button>
        </div>
      </div>
    </div>
  </div>
{/if}
