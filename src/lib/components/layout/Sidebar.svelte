<script lang="ts">
  import ServerCardNew from "$lib/components/ui/ServerCardNew.svelte";
  import UncreatedServerCard from "$lib/components/ui/UncreatedServerCard.svelte";
  import ServerSkele from "$lib/components/ui/ServerSkele.svelte";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { apiurl, getServers } from "$lib/scripts/req";
  import { browser, dev } from "$app/environment";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";
  import { parse } from "path";
  import {
    HelpCircle,
    Languages,
    LogOut,
    Menu,
    ShoppingCart,
    User,
  } from "lucide-svelte";
  import ServerSkeleNew from "../ui/ServerSkeleNew.svelte";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  let servers: any[] = [];
  //Example

  var id = 0;

  let noserverlock = false;
  let amountOfServersForSkeletons = 1;

  let slug = 0;
  let email: string = "";
  onMount(() => {
    if (browser) {
      update(undefined, false);
    }
  });
  if (browser) {
    email = localStorage.getItem("accountEmail");
    amountOfServersForSkeletons = localStorage.getItem("amountOfServers");
  }

  // getServers and store "amount" given in the response in a variable
  let promise;

  if (browser) {
    promise = getServers(email).then((response) => {
      if (browser) {
        noserverlock = true;
        console.log(response);
        if (response.amount != "undefined") {
          id = response.amount;
        }
        servers = response;
        if (
          servers.length == 0 ||
          !JSON.stringify(servers).includes(":not created yet")
        ) {
          console.log("claiming an id...");
          fetch(apiurl + "server/claimId", {
            method: "GET",
            headers: {
              token: localStorage.getItem("token"),
              username: localStorage.getItem("accountEmail"),
            },
          })
            .then((res) => res.json())
            .then((res) => {
              console.log(res);
              if (res.msg == "You haven't paid for a server.") {
                goto("/billing");
                //this tells the navbar to update the icon that is highligted
                window.dispatchEvent(new Event("redrict"));
              }
              promise = getServers(email).then((response) => {
                if (browser) {
                  noserverlock = true;
                  console.log(response);
                  if (response.amount != "undefined") {
                    id = response.amount;
                  }
                  servers = response;
                  let slug2 = window.location.pathname;
                  if (slug2 == "/") {
                    goto("/server/" + (10000 + parseInt(servers[0].id)));
                    update(servers[0].id, false);
                  }
                }
              });
            });
        }
      }
    });
  }

  let noserver = false;

  if (id == 0 && noserverlock) {
    noserver = true;
  }

  function update(id, redirect) {
    console.log("updating");
    if (id == undefined) {
      setTimeout(() => {
        slug = window.location.pathname.split("/")[2];
      }, 10);
      setTimeout(() => {
        slug = window.location.pathname.split("/")[2];
      }, 50);
      setTimeout(() => {
        slug = window.location.pathname.split("/")[2];
      }, 250);
    } else {
      slug = 10000 + parseInt(id);

      for (let i = 0; i < servers.length; i++) {
        if (parseInt(servers[i].id) + 10000 == slug) {
          console.log(slug);
          select(servers[i]);
          if (redirect) {
            goto("/server/" + slug);
            //reload
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        }
      }
    }
  }

  function select(server) {
    console.log("server");

    localStorage.setItem("serverName", server.name);
    localStorage.setItem("serverID", server.id);
    localStorage.setItem("serverSoftware", server.software);
    localStorage.setItem("serverVersion", server.version);
    localStorage.setItem("serverCardRedrict", "true");
    localStorage.setItem("serverWebmap", server.webmap);
    localStorage.setItem("serverVoicechat", server.voicechat);
    if (server.subdomain != undefined) {
      localStorage.setItem("serverSubdomain", server.subdomain);
    } else {
      localStorage.removeItem("serverSubdomain");
    }
  }

  function logout() {
    //clear all local storage
    localStorage.clear();
    window.location.href = "/login";
  }
</script>

<div
  class="shrink-0 md:fixed md:h-screen bg-base-100 px-5 py-3 md:py-5 flex md:flex-col items-center justify-between max-md:w-full"
>
  <div class="flex md:flex-col items-center w-full">
    <img src="/favicon.png" class="w-12 md:hidden" />
    <img src="/images/sitelogo.svg" class="w-40 max-md:hidden" />
    <div class="divider max-md:divider-horizontal max-md:mx-2.5"></div>

    <div class="flex md:flex-col gap-3 w-fit md:w-full">
      {#await promise}
        <div
          class="pointer-events-none flex gap-2.5 items-center p-3 w-full lg:h-[5.25rem] rounded-lg bg-gradient-to-b from-base-200 to-[#1a2b40] cursor-pointer"
        >
          <ServerSkeleNew />
        </div>
        <div
          class="pointer-events-none flex gap-2.5 items-center p-3 w-full lg:h-[5.25rem] rounded-lg bg-gradient-to-b from-base-200 to-[#1a2b40] cursor-pointer"
        >
          <ServerSkeleNew />
        </div>
      {:then}
        {#each servers as server}
          {#if parseInt(server.id) + 10000 == slug}
            <a
              id="serverCard{10000 + parseInt(server.id)}"
              class="primaryGradientStroke pointer-events-none flex md:max-lg:px-4 gap-2.5 items-center p-3 w-14 sm:w-32 truncate md:w-full md:h-[5.25rem] rounded-lg bg-gradient-to-b from-base-200 to-[#1a2b40] cursor-pointer"
            >
              <ServerCardNew {...server} />
            </a>
          {:else}
            <a
              on:click={() => update(server.id, true)}
              id="serverCard{10000 + parseInt(server.id)}"
              class="neutralGradientStroke flex md:max-lg:px-4 gap-2.5 items-center p-3 w-14 sm:w-32 truncate md:w-full md:h-[5.25rem] rounded-lg bg-base-200 cursor-pointer"
            >
              <ServerCardNew {...server} />
            </a>
          {/if}
        {/each}
      {/await}
    </div>
  </div>
  <div class="max-md:hidden flex flex-col w-full gap-1">
    <button class="btn btn-ghost btn-sm flex justify-start">
      <User size="20" class="mr-2" />Account</button
    >
    <button class="btn btn-ghost btn-sm flex justify-start">
      <ShoppingCart size="20" class="mr-2" />Subscriptions</button
    >

    <button class="btn btn-ghost btn-sm flex justify-start">
      <Languages size="20" class="mr-2" />Language</button
    >
    <button class="btn btn-ghost btn-sm flex justify-start">
      <HelpCircle size="20" class="mr-2" />Get Support</button
    >
    <button class="btn btn-ghost btn-sm flex justify-start" on:click={logout}>
      <LogOut size="20" class="mr-2" />Logout</button
    >
  </div>
  <div class="md:hidden flex gap-1">
    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn m-1 btn-ghost"><Menu /></div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow-xl"
      >
        <li><a>Account</a></li>
        <li><a>Subscriptions</a></li>
        <li><a>Language</a></li>
        <li><a>Get Support</a></li>
        <li><a>Logout</a></li>
      </ul>
    </div>
  </div>
</div>

<style>
  .primaryGradientStroke {
    position: relative;

    z-index: 1;
  }

  .primaryGradientStroke::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #135664, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }

  .neutralGradientStroke {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStroke:hover::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 2.5px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>
