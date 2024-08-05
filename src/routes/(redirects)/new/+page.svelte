<script>
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  if (browser) {
    goto("newserver");
    //this tells the navbar to update the icon that is highligted
    window.dispatchEvent(new Event("redrict"));
  }
</script>
