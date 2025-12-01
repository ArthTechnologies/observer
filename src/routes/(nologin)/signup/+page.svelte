<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
  
    if (browser) {
          //detect plan and quarterly from the URL
    const url = new URL(window.location.href);
    const plan = url.searchParams.get("plan");
    const quarterly = url.searchParams.get("quarterly");
    const referrer = url.searchParams.get("referrer");
    const campaign_name = url.searchParams.get("campaign_name");
    localStorage.setItem("plan", plan);
    localStorage.setItem("quarterly", quarterly);
    localStorage.setItem("referrer", referrer);
    localStorage.setItem("campaign_name", campaign_name);
      goto("/signup/location");
    }
  </script>
  