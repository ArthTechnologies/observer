<script lang="ts">
  import Footer from "$lib/components/layout/Footer.svelte";
  import Navbar from "$lib/components/layout/Navbar.svelte";

  function reset() {
    let email = document.getElementById("email").value;
    let cc = document.getElementById("cc").value;
    let password = document.getElementById("password").value;
    let confPassword = document.getElementById("confirmPassword").value;

    if (password != confPassword) {
      alert("Passwords do not match");
    } else {
      fetch(
        "https://api.arthmc.xyz/accounts/email/resetPassword?password=" +
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
            alert(data.reason);
          } else {
            alert("Password reset successfully");
            window.location.href = "/signin";
          }
        });
    }
  }
</script>

<Navbar navType="welcome" />

<div class="hero min-h-screen ">
  <div class="hero-content flex flex-col place-items-start">
    <a href="/" class="btn btn-sm">Go Back</a>
    <div
      class="bg-base-200 rounded-box w-full max-w-3xl p-5 border border-dashed"
    >
      <p class="font-bold">Reset Password</p>
      <p class="text-gray-500">
        For your account's security, you can only attempt this 5 times.
      </p>
      <div class="flex flex-col mt-2">
        <label for="email " class="font-bold">Email</label>
        <input id="email" class="input input-bordered " type="text" />
      </div>
      <div class="flex flex-col mt-2">
        <label for="email " class="font-bold"
          >Last 4 digits of your Credit Card</label
        >
        <input id="cc" class="input input-bordered " type="text" />
      </div>
      <div class="flex flex-col mt-2">
        <label for="password " class="font-bold">New Password</label>
        <input id="password" class="input input-bordered " type="password" />
      </div>
      <div class="flex flex-col mt-2">
        <label for="confirmPassword " class="font-bold"
          >Confirm New Password</label
        >
        <input
          id="confirmPassword"
          class="input input-bordered "
          type="password"
        />
      </div>
      <button on:click={reset} class="btn btn-secondary mt-5"
        >Reset Password</button
      >
    </div>
  </div>
</div>
