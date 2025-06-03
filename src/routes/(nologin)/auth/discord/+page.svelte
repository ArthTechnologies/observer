<script>
  import { browser } from "$app/environment";
  import { disableScrollHandling, goto } from "$app/navigation";
  import EmailSignin from "$lib/components/ui/EmailSignin.svelte";
  import { apiurl, allnodes, updateReqTemplates } from "$lib/scripts/req";

  import PocketBase from "pocketbase";
  import { compute_rest_props } from "svelte/internal";

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
        console.log(data);
        localStorage.setItem("avatar", data.avatar);
        localStorage.setItem("bannerColor", data.bannerColor);
        localStorage.setItem("token", data.token);
        localStorage.setItem("accountId", data.accountId);
        localStorage.setItem("accountEmail", "discord:" + data.username);
        localStorage.setItem("email", data.email.toLowerCase());
        updateReqTemplates();
        if (localStorage.getItem("providerMode") != "false" && data.firstTime) {
          goto("/signup/subscribe/basic");
        } else {
          goto("/");
          //this tells the navbar to update the icon that is highligted
          window.dispatchEvent(new Event("redrict"));
        }
      });
    
  }
</script>
