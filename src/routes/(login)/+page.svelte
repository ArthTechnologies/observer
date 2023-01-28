<script lang="ts">
  import ServerCard from "$lib/components/ui/ServerCard.svelte";
	import ServerSkele from "$lib/components/ui/ServerSkele.svelte";
  import { t, locale, locales } from "$lib/scripts/i18n";
  import { getServers } from "$lib/scripts/req";
  import { browser, dev } from "$app/environment";
  import { goto } from "$app/navigation";

  // NOTE: the element that is using one of the theme attributes must be in the DOM on mount
	let servers = [];
  //Example
  let name = "world";

  var id = 0;
  var servercreate = false;
  let names = [];
  let softwares = [];
  let versions = [];
		let noserverlock = false;
  function newserver() {}
  let res2 = {};
  let email: string = "";
  if (browser) {
    email = localStorage.getItem("accountEmail");

  }

  // getServers and store "amount" given in the response in a variable
  let promise = getServers(email).then((response) => {
    if (browser) {
			noserverlock = true;
      console.log(response);
      if (response.amount != "undefined") {
        id = response.amount;
      }
      DOM(response);
    }
  });
  function DOM(res2) {
    for (var i = 0; i < id; i++) {
      servers.push({
				name: res2.names[i],
      software: res2.softwares[i],
      version: res2.versions[i],
      id: res2.ids[i],
      state:  res2.states[i],
			});



      
    }
  }


  let noserver = false;

   if (id == 0 && noserverlock) {
    noserver = true;
  }

</script>

<div class="flex flex-col items-center space-y-20 mb-12">
  <div>
    <div class="text-center px-10 text-3xl font-semibold divider object-top">
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
      <!-- <ServerCard name="Server Name" loader="Loader" version="Version" /> -->
{#await promise}
	<ServerSkele/>
{:then}
	
				{#each servers as server}
	<ServerCard {...server}/>
{/each}
{/await}
    </div>
  </div>
</div>

<style lang="scss">
  //
</style>
