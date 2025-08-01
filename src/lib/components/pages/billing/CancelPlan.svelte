<script>
    import { t } from "$lib/scripts/i18n";
    import { apiurl } from "$lib/scripts/req";
    import { alert } from "$lib/scripts/utils";
    import { AlertTriangle, ArrowDownUp, Loader, X } from "lucide-svelte";
    export let subscription = {};
    let loading = false;

    function cancel() {
        loading=true;
        fetch(apiurl+"x/lapis/cancel/"+subscription.id+"?mode=stripe", {
      method: "POST",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "canceled") {
            alert("Subscription succesfully canceled.", "success")
            const event = new CustomEvent("refresh");
                  document.dispatchEvent(event);
        } else {
            alert("Error canceling subscription. Please contant support.")
        }
        
        
      });

        
    }
    
</script>
   <label for="delete" class="btn btn-error btn-sm" 
                                            >
                                                <X size=16 class="mr-1"/>
                                                Cancel
</label>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="delete"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
    <div
      class="bg-warning w-86  rounded-lg text-black p-2 flex items-center space-x-2 mt-2"
    >
      <AlertTriangle />
      <span class="text-sm">You will be unable to use your server, and your data may be deleted afted 7 days.</span>


    </div>


      <button id="delButton" class="btn btn-error mt-8" on:click={cancel}>
        {#if loading}
          <Loader class="mr-1.5 animate-spin" />Cancelling
        {:else}
          Cancel{/if}</button
      >
</div></div>