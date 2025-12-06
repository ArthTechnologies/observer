<script lang="ts">
  import { Settings, Clock, Globe, Lock, Zap } from "lucide-svelte";

  export let activeSection = "general";

  const sections = [
    { id: "general", label: "General", icon: Settings },
    { id: "dns", label: "Network", icon: Globe },
    { id: "access", label: "Sub-Users", icon: Lock },
    { id: "advanced", label: "Advanced", icon: Zap },
    { id: "scheduler", label: "Scheduler", icon: Clock },
  ];
</script>

<div class="flex gap-4 h-full w-full">
  <!-- Left Sidebar Navigation -->
  <aside class="w-48 flex-shrink-0">
    <nav class="bg-base-300 rounded-xl shadow-lg p-4 space-y-2 h-fit sticky top-4">
      <h3 class="font-ubuntu text-sm font-bold text-gray-400 uppercase tracking-wide px-3 mb-3">
        Settings
      </h3>
      {#each sections as section}
        <button
          on:click={() => (activeSection = section.id)}
          class={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
            activeSection === section.id
              ? "bg-primary text-primary-content shadow-md"
              : "text-gray-300 hover:bg-base-200"
          }`}
        >
          <svelte:component this={section.icon} size={18} />
          <span class="font-medium text-sm">{section.label}</span>
        </button>
      {/each}
    </nav>
  </aside>

  <!-- Main Content Area -->
  <main class="flex-1 min-w-0">
    <div class="bg-base-300 rounded-xl shadow-lg p-6">
      {#if activeSection === "general"}
        <slot name="general" />
      {:else if activeSection === "dns"}
        <slot name="dns" />
      {:else if activeSection === "access"}
        <slot name="access" />
      {:else if activeSection === "advanced"}
        <slot name="advanced" />
      {:else if activeSection === "scheduler"}
        <slot name="scheduler" />
      {/if}
    </div>
  </main>
</div>

<style>
  aside :global(button) {
    will-change: background-color;
  }
</style>
