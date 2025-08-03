<script>
    import { t } from "$lib/scripts/i18n";
    import { apiurl } from "$lib/scripts/req";
    import { alert } from "$lib/scripts/utils";
    import { AlertTriangle, ArrowDownUp, Loader, X } from "lucide-svelte";
    import Plans from "./Plans.svelte";
    import { browser } from "$app/environment";
    import { onMount } from "svelte";
    export let subscription = {};
    let loading = true;
    let loading2 = false;
    let billQuarterly = true;

    let priceId = null;
    let preview = {}

  onMount(() => {
    window.addEventListener('planSelect', handlePlanSelect);
  });

      function handlePlanSelect(event) {
    priceId = event.detail.priceId;
    billQuarterly = event.detail.billQuarterly;
    console.log('Global plan selected:', priceId, '| Quarterly:', billQuarterly);
    fetch(apiurl+"x/stripe/changePreview/"+subscription.id+"/"+priceId+"?mode=stripe", {
      method: "GET",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
       preview = json;
       loading = false;
      });
  }

function confirm() {
  loading2 = true;
  fetch(apiurl + "x/stripe/change/" + subscription.id + "/" + priceId+"?mode=stripe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      username: localStorage.getItem("accountEmail"),
      token: localStorage.getItem("token"),
    },
    body: JSON.stringify({
      billQuarterly: billQuarterly
    })
  })
    .then((res) => res.json())
    .then((json) => {
      loading2 = false;
 
        alert("Changed Plan", "success");
            const event = new CustomEvent("refresh");
                  document.dispatchEvent(event);
    });
  }

    
    
</script>
   <label for="delete" class="btn btn-neutral btn-sm" 
                                            >
                                                <ArrowDownUp size=16 class="mr-1"/>
                                                Change Plan
</label>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative h-[80%]">
    <label
      for="delete"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    <h3 class="text-lg font-bold">{$t("server.delete.title")}</h3>
   <Plans/>
   {#if !loading}
   

<div class="bg-[#525f7f] p-5 rounded-lg mt-5">
    <table class="table bg-neutral">
    <!-- head -->
    <thead class="">
      <tr>
       
        <th>Item</th>
        <th>Price</th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr>
        <td>Subtotal</td>
        <td>{preview.subtotal}</td>
      </tr>
      <!-- row 2 -->
{#if preview.discount}
      <tr>
        <td>Discount</td>
      <td>{preview.discount}</td>
      </tr>
      {/if}
      <!-- row 3 -->
      <tr>
        <td>Tax</td>
        <td>{preview.tax}</td>
      </tr>
            <tr>
        <td>Total</td>
         <td>{preview.total}</td>
      </tr>
    </tbody>
  </table>
{#if !loading2}
  <button class="btn w-full btn-info btn-ms mt-5" on:click={confirm}>Confirm</button>
  {:else}
  <button class="btn w-full btn-info btn-ms mt-5 opacity-50 pointer-events-none"> <Loader class="mr-1.5 animate-spin" /> Loading</button>
  {/if}
</div>

{/if}
  



</div></div>