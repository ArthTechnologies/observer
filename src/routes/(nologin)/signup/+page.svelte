<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
  
    if (browser) {
          //detect plan and quarterly from the URL
    const url = new URL(window.location.href);
    const plan = url.searchParams.get("plan");
    const quarterly = url.searchParams.get("quarterly");
    const referrer = url.searchParams.get("referrer");
    localStorage.setItem("plan", plan);
    localStorage.setItem("quarterly", quarterly);
    localStorage.setItem("referrer", referrer);
      goto("/signup/location");
    }
  </script>
  