<script>
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    function migrate() {
        if (browser) {
            localStorage.setItem("userNode", "https://eu-germany-1.arthmc.xyz/");
            goto("/");
           
        }
    }
</script>


<button class="btn mt-12 btn-neutral" on:click={migrate}>Migrate to europe</button>
<p>Only use this if you were sent this link by Arth Hosting staff.</p>