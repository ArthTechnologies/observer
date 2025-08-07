<script>
    import { browser } from "$app/environment";
    import { t } from "$lib/scripts/i18n";
    import { apiurl } from "$lib/scripts/req";
    import { alert } from "$lib/scripts/utils";
    import { now } from "svelte/internal";
    let email = "xxxxx";
    let coupon;
    let newCoupon;
    let used = false;
    let price = "...";
    let halfOff = "...";
    if (browser) {
        email = localStorage.getItem("email");
        fetch(apiurl+"referrals/price?email="+email+"&mode=stripe", {
        method: "GET",
        headers: {
          username: localStorage.getItem("accountEmail"),
          token: localStorage.getItem("token"),
        },
        })
          .then((res) => res.json())
          .then((json) => {
            price = json.price;
            halfOff = json.half_off;
          });
        coupon = "coupon_" + email.split('')[3]+ email.split('')[2] + email.split('')[4] + email.split('')[1] + email.split('')[5];
        fetch(apiurl+"referrals/referred_coupon?email="+email, {
      method: "GET",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        if (!json.includes("coupon_")) {
            alert("Issue setting up referral coupons.")
        }
      });
    

            fetch(apiurl+"referrals/referrer_coupon/"+coupon+"?email="+email, {
      method: "GET",
      headers: {
        username: localStorage.getItem("accountEmail"),
        token: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((json) => {
        used = json.used
        if (used) {
            newCoupon = json.coupon;
        }
    });
      }

</script>
<div class="flex place-content-center">
  <div class="flex flex-col grow max-w-[55rem] space-y-6">
    <div class="flex flex-col items-center">
      <h1 class="divider px-10 text-3xl font-semibold">Referral Program</h1>
       <table class="table bg-neutral bg-opacity-50 mt-8  w-[20rem]">
    <!-- head -->
    <thead class="">
      <tr>
       
        <th>Bill for next month</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <!-- row 1 -->
      <tr>
        <td>Current charge</td>
        <td>{price}</td>
      </tr>

      <!-- row 3 -->
      <tr>
        <td>Charge if you refer 1 person</td>
        <td class="font-bold">{halfOff}</td>
      </tr>
          
    </tbody>
  </table>
      <div class="card bg-base-100 shadow-lg transition-shadow mt-4 w-[20rem]">
                            <div class="card-body">
                                <div class="flex flex-col gap-4">
                                    <p class="text-xl font-bold text-white">
                                        Step 1
                                    </p>
                                       <p class="">
                                        Have a friend signup with the code <code>coupon_{email.split('')[3]+ email.split('')[2] + email.split('')[4] + email.split('')[1] + email.split('')[5]}</code>. They will get a 50% discount as well.
                                    </p>
                                              <p class="text-xl font-bold text-white">
                                        Step 2
                                    </p>
                                       <p class="">
                                    {#if !used}
                                        It looks like your friend hasn't paid for a subscription using your code yet. Come back to this page once they have.
                                       {:else}
                                        It looks like your friend has used the code! Your discount has been applied to your latest subscription.
                                        {/if}
                                    </p>
                                    </div>
                                    </div>
      </div>
      </div>
      </div>
      </div>