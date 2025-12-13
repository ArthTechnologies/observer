<script lang="ts">
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { Database, AlertCircle, CheckCircle, Clock, RefreshCw } from "lucide-svelte";

  let systemTasks: any[] = [];
  let subscriptions: any[] = [];
  let servers: any[] = [];
  let loading = true;
  let error = "";
  let mode = "solo";
  let adminAccess = false;

  onMount(async () => {
    if (browser) {
      // Get mode from localStorage
      mode = localStorage.getItem("mode") || "solo";

      try {
        // Fetch info to get adminAccess status
        const infoRes = await fetch(apiurl + "info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
            username: localStorage.getItem("accountEmail") || "",
          },
        });

        if (infoRes.ok) {
          const infoData = await infoRes.json();
          adminAccess = infoData.adminAccess === true;
        } else {
          console.error("Info response not ok:", infoRes.status);
        }

        // Redirect if not admin
        if (!adminAccess) {
          goto("/");
          return;
        }

        // Fetch system tasks from backend
        const tasksRes = await fetch(apiurl + "admin/system-tasks", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
            username: localStorage.getItem("accountEmail") || "",
          },
        });

        if (tasksRes.ok) {
          const tasksData = await tasksRes.json();
          systemTasks = tasksData.systemTasks || [];
        } else {
          console.error("Tasks response not ok:", tasksRes.status);
        }

        // Fetch subscriptions and servers
        const dataRes = await fetch(apiurl + "admin/subscriptions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            token: localStorage.getItem("token") || "",
            username: localStorage.getItem("accountEmail") || "",
          },
        });

        if (dataRes.ok) {
          const data = await dataRes.json();
          subscriptions = data.subscriptions || [];
          servers = data.servers || [];
          console.log("Subscriptions data:", subscriptions);
          console.log("Servers data:", servers);
        } else {
          console.error("Subscriptions response not ok:", dataRes.status);
        }
      } catch (err) {
        console.error("Error loading admin data:", err);
        error = "Failed to load admin data: " + err;
      } finally {
        loading = false;
      }
    }
  });

  function getServerSubscription(serverId: string) {
    return subscriptions.find((s) => s.serverId === serverId);
  }

  function isSubscriptionValid(subscription: any): boolean {
    if (!subscription || !subscription.subscriptions) return false;
    return subscription.subscriptions.length > 0;
  }
</script>

<div class="container mx-auto p-6 max-w-6xl">
  <!-- Header -->
  <div class="mb-8">
    <h1 class="text-4xl font-bold mb-2">Admin Dashboard</h1>
    <p class="text-gray-400">{mode === "solo" ? "Solo Mode Administration" : "Provider Mode Administration"}</p>
  </div>

  {#if error}
    <div class="alert alert-error gap-3 mb-6">
      <AlertCircle size={20} />
      <span>{error}</span>
    </div>
  {/if}

  {#if loading}
    <div class="flex justify-center items-center py-12">
      <RefreshCw size={32} class="animate-spin text-primary" />
    </div>
  {:else}
    <!-- System Tasks Section -->
    <div class="mb-12">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-2 flex items-center gap-2">
          <Clock size={28} />
          System Tasks
        </h2>
        <p class="text-gray-400">Scheduled system maintenance tasks</p>
      </div>

      {#if systemTasks.length === 0}
        <div class="alert alert-info gap-3">
          <AlertCircle size={20} />
          <span>No system tasks found</span>
        </div>
      {:else}
        <div class="grid gap-4">
          {#each systemTasks as task, i (task.id || i)}
            <div class="card bg-base-200 shadow-md">
              <div class="card-body">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="card-title text-lg">{task.name}</h3>
                    <div class="mt-3 space-y-2 text-sm">
                      <p>
                        <span class="font-semibold">Type:</span>
                        <span class="badge badge-primary ml-2">{task.type}</span>
                      </p>
                      <p>
                        <span class="font-semibold">Schedule:</span>
                        <span class="ml-2">{task.schedule}</span>
                      </p>
                      {#if task.command}
                        <p>
                          <span class="font-semibold">Function:</span>
                          <span class="ml-2 font-mono text-xs bg-base-300 px-2 py-1 rounded">
                            {task.command}
                          </span>
                        </p>
                      {/if}
                      <p>
                        <span class="font-semibold">Status:</span>
                        {#if task.enabled}
                          <span class="badge badge-success ml-2">Enabled</span>
                        {:else}
                          <span class="badge badge-ghost ml-2">Disabled</span>
                        {/if}
                      </p>
                      {#if task.lastRun}
                        <p>
                          <span class="font-semibold">Last Run:</span>
                          <span class="ml-2">{new Date(task.lastRun).toLocaleString()}</span>
                        </p>
                      {/if}
                      {#if task.nextRun}
                        <p>
                          <span class="font-semibold">Next Run:</span>
                          <span class="ml-2">{new Date(task.nextRun).toLocaleString()}</span>
                        </p>
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>

    <!-- Subscriptions Section -->
    <div>
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-2 flex items-center gap-2">
          <Database size={28} />
          Server Subscriptions
        </h2>
        <p class="text-gray-400">Server subscription status and validity</p>
      </div>

      {#if servers.length === 0}
        <div class="alert alert-info gap-3">
          <AlertCircle size={20} />
          <span>No servers found</span>
        </div>
      {:else}
        <div class="grid gap-4">
          {#each servers as server, i (server.id || i)}
            {@const subscription = getServerSubscription(server.id)}
            {@const isValid = isSubscriptionValid(subscription)}
            <div class="card bg-base-200 shadow-md">
              <div class="card-body">
                <div class="flex items-start justify-between">
                  <div class="flex-1">
                    <h3 class="card-title text-lg">{server.name || `Server ${server.id}`}</h3>
                    <div class="mt-3 space-y-2 text-sm">
                      <p>
                        <span class="font-semibold">Server ID:</span>
                        <span class="ml-2 font-mono text-xs bg-base-300 px-2 py-1 rounded">
                          {server.id}
                        </span>
                      </p>
                      <p>
                        <span class="font-semibold">Owner:</span>
                        <span class="ml-2">{server.owner || "Unknown"}</span>
                      </p>
                      <p>
                        <span class="font-semibold">Software:</span>
                        <span class="ml-2 badge badge-neutral">{server.software || "Unknown"}</span>
                      </p>
                      <p>
                        <span class="font-semibold">Subscription Status:</span>
                        {#if isValid}
                          <span class="badge badge-success ml-2 gap-2">
                            <CheckCircle size={14} />
                            Valid
                          </span>
                        {:else}
                          <span class="badge badge-error ml-2 gap-2">
                            <AlertCircle size={14} />
                            Invalid
                          </span>
                        {/if}
                      </p>
                      {#if subscription}
                        {#if subscription.subscriptions && subscription.subscriptions.length > 0}
                          <div>
                            <span class="font-semibold">Subscriptions:</span>
                            <div class="mt-2 space-y-1">
                              {#each subscription.subscriptions as sub, i (sub.start_date || i)}
                                <div class="text-xs bg-base-300 px-2 py-1 rounded">
                                  {#if sub.start_date}
                                    <p class="text-gray-400">
                                      Started: {new Date(sub.start_date * 1000).toLocaleDateString()}
                                    </p>
                                  {/if}
                                  {#if sub.ended_at}
                                    <p class="text-gray-400">
                                      Ended: {new Date(sub.ended_at * 1000).toLocaleDateString()}
                                    </p>
                                  {/if}
                                </div>
                              {/each}
                            </div>
                          </div>
                        {/if}
                      {/if}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  :global(body) {
    @apply bg-base-100;
  }
</style>
