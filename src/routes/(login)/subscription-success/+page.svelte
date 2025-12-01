<script>
    import { apiurl } from "$lib/scripts/req";
  import { onMount } from "svelte";
  import { alert } from "$lib/scripts/utils";


  onMount(async () => {
    let reservedId = localStorage.getItem("reservedId");
    let btest = false;
    btest = localStorage.getItem("btest");
    let referrer = localStorage.getItem("referrer") || "none";
    let campaign_name = localStorage.getItem("campaign_name") || "none";
    fetch("https://ocelot.arthmc.xyz/analytics/sale?btest="+btest+"&referrer="+referrer+"&campaign_name="+campaign_name, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      }
    });
    fetch(apiurl + "server/claim/" + reservedId, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.msg.includes("Success")) {
          //alert(data.msg, "error");
        }
      });
  });
  </script>

<div class="flex justify-center hero bg-base-100 rounded-xl">
  <div class="flex flex-col hero-content">
    <div class="space-x-10">
      <p class="text-left text-2xl">
        Almost Done! All you have to do now is create a server.
      </p>
    </div>
    <a href="/newserver">
      <button class="btn btn-secondary btn-outline">
        Create New Server
      </button></a
    >
  </div>
</div>
