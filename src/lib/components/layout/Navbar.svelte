<script lang="ts">
  import ThemeToggle from "./../buttons/ThemeToggle.svelte";
  import AccountButton from "./../buttons/AccountButton.svelte";
  import Home from "./../buttons/Home.svelte";
  import Billing from "./../buttons/Billing.svelte";
  import NewServer from "./../buttons/NewServer.svelte";
  import Settings from "./../buttons/Settings.svelte";
  import { browser } from "$app/environment";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { url } from "inspector";
  import { setDefaultResultOrder } from "dns";
  export let navType: NavType;

  let enablePay = true;
  let enableAuth = "true";

  //sends user to /signin if localstorage token is ""
  if (browser) {
    enablePay = localStorage.getItem("enablePay");
    enableAuth = localStorage.getItem("enableAuth");
    if (localStorage.getItem("theme") == "light") {
    }
  }

  let login = false;
  type NavType = "default" | "welcome";
  if (typeof navigator !== "undefined") {
    console.log(navigator.language);

    //set locale to the browser's language
    locale.set(navigator.language);
  }
  if (browser) {
    console.log("yooooo" + window.location.pathname);
    if (localStorage.getItem("token") == null) {
      localStorage.setItem("token", "");
    }
    if (localStorage.getItem("token") !== "") {
      login = true;
    } else {
      login = false;
    }
  }
  console.log(login);

  onMount(async () => {
    if (browser) {
      //this listens for redricts
      window.addEventListener("redrict", function (e) {
        checkPage();
        console.log("checking page");
      });
      setTimeout(function () {
        enableAuth = localStorage.getItem("enableAuth");
        console.log(enableAuth + "authd");
        if (
          localStorage.getItem("token") == "" &&
          enableAuth == "true" &&
          navType == "default"
        ) {
          goto("/login");
        }
      }, 500);
    }
  });

  function checkPage() {
    if (browser) {
      setTimeout(() => {
        highlightIcon();
        setTimeout(() => {
          highlightIcon();
          setTimeout(() => {
            highlightIcon();
          }, 150);
        }, 100);
      }, 50);
    }
  }
  checkPage();

  function highlightIcon() {
    let pathname = window.location.pathname;
    if (
      pathname.split("")[pathname.split("").length - 1] == "/" &&
      pathname != "/"
    ) {
      pathname = pathname.slice(0, pathname.length - 1);
    }
    console.log("pathname " + pathname);
    switch (pathname) {
      case "/":
        document.getElementById("servers").classList.add("text-primary");
        document.getElementById("servers2").classList.add("text-primary");

        document.getElementById("newserver").classList.remove("text-primary");
        document.getElementById("account").classList.remove("text-primary");
        document.getElementById("billing").classList.remove("text-primary");
        break;
      case "/billing":
        document.getElementById("billing").classList.add("text-primary");

        document.getElementById("servers").classList.remove("text-primary");
        document.getElementById("servers2").classList.remove("text-primary");
        document.getElementById("newserver").classList.remove("text-primary");
        document.getElementById("account").classList.remove("text-primary");
        break;
      case "/newserver":
        document.getElementById("billing").classList.remove("text-primary");
        document.getElementById("newserver").classList.add("text-primary");

        document.getElementById("servers").classList.remove("text-primary");
        document.getElementById("servers2").classList.remove("text-primary");
        document.getElementById("account").classList.remove("text-primary");
        break;
      case "/account":
        document.getElementById("account").classList.add("text-primary");

        document.getElementById("servers").classList.remove("text-primary");
        document.getElementById("servers2").classList.remove("text-primary");
        document.getElementById("newserver").classList.remove("text-primary");
        document.getElementById("billing").classList.remove("text-primary");
        break;
    }
  }
</script>

{#if navType === "default"}
  <div class="navbar bg-base-300 px-4 max-sm:pl-2" on:click={checkPage}>
    <div class="flex-1 h-[3rem]">
      <a class="btn btn-ghost normal-case text-xl" href="/"
        ><img
          src="/images/sitelogo.svg"
          alt="Arth"
          width="105"
          height="105"
        /></a
      >
    </div>
    <div class="flex-1 md:flex-none space-x-2 navbar-end">
      <a id="servers" href="/" class=" btn btn-ghost rounded-lg hidden md:flex"
        >{$t("navbar.servers")}</a
      >

      <Home />

      <NewServer />
      {#if enablePay == "true"}
        <Billing />
      {:else}
        <div id="billing"></div>
        <!-- This is to prevent errors in the checkPage function-->
      {/if}

      <ThemeToggle />
      <AccountButton loginStatus={login} />
    </div>
  </div>
{:else if navType === "welcome"}
  <div class="navbar fixed justify-between px-6 z-10">
    <a
      class="btn btn-ghost normal-case text-xl invisible sm:visible"
      href="https://arthmc.xyz/"
    >
      <img src="/images/sitelogo.svg" alt="Arth" width="105" height="105" />
    </a>
    <ThemeToggle />
  </div>
{/if}
