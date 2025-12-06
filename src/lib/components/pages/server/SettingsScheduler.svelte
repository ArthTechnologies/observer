<script lang="ts">
  import { Clock, AlertCircle } from "lucide-svelte";

  let scheduledTasks: Array<{ id: string; name: string; time: string; enabled: boolean }> = [];
</script>

<div class="space-y-6">
  <!-- Header -->
  <div>
    <h2 class="text-2xl font-bold flex items-center gap-2">
      <Clock size={28} />
      Scheduler
    </h2>
    <p class="text-sm text-gray-400 mt-1">Schedule server tasks and automations</p>
  </div>

  <!-- Empty State -->
  <div class="flex flex-col items-center justify-center py-12 px-6 bg-base-200 rounded-lg">
    <Clock size={48} class="text-gray-500 mb-4 opacity-50" />
    <h3 class="text-lg font-semibold text-gray-300 mb-2">No Scheduled Tasks</h3>
    <p class="text-sm text-gray-400 text-center mb-6">
      Schedule your first server task to automate maintenance, backups, or restarts
    </p>
    <button class="btn btn-primary btn-sm">
      Create Task
    </button>
  </div>

  <!-- Info Panel -->
  <div class="alert alert-info gap-3">
    <AlertCircle size={20} />
    <div>
      <p class="font-semibold">Coming Soon</p>
      <p class="text-sm">Advanced task scheduling capabilities are being developed. Stay tuned!</p>
    </div>
  </div>

  <!-- Feature Preview -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div class="p-4 rounded-lg bg-base-200 border border-base-300">
      <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
        <span class="badge badge-primary">Feature</span>
        Backup Scheduling
      </h4>
      <p class="text-xs text-gray-400">Automatically backup your server at specified intervals</p>
    </div>

    <div class="p-4 rounded-lg bg-base-200 border border-base-300">
      <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
        <span class="badge badge-primary">Feature</span>
        Restart Scheduling
      </h4>
      <p class="text-xs text-gray-400">Schedule periodic server restarts with player notifications</p>
    </div>

    <div class="p-4 rounded-lg bg-base-200 border border-base-300">
      <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
        <span class="badge badge-primary">Feature</span>
        Command Execution
      </h4>
      <p class="text-xs text-gray-400">Run custom commands on a fixed schedule</p>
    </div>

    <div class="p-4 rounded-lg bg-base-200 border border-base-300">
      <h4 class="font-semibold text-sm mb-2 flex items-center gap-2">
        <span class="badge badge-primary">Feature</span>
        Maintenance Mode
      </h4>
      <p class="text-xs text-gray-400">Enable maintenance mode at specified times</p>
    </div>
  </div>
</div>
