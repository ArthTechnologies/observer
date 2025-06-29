<script>
    import { browser } from "$app/environment";
    import { apiurl } from "$lib/scripts/req";
    
    export let id;
    let playersOnline = [];
    let playersOffline = [];
    let loadingStates = {};
    let headCache = new Set(); // Tracks cached player heads

    if (browser) {
        fetchPlayers();
        setInterval(fetchPlayers, 5000);
    }

    async function fetchPlayers() {
        try {
            const response = await fetch(apiurl + "server/" + id + "/players", {
                method: "GET",
                headers: {
                    token: localStorage.getItem("token"),
                    username: localStorage.getItem("accountEmail"),
                }
            });
            
            const data = await response.json();
            playersOnline = data.playersOnline || [];
            
            // Initialize only new players not in cache
            playersOnline.forEach(player => {
                if (!(player.uuid in loadingStates)) {
                    loadingStates[player.uuid] = !headCache.has(player.uuid);
                }
            });
            let off = [];
            for (let i in data.allPlayers) {
        
                const player = data.allPlayers[i];
                // if the player is not online, add them to offline list
                if (!playersOnline.some(p => p.uuid === player.uuid)) {
                    
                    if (!playersOffline.some(p => p.uuid === player.uuid)) {
                               
                        off.push(player);
                    }
                }
            }
     
            playersOffline = off;

            // Initialize loading states for offline players
            playersOffline.forEach(player => {
                if (!(player.uuid in loadingStates)) {
                    loadingStates[player.uuid] = !headCache.has(player.uuid);
                }
            }); 

            
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    }

    function handleImageLoad(uuid) {
        headCache.add(uuid); // Add to cache
        loadingStates[uuid] = false;
        loadingStates = loadingStates; // Trigger reactivity
    }
</script>

<div class="bg-base-300 w-full shadow-xl rounded-xl px-4 py-3 neutralGradientStroke">
    <p class="font-bold font-ubuntu text-gray-100 mb-3">Players</p>
    <ul class="flex flex-col gap-1.5">
        {#each playersOnline as player (player.uuid)}
            <li class="text-gray-200 bg-base-100 w-full p-2 px-2.5 rounded-xl font-mono text-sm flex items-center">
                <div class="relative mr-2">
                    {#if loadingStates[player.uuid]}
                        <div class="w-6 h-6 bg-gray-600 rounded animate-pulse" />
                    {/if}
                    
              
                 <img
                        src={`https://mc-heads.net/avatar/${player.uuid}`}
                        alt={player.name + "'s head"}
                        class={`w-6 h-6 rounded ${loadingStates[player.uuid] ? 'hidden' : 'block'}`}
                        on:load={() => handleImageLoad(player.uuid)}
                    />   {#if player.name.split("")[0] == "."}
                    <img class="w-3 h-3 rounded absolute -bottom-1 -right-1 shadow-xl/30" src="/images/bedrock.webp" alt="Bedrock" />
                   {/if}
            
                </div>
                {player.name}
            </li>
        {/each}
        {#each playersOffline as player (player.uuid)}
            <li class="text-gray-400 bg-base-100 w-full p-2 px-2.5 rounded-xl font-mono text-sm flex items-center">
                <div class="relative mr-2">
                    {#if loadingStates[player.uuid]}
                        <div class="w-6 h-6 bg-gray-600 rounded animate-pulse" />
                    {/if}
                    
                    <img
                        src={`https://mc-heads.net/avatar/${player.uuid}`}
                        alt={player.name + "'s head"}
                        class={`w-6 h-6 grayscale opacity-75 rounded ${loadingStates[player.uuid] ? 'hidden' : 'block'}`}
                        on:load={() => handleImageLoad(player.uuid)}
                    />
                </div>
                {player.name}
            </li>
        {/each}

    </ul>
</div>
