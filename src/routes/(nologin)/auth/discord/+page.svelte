<script>
  import { browser } from "$app/environment";
  import { disableScrollHandling, goto } from "$app/navigation";
  import EmailSignin from "$lib/components/ui/EmailSignin.svelte";
  import { apiurl } from "$lib/scripts/req";
  import { stripePaymentLink } from "$lib/scripts/req";

  import PocketBase from "pocketbase";

  if (browser) {
    //take the code from the url (DONT USE .search)
    let token = window.location.href.split("access_token=")[1].split("&")[0];
    console.log(token);
    fetch(apiurl + "accounts/discord?token=" + token, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.setItem("token", data.token);
        localStorage.setItem("accountId", data.accountId);
        localStorage.setItem("email", data.email);
        if (localStorage.getItem("enablePay") == "true") {
          goto(stripePaymentLink + "?prefilled_email=" + data.email);
        } else {
          goto("/");
          //this tells the navbar to update the icon that is highligted
          window.dispatchEvent(new Event("redrict"));
        }
      });
  }
</script>
