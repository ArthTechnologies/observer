<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
  
    if (browser) {
          //detect plan and quarterly from the URL
    const url = new URL(window.location.href);
    const plan = url.searchParams.get("plan");
    const quarterly = url.searchParams.get("quarterly");
    localStorage.setItem("plan", plan);
    localStorage.setItem("quarterly", quarterly);
      goto("/signup/location");
    }
  </script>
  