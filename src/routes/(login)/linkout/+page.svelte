<script lang="ts">
  import { browser } from "$app/environment";
    import { goto } from "$app/navigation";

    let remoteUrl = "";
    let displayUrl = "";
    if (browser) {
        //get it form query string
        remoteUrl = window.location.search.split("?remoteUrl=")[1];
                //replace %253a with :
                remoteUrl = remoteUrl.replaceAll("%253a", ":");
        //replace %252f with /
        remoteUrl = remoteUrl.replaceAll("%252f", "/");
        //replace %253f with ?
        
        remoteUrl = remoteUrl.replaceAll("%253f", "?");
        displayUrl = remoteUrl.split("://")[1];
        displayUrl = displayUrl.split("/")[0];

    }

</script>

<div class="flex flex-col items-center h-[78vh] place-content-center">
    <div class="bg-base-300 border-4 border-base-200 rounded-xl w-96">
        <div class="text-center p-6">
          <div class="max-w-md space-y-5">
            <div class="space-x-2 space-y-5">
                <p class="text-xl">You're about to leave this site.</p>
                <p>Make sure you trust "{displayUrl}".</p>
                <a href="{remoteUrl}" target="_blank" rel="noreferrer" class="btn btn-outline">Go To Site</a>
            </div>
                </div>
                </div>
                </div>
                </div>
