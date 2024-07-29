<script lang="ts">
  import ServerCard from "$lib/components/ui/ServerCard.svelte";
  import UncreatedServerCard from "$lib/components/ui/UncreatedServerCard.svelte";
  import ServerSkele from "$lib/components/ui/ServerSkele.svelte";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { apiurl, getServers } from "$lib/scripts/req";
  import { browser, dev } from "$app/environment";
  import { goto } from "$app/navigation";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
  let servers: any[] = [];
  //Example

  var id = 0;

  let noserverlock = false;
  let amountOfServersForSkeletons = 1;

  let res2 = {};
  let email: string = "";
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
              }
              promise = getServers(email).then((response) => {
                if (browser) {
                  noserverlock = true;
                  console.log(response);
                  if (response.amount != "undefined") {
                    id = response.amount;
                  }
                  servers = response;
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
</script>

<div class="flex flex-col items-center space-y-20">
  <div>
    <div class="text-center px-5 text-3xl font-semibold divider">
      {#if noserver}
        <div class="divider" />
        Looks like you dont have any servers. Click<a
          class="link link-primary"
          href="/newserver"
        >
          here</a
        > to make one.
      {:else}
        {$t("homepage.title")}
      {/if}
    </div>

    <div class="flex flex-wrap justify-center" id="serverList">
      {#await promise}
        {#each Array.from({ length: amountOfServersForSkeletons }) as _}
          <ServerSkele />
        {/each}
      {:then}
        {#each servers as server}
          {#if !JSON.stringify(server).includes("not created yet")}
            <ServerCard {...server} />
          {:else}
            <UncreatedServerCard id={server.split(":")[0]} />
          {/if}
        {/each}
      {/await}
    </div>
  </div>
</div>

<style lang="scss">
  //
</style>
