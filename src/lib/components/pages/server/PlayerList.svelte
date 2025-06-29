<script>
    import { browser } from "$app/environment";
    import { apiurl } from "$lib/scripts/req";
    
    export let id;
    let players = [];
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
            players = data;
            
            // Initialize only new players not in cache
            data.forEach(player => {
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
    <ul>
        {#each players as player (player.uuid)}
            <li class="text-gray-200 bg-base-100 w-full p-2 px-2.5 rounded-xl font-mono flex items-center">
                <div class="relative mr-2">
                    {#if loadingStates[player.uuid]}
                        <div class="w-8 h-8 bg-gray-600 rounded animate-pulse" />
                    {/if}
                    
                 {#if player.name.split("")[0] == "."}
                 <img
                        src={`https://mc-heads.net/avatar/${player.uuid}`}
                        alt={player.name + "'s head"}
                        class={`w-8 h-8 rounded ${loadingStates[player.uuid] ? 'hidden' : 'block'}`}
                        on:load={() => handleImageLoad(player.uuid)}
                    />
                    <img class="w-4 h-4 rounded absolute -bottom-1 -right-1 shadow-xl/30" src="/images/bedrock.webp" alt="Bedrock" />
                   
                 {:else}
                    <img
                        src={`https://crafatar.lundhahn.dk/avatars/${player.uuid}?size=64&overlay`}
                        alt={player.name + "'s head"}
                        class={`w-8 h-8 rounded ${loadingStates[player.uuid] ? 'hidden' : 'block'}`}
                        on:load={() => handleImageLoad(player.uuid)}
                    />
                    {/if}
                </div>
                {player.name}
            </li>
        {/each}
    </ul>
</div>
