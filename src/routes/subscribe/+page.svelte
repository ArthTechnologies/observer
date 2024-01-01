<script lang="ts">
  import { browser } from "$app/environment";
  import { goto } from "$app/navigation";

  if (browser) {
    //if screen is smaller than 768px (AKA 'md'), redirect to /choosePlan
    //because there is a bug with displaying the checkout and plan chooser
    //on the same page on mobile.
    if (window.innerWidth < 768) {
      goto("/subscribe/choosePlan");
    } else {
      //there is a bug with embedding the plans into the plan chooser's page,
      //so we have to embed the plan choose into each plan's page instead.
      goto("/subscribe/basic");
    }
  }
</script>
