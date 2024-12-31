<script lang="ts">
    import { browser } from "$app/environment";
    import { goto } from "$app/navigation";
if (browser) {
    
    fetch('https://backend.arthmc.xyz/availableNode')
        .then(response => response.text())
        .then(data => {
            
            if (data != "null") {
                //if data doesn't have a / at the end, add it
                if (data[data.length - 1] != '/') {
                    data += '/';
                }
                localStorage.setItem('userNode', data);
                goto('/login');
            }
        });
}
</script>