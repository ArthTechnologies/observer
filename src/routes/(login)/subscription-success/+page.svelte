<script>
  import { apiurl } from "$lib/scripts/req";
  import { goto } from "$app/navigation";
  import { onMount } from "svelte";

  onMount(async () => {
    let reservedId = localStorage.getItem("reservedId");



    fetch(apiurl + "server/claim/" + reservedId, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data.msg.includes("Success")) {
          //alert(data.msg, "error");
        }
      });

    // Redirect to newserver with fromSubscription flag
    goto("/newserver?fromSubscription=true");
  });
</script>
