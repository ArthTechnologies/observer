<script lang="ts">
  import { TikTok, Youtube, Users, Share2, Check } from "lucide-svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  let selectedSource: string | null = null;
  let youtuberName: string = "";
  let otherSpecification: string = "";

  const sources = [
    {
      id: "tiktok",
      label: "TikTok",
      icon: "tiktok",
      width: "normal",
    },
    {
      id: "geyser",
      label: "Geyser",
      icon: "geyser",
      width: "normal",
    },
    {
      id: "google",
      label: "Google",
      icon: "google",
      width: "normal",
    },
    {
      id: "friend",
      label: "Friend",
      icon: "friend",
      width: "normal",
    },
    {
      id: "youtube",
      label: "YouTube",
      icon: "youtube",
      width: "double",
      hasInput: true,
      inputPlaceholder: "YouTuber name...",
      inputValue: youtuberName,
    },
    {
      id: "other",
      label: "Other",
      icon: "other",
      width: "double",
      hasInput: true,
      inputPlaceholder: "Where did you hear about us?",
      inputValue: otherSpecification,
    },
  ];

  function selectSource(sourceId: string) {
    selectedSource = sourceId;
  }

  function handleSubmit() {
    if (!selectedSource) return;

    const data = {
      source: selectedSource,
      youtuberName: selectedSource === "youtube" ? youtuberName : undefined,
      other: selectedSource === "other" ? otherSpecification : undefined,
    };

    dispatch("submit", data);
  }

  function getIconComponent(iconType: string) {
    switch (iconType) {
      case "tiktok":
        return "text-black dark:text-white";
      case "youtube":
        return "text-red-600";
      case "google":
        return "text-blue-500";
      case "geyser":
        return "text-cyan-500";
      case "friend":
        return "text-green-500";
      case "other":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  }
</script>

<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-base-100 rounded-2xl p-8 max-w-2xl w-full mx-4 shadow-2xl">
    <h2 class="text-3xl font-bold mb-2 text-center">Your server is ready!</h2>
    <p class="text-base-content/70 text-center mb-8">
      Before we create your server, tell us where you heard about Arth Hosting
    </p>

    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {#each sources as source}
        {#if source.width === "normal"}
          <button
            type="button"
            on:click={() => selectSource(source.id)}
            class="group relative p-6 rounded-xl transition-all duration-200 bg-base-200 hover:bg-base-300 text-base-content {selectedSource ===
            source.id
              ? 'ring-4 ring-primary'
              : ''}"
          >
            {#if selectedSource === source.id}
              <div class="absolute top-2 right-2 bg-primary text-primary-content rounded-full p-1">
                <Check size={16} />
              </div>
            {/if}
            <div class="flex flex-col items-center gap-3">
              {#if source.icon === "tiktok"}
                <img src="/images/tiktok.webp" alt="TikTok" class="w-8 h-8" />
              {:else if source.icon === "google"}
                <img src="/images/google.webp" alt="Google" class="w-8 h-8" />
              {:else if source.icon === "geyser"}
                <img src="/images/geyser.webp" alt="Geyser" class="w-8 h-8" />
              {:else if source.icon === "friend"}
                <Users class="w-8 h-8" />
              {/if}
              <span class="font-semibold text-sm">{source.label}</span>
            </div>
          </button>
        {/if}
      {/each}
    </div>

    <div class="space-y-4 mb-8">
      {#each sources as source}
        {#if source.width === "double"}
          <button
            type="button"
            on:click={() => selectSource(source.id)}
            class="w-full group relative p-6 rounded-xl transition-all duration-200 bg-base-200 hover:bg-base-300 text-base-content {selectedSource ===
            source.id
              ? 'ring-2 ring-primary'
              : ''}"
          >
            {#if selectedSource === source.id}
              <div class="absolute top-2 right-2 bg-primary text-primary-content rounded-full p-1">
                <Check size={16} />
              </div>
            {/if}
            <div class="flex flex-col gap-3">
              <div class="flex items-center gap-3">
                {#if source.icon === "youtube"}
                  <Youtube class="w-6 h-6" />
                {:else if source.icon === "other"}
                  <Share2 class="w-6 h-6" />
                {/if}
                <span class="font-semibold">{source.label}</span>
              </div>
              {#if source.hasInput && selectedSource === source.id}
                <input
                  type="text"
                  placeholder={source.inputPlaceholder}
                  class="w-full px-3 py-2 rounded-lg bg-base-100 text-base-content border border-base-300 focus:outline-none focus:border-primary"
                  on:click|stopPropagation
                  on:change={(e) => {
                    if (source.id === "youtube") {
                      youtuberName = e.target.value;
                    } else if (source.id === "other") {
                      otherSpecification = e.target.value;
                    }
                  }}
                  value={source.id === "youtube" ? youtuberName : otherSpecification}
                />
              {/if}
            </div>
          </button>
        {/if}
      {/each}
    </div>

    <button
      type="button"
      on:click={handleSubmit}
      disabled={!selectedSource}
      class="w-full btn btn-primary btn-lg {!selectedSource ? 'btn-disabled' : ''}"
    >
      Create Server
    </button>
  </div>
</div>

<style>
  :global(body) {
    overflow: hidden;
  }
</style>
