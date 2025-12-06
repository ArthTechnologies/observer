<script lang="ts">
  import { browser } from "$app/environment";
  import { Plus, Trash2, Edit2, Clock, RotateCcw, Terminal, Database } from "lucide-svelte";
  import { alert } from "$lib/scripts/utils";
  import {
    getSchedulerTasks,
    createSchedulerTask,
    updateSchedulerTask,
    deleteSchedulerTask,
    toggleSchedulerTask,
  } from "$lib/scripts/req";
  import { onMount } from "svelte";

  let tasks: Array<{
    id: string;
    name: string;
    type: "backup" | "command" | "restart";
    schedule: string;
    enabled: boolean;
    command?: string;
    nextRun?: string;
  }> = [];

  let showModal = false;
  let selectedType: "backup" | "command" | "restart" | null = null;
  let editingTask: typeof tasks[0] | null = null;

  // Form fields
  let taskName = "";
  let taskSchedule = "0 0 * * *"; // Default: daily at midnight
  let taskCommand = "";

  const taskTypes = [
    {
      id: "backup",
      name: "Backup",
      description: "Create a server backup",
      icon: Database,
    },
    {
      id: "command",
      name: "Execute Command",
      description: "Run a server command",
      icon: Terminal,
    },
    {
      id: "restart",
      name: "Restart Server",
      description: "Restart the server",
      icon: RotateCcw,
    },
  ];

  onMount(async () => {
    if (browser) {
      const serverId = localStorage.getItem("serverID");
      if (serverId) {
        try {
          const serverTasks = await getSchedulerTasks(serverId);
          tasks = serverTasks || [];
        } catch (err) {
          console.error("Error loading tasks:", err);
          tasks = [];
        }
      }
    }
  });

  function openModal() {
    showModal = true;
    selectedType = null;
    editingTask = null;
    resetForm();
  }

  function closeModal() {
    showModal = false;
    selectedType = null;
    editingTask = null;
    resetForm();
  }

  function resetForm() {
    taskName = "";
    taskSchedule = "0 0 * * *";
    taskCommand = "";
  }

  function selectType(type: "backup" | "command" | "restart") {
    selectedType = type;
  }

  async function createTask() {
    if (!taskName.trim()) {
      alert("Task name is required", "error");
      return;
    }

    if (selectedType === "command" && !taskCommand.trim()) {
      alert("Command is required for command tasks", "error");
      return;
    }

    if (browser) {
      const serverId = localStorage.getItem("serverID");
      if (!serverId) {
        alert("Server ID not found", "error");
        return;
      }

      try {
        if (editingTask) {
          // Update existing task
          const updated = await updateSchedulerTask(serverId, editingTask.id, {
            name: taskName,
            type: selectedType,
            schedule: taskSchedule,
            command: taskCommand || undefined,
          });
          if (updated) {
            const index = tasks.findIndex((t) => t.id === editingTask.id);
            if (index !== -1) {
              tasks[index] = updated;
            }
          }
        } else {
          // Create new task
          const newTask = await createSchedulerTask(
            serverId,
            taskName,
            selectedType!,
            taskSchedule,
            taskCommand || undefined
          );
          if (newTask) {
            tasks = [...tasks, newTask];
          }
        }
        alert(editingTask ? "Task updated" : "Task created", "success");
        closeModal();
      } catch (err) {
        console.error("Error:", err);
        alert("Failed to save task", "error");
      }
    }
  }

  async function deleteTask(id: string) {
    if (browser) {
      const serverId = localStorage.getItem("serverID");
      if (!serverId) {
        alert("Server ID not found", "error");
        return;
      }

      try {
        const success = await deleteSchedulerTask(serverId, id);
        if (success) {
          tasks = tasks.filter((t) => t.id !== id);
          alert("Task deleted", "success");
        }
      } catch (err) {
        console.error("Error deleting task:", err);
        alert("Failed to delete task", "error");
      }
    }
  }

  function editTask(task: typeof tasks[0]) {
    editingTask = task;
    taskName = task.name;
    taskSchedule = task.schedule;
    taskCommand = task.command || "";
    selectedType = task.type;
    showModal = true;
  }

  async function toggleTask(id: string) {
    if (browser) {
      const serverId = localStorage.getItem("serverID");
      if (!serverId) {
        alert("Server ID not found", "error");
        return;
      }

      try {
        const updated = await toggleSchedulerTask(serverId, id);
        if (updated) {
          const task = tasks.find((t) => t.id === id);
          if (task) {
            task.enabled = updated.enabled;
            tasks = tasks;
          }
        }
      } catch (err) {
        console.error("Error toggling task:", err);
        alert("Failed to toggle task", "error");
      }
    }
  }

  function saveTasks() {
    if (browser) {
      localStorage.setItem("schedulerTasks", JSON.stringify(tasks));
    }
  }

  function calculateNextRun(cron: string): string {
    // Simplified - would need proper cron parsing in production
    return new Date(Date.now() + 86400000).toLocaleDateString();
  }

  function getTypeIcon(type: string) {
    const typeObj = taskTypes.find((t) => t.id === type);
    return typeObj?.icon;
  }

  function formatSchedule(cron: string): string {
    // Simplified cron descriptions
    const patterns: Record<string, string> = {
      "0 0 * * *": "Daily at midnight",
      "0 6 * * *": "Daily at 6 AM",
      "0 12 * * *": "Daily at noon",
      "0 18 * * *": "Daily at 6 PM",
      "0 */6 * * *": "Every 6 hours",
      "0 */12 * * *": "Every 12 hours",
      "0 0 * * 0": "Weekly (Sunday)",
      "0 0 1 * *": "Monthly",
    };
    return patterns[cron] || cron;
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex items-start justify-between">
    <div>
      <h2 class="text-2xl font-bold">Task Scheduler</h2>
      <p class="text-sm text-gray-400 mt-1">Schedule automated tasks for your server</p>
    </div>
    <button class="btn btn-primary btn-sm gap-2" on:click={openModal}>
      <Plus size={18} />
      Create Task
    </button>
  </div>

  <!-- Tasks List -->
  <div class="space-y-3">
    {#if tasks.length === 0}
      <div class="alert alert-info gap-3">
        <Clock size={20} />
        <span>No tasks scheduled. Create your first task to get started!</span>
      </div>
    {:else}
      {#each tasks as task (task.id)}
        <div
          class={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
            task.enabled ? "bg-base-200 border-base-300" : "bg-base-300 border-base-400 opacity-60"
          }`}
        >
          <!-- Task Icon & Info -->
          <div class="flex items-center gap-3 flex-1">
            <div class="p-2 rounded-lg bg-base-300">
              <svelte:component this={getTypeIcon(task.type)} size={20} />
            </div>
            <div class="flex-1">
              <h3 class="font-semibold">{task.name}</h3>
              <div class="flex gap-2 mt-1">
                <span class="text-xs bg-base-300 px-2 py-1 rounded">
                  {formatSchedule(task.schedule)}
                </span>
                {#if task.command}
                  <span class="text-xs bg-base-300 px-2 py-1 rounded truncate max-w-xs">
                    {task.command}
                  </span>
                {/if}
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <label class="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={task.enabled}
                on:change={() => toggleTask(task.id)}
                class="toggle toggle-sm toggle-primary"
              />
            </label>
            <button
              class="btn btn-ghost btn-sm btn-square"
              on:click={() => editTask(task)}
              title="Edit task"
            >
              <Edit2 size={16} />
            </button>
            <button
              class="btn btn-ghost btn-sm btn-square text-error"
              on:click={() => deleteTask(task.id)}
              title="Delete task"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      {/each}
    {/if}
  </div>

  
</div>

<!-- Task Type Selection Modal -->
{#if showModal}
  <div class="modal modal-open">
    <div class="modal-box w-11/12 max-w-2xl">
      <h3 class="font-bold text-lg mb-6">
        {editingTask ? "Edit Task" : "Create New Task"}
      </h3>
      <p class="text-sm text-gray-400 mb-4">Select what type of task you want to schedule:</p>

      <!-- Task Type Options -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {#each taskTypes as taskType (taskType.id)}
          <button
            class="p-4 border-2 rounded-lg transition cursor-pointer text-left {selectedType === taskType.id
              ? 'border-primary bg-primary/10'
              : 'border-base-300 hover:border-primary hover:bg-base-200'}"
            on:click={() => selectType(taskType.id)}
          >
            <div class="flex items-center gap-3">
              <div class="p-2 bg-base-300 rounded-lg">
                <svelte:component this={taskType.icon} size={20} />
              </div>
              <div>
                <h4 class="font-semibold text-sm">{taskType.name}</h4>
                <p class="text-xs text-gray-400">{taskType.description}</p>
              </div>
            </div>
          </button>
        {/each}
      </div>

      <!-- Task Configuration Fields (shown when type is selected) -->
      {#if selectedType}
        <div class="divider"></div>

        <div class="space-y-4 mb-6">
          <!-- Task Name -->
          <div class="space-y-2">
            <label for="taskName" class="block text-sm font-semibold">Task Name</label>
            <input
              type="text"
              id="taskName"
              bind:value={taskName}
              placeholder="e.g., Daily backup, Restart at 6 AM"
              class="input input-bordered w-full"
            />
          </div>

          <!-- Schedule (Cron) -->
          <div class="space-y-2">
            <label for="taskSchedule" class="block text-sm font-semibold">Schedule (Cron)</label>
            <select bind:value={taskSchedule} class="select select-bordered w-full">
              <option value="0 0 * * *">Daily at midnight</option>
              <option value="0 6 * * *">Daily at 6 AM</option>
              <option value="0 12 * * *">Daily at noon</option>
              <option value="0 18 * * *">Daily at 6 PM</option>
              <option value="0 */6 * * *">Every 6 hours</option>
              <option value="0 */12 * * *">Every 12 hours</option>
              <option value="0 0 * * 0">Weekly (Sunday)</option>
              <option value="0 0 1 * *">Monthly</option>
            </select>
            <p class="text-xs text-gray-400">
              Current: {formatSchedule(taskSchedule)}
            </p>
          </div>

          <!-- Command Input (only for command tasks) -->
          {#if selectedType === "command"}
            <div class="space-y-2">
              <label for="taskCommand" class="block text-sm font-semibold">Server Command</label>
              <input
                type="text"
                id="taskCommand"
                bind:value={taskCommand}
                placeholder="e.g., say Server restarting in 10 minutes!"
                class="input input-bordered w-full"
              />
              <p class="text-xs text-gray-400">Enter the Minecraft server command without the leading slash</p>
            </div>
          {/if}
        </div>
      {/if}

      <!-- Modal Actions -->
      <div class="modal-action">
        <button class="btn" on:click={closeModal}>
          Cancel
        </button>
        {#if selectedType}
          <button class="btn btn-primary" on:click={createTask}>
            {editingTask ? "Update Task" : "Create Task"}
          </button>
        {/if}
      </div>
    </div>
    <form method="dialog" class="modal-backdrop" on:submit={closeModal}>
      <button type="submit" />
    </form>
  </div>
{/if}

<style lang="scss">
  :global(.modal-backdrop) {
    background-color: rgba(0, 0, 0, 0.5);
  }
</style>
