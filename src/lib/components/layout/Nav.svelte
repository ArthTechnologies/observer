<script lang="ts">
  import ServerCard from "$lib/components/ui/ServerCard.svelte";
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
    Crown,

    Currency,

    DollarSign


  } from "lucide-svelte";


    import SupportModal from "../buttons/SupportModal.svelte";
    import LanguageSwitcherModal from "../buttons/LanguageSwitcherModal.svelte";
    import ExpiredServerCard from "../ui/ExpiredServerCard.svelte";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  let servers: any[] = [];
  //Example

  var id = undefined;

  let devMode = false;
  let providerMode = true;

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
    providerMode = localStorage.getItem("providerMode") == "true";
    email = localStorage.getItem("accountEmail");
    if (localStorage.getItem("token") == undefined) goto("/login");
    amountOfServersForSkeletons = localStorage.getItem("amountOfServers");
    if (localStorage.getItem("devMode") == "true") {
      console.log("dev mode");  
      devMode = true;
    }
  }

  // getServers and store "amount" given in the response in a variable
  let promise;

  if (browser) {
     

     loadServers();
     window.addEventListener("redrict", loadServers);
     window.addEventListener("refreshIcons", refreshIcons)

  }
  function refreshIcons() {
    if (browser) {
      console.log("refreshing icons" + servers);
      for (let i = 0; i < servers.length; i++) {
        let id = servers[i].id;


      fetch(apiurl + "server/" + id + "/settings/icon",
        {
          method: "GET",
          headers: {
            token: localStorage.getItem("token"),
            username: localStorage.getItem("accountEmail"),
          },
        })
        .then((response) => response.blob())
        .then((blob) => {
          if (blob.size > 0) {
            let icon = URL.createObjectURL(blob);
            document.getElementById("navIcon" + id).src = icon;

          } else {
            icon = "/images/placeholder.webp";
          }
        });
    }
  }
  }
  function loadServers() {

    promise = getServers(email).then((response) => {
      console.log(JSON.stringify(response));
      if (browser && response != "error") {

        noserverlock = true;
        console.log(response);
        if (response.amount != "undefined") {
          id = response.amount;
        }
        servers = response;
        refreshIcons();
        if (
          servers.length == 0
        ) {
          if (localStorage.getItem("reservedId") != null) {
          claim();
        } else {
          fetch(apiurl + "server/reserve",
      {
        method: "GET",
        headers: {
          "username": localStorage.getItem("accountEmail"),
          "token": localStorage.getItem("token"),
        },
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (!data.atCapacity && data.id > -1) {
          localStorage.setItem("reservedId", data.id);
          claim();
        }
      });
        }
    
        function claim() {
          let reservedId = localStorage.getItem("reservedId");
          console.log("claiming an id..." + reservedId);
          fetch(apiurl + "server/claim/" + reservedId, {
            method: "GET",
            headers: {
              token: localStorage.getItem("token"),
              username: localStorage.getItem("accountEmail"),
            },
          })
            .then((res) => res.json())
            .then((res) => {

              console.log(res);
             
              if (!res.msg.includes("Success") && !res.msg.includes("already claimed")) {
               
                goto("/billing");
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
                    console.log(servers[0])
                    if (typeof servers[0] != "string") {
                   
             
                      goto("/server/" + (10000 + parseInt(servers[0].id)));
                    }
                    update(servers[0].id, false);
                  }
                }
              });
            });
        }
      }else if (servers.length > 0 && typeof servers[0] == "string") {
         
         createServer( parseInt(servers[0].split(":")[0]))
       }
    } else {
        servers[0] = "-1:invalid accoount";
        setTimeout(()=>{//logout(); 
        }, 5000);

    }
    });
  }

   function getSlug() {
           if (window.location.pathname.includes("/server")) {
      slug = parseInt(window.location.pathname.split("/")[2]);
     } else if (window.location.pathname.includes("/newserver")) {
      console.log("TTTTTTT" + window.location.search.split("?id=")[1]);
      slug = parseInt(window.location.search.split("?id=")[1]);
      console.log("slug is " + slug);
     } else {
      slug = 0;
     }
   }
  let noserver = false;

  if (id == 0 && noserverlock) {
    noserver = true;
  }

  function update(id, redirect) {
    console.log("updating");
    id = parseInt(id);
   
       
    

      if (redirect) {
      for (let i = 0; i < servers.length; i++) {
        let newslug = 10000 + parseInt(id);
        if (parseInt(servers[i].id) + 10000 == newslug) {
          console.log("selecting server " + servers[i].name  + " with id " + servers[i].id + " " + id);
          select(servers[i]);
           slug = newslug;

            window.location.href = "/server/" + newslug;

          }
        }
      } else {
 getSlug();
      setTimeout(() => {
        getSlug();
      }, 50);
      setTimeout(() => {
        getSlug();
   
      }, 250);
      console.log("SLUG IS " + slug)
      }
    
  }

  function select(server) {
    console.log("server");
    
    localStorage.setItem("serverName", server.name);
    localStorage.setItem("serverID", server.id);
    localStorage.setItem("serverSoftware", server.software);
    localStorage.setItem("serverVersion", server.version);
    localStorage.setItem("serverCardRedrict", "true");
    localStorage.setItem("serverDynmap", server.webmap);
    localStorage.setItem("serverVoicechat", server.voicechat);
    localStorage.setItem("fileAccessKey", server.fileAccessKey);
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

  function createServer(id) {

        slug = id;
        goto("/newserver?id="+id);
 

  }
  
</script>

<div
  class="shrink-0 md:fixed md:h-screen bg-base-100 px-5 py-3 md:py-5 flex md:flex-col items-center justify-between w-full md:w-[22%] border-r-4 border-base-300"
>
  <div class="flex md:flex-col items-center w-full">
    <img src="/favicon.png" class="w-12 md:hidden" />
    <img src="/images/sitelogo.svg" class="w-32 lg:w-36 max-md:hidden" />
    <div class="divider max-md:divider-horizontal max-md:mx-2.5"></div>

    <div class="flex md:flex-col gap-3 w-fit md:w-full">
      {#await promise}
        <div
          class="pointer-events-none flex gap-2.5 items-center p-4 w-full lg:h-[5.5rem] rounded-lg bg-gradient-to-b from-base-300 to-[#2a2a36] cursor-pointer"
        >
          <ServerSkele />
        </div>
        <div
          class="pointer-events-none flex gap-2.5 items-center p-4 w-full lg:h-[5.5rem] rounded-lg bg-gradient-to-b from-base-300 to-[#2a2a36] cursor-pointer"
        >
          <ServerSkele />
        </div>
      {:then}
        {#each servers as server}
{#if typeof server == "string" && server.split(":")[1] == "not created yet"}
{#if parseInt(server.split(":")[0]) == -1}
Invalid Account
{:else}

{#if parseInt(server.split(":")[0]) == slug}
<a
  on:click={() => createServer(parseInt(server.split(":")[0]))}
  id="serverCard{parseInt(server.split(":")[0])}"
  class="primaryGradientStroke pointer-events-none flex md:max-lg:px-4 gap-2.5 items-center p-4 w-12 sm:w-32 truncate md:w-full md:h-[5.5rem] rounded-lg bg-gradient-to-b from-base-300 to-[#2a2a36] cursor-pointer"
>
<UncreatedServerCard id={parseInt(server.split(":")[0])}/>
</a>
{:else}
<a
  on:click={() => createServer(parseInt(server.split(":")[0]))}
  id="serverCard{parseInt(server.split(":")[0])}"
  class="neutralGradientStrokeB flex md:max-lg:px-4 gap-2.5 items-center p-4 w-12 sm:w-32 truncate md:w-full md:h-[5.5rem] rounded-lg bg-base-200 cursor-pointer"
>
<UncreatedServerCard id={parseInt(server.split(":")[0])}/>
</a>
{/if}
{/if}
{:else if typeof server == "string" && server.split(":")[1] == "no valid subscription"}
<a
  href="/billing"
  id="serverCard{parseInt(server.split(":")[0])}"
  class="neutralGradientStrokeB flex md:max-lg:px-4 gap-2.5 items-center p-3 w-12 sm:w-32 truncate md:w-full md:h-[5.5rem] rounded-lg bg-base-200 cursor-pointer"
>
<ExpiredServerCard id={parseInt(server.split(":")[0])} timestamp={server.split(":")[2]}/>
</a>
{:else}
{#if parseInt(server.id) + 10000 == slug}
<a
  id="serverCard{10000 + parseInt(server.id)}"
  class="primaryGradientStroke pointer-events-none flex gap-2.5 items-center p-4 w-14 sm:w-32 truncate md:w-full md:h-[5.5rem] rounded-xl bg-gradient-to-b from-base-300 to-[#2a2a36] cursor-pointer"
>
  <ServerCard {...server} />
</a>
{:else}
<a
  on:click={() => update(server.id, true)}
  id="serverCard{10000 + parseInt(server.id)}"
  class="neutralGradientStrokeB flex gap-2.5 items-center p-4 w-14 sm:w-32 truncate md:w-full md:h-[5.5rem] rounded-xl bg-base-200 cursor-pointer"
>
  <ServerCard {...server} />
</a>
{/if}
{/if}
        {/each}
      {/await}
    </div>
  </div>
  <div class="max-md:hidden flex flex-col w-full gap-1">
    {#if providerMode}
        <a on:click={()=>{update(undefined, false)}} href="/referrals" class="font-ubuntu btn btn-ghost btn-ms flex justify-start hover:text-primary" style="gap: 0.4rem;">
   Get <span class="text-[#edcfb0]">50%</span> off next month</a
    >
    {/if}
    <a on:click={()=>{update(undefined, false)}} href="/account" class="font-ubuntu btn btn-ghost btn-ms flex justify-start hover:text-primary">
      <User size="20" />Account</a
    >
{#if providerMode}

    <a on:click={()=>{update(undefined, false)}} href="/billing" class="font-ubuntu btn btn-ghost btn-ms flex justify-start hover:text-primary">
      <ShoppingCart size="20" />Subscriptions</a
    >
    {/if}

    <button onclick="modal_language.showModal()" class="font-ubuntu btn btn-ghost btn-ms flex justify-start hover:text-primary">
      <Languages size="20" />Language</button
    >


    <button onclick="modal_support.showModal()" class="font-ubuntu btn btn-ghost btn-ms flex justify-start hover:text-primary">
      <HelpCircle size="20" />Get Support</button
    >
    {#if devMode}
    <a href="/dashboard" class="btn btn-ghost btn-ms flex justify-start hover:text-primary">
      <Crown size="20" />Dashboard</a
    >
    {/if}
    <button class="btn btn-ghost btn-ms flex justify-start hover:text-primary" on:click={logout}>
      <LogOut size="20" />Logout</button
    >
  </div>
  <div class="md:hidden flex gap-1">

    <div class="dropdown dropdown-end">
      <div tabindex="0" role="button" class="btn m-1 btn-ghost"><Menu /></div>
      <ul
        tabindex="0"
        class="dropdown-content menu bg-base-300 rounded-box z-[1] w-52 p-2 shadow-xl"
      >
        <li><a on:click={()=>{update(undefined, false)}} href="/account">Account</a></li>
        {#if providerMode}
        <li><a on:click={()=>{update(undefined, false)}} href="/billing">Subscriptions</a></li>
        {/if}
<li>        <a onclick="modal_language.showModal()">
  Language</a
 ></li>
 <li>        <a onclick="modal_support.showModal()">
  Get Support</a
 ></li>

        <li><a on:click={logout}>Logout</a></li>
      </ul>
    </div>
  </div>
</div>
<LanguageSwitcherModal/>
<SupportModal/>
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
    background: linear-gradient(0deg, rgb(139, 59, 44), #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }

  .neutralGradientStrokeB {
    position: relative;

    z-index: 1;
  }

  .neutralGradientStrokeB:hover::before {
    content: "";
    position: absolute;
    top: 0px;

    bottom: 0px;
    left: 0px;
    right: 0px;
    border-radius: inherit; /* Inherits button's border-radius */
    padding: 3px; /* Space between button and border */
    background: linear-gradient(0deg, #2a354e, #ffffff00, #ffffff00, #ffffff00);
    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: destination-out;
    mask-composite: exclude;
    z-index: -1;
  }
</style>
