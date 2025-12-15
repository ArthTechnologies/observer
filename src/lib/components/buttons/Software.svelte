<script lang="ts">
  import { browser } from "$app/environment";
  import { AlertTriangle, Cpu, AlertCircle } from "lucide-svelte";
  import { t } from "$lib/scripts/i18n";
  import { apiurl, changeSoftware } from "../../scripts/req";
  import { alert } from "$lib/scripts/utils";

  let currentSoftware = "";
  let currentVersion = "";
  let newSoftware = "";
  let newVersion = "";
  let jarsList = [];
  let softwareVersionOptions = [];
  let warningTypes = [];
  let warningMessages = [];
  let canProceed = true;
  let isChanging = false;

  // Actual runnable softwares
  const modLoaders = ["forge", "fabric", "quilt", "neoforge"];
  const allSoftwares = ["paper", "forge", "neoforge", "fabric", "quilt", "vanilla", "snapshot", "velocity"];

  function getBaseVersion(version: string): string {
    return version.split("*")[0];
  }

  function getWarnings(current: string, newSoft: string): { types: number[]; messages: string[]; canProceed: boolean } {
    const curr = current.toLowerCase();
    const newS = newSoft.toLowerCase();
    const types: number[] = [];
    const messages: string[] = [];

    // No change
    if (curr === newS) {
      return { types: [], messages: [], canProceed: true };
    }

    // Type 3: Incompatible switches (blocking)
    if (newS === "velocity" || curr === "velocity") {
      return { types: [3], messages: [$t("warning.type3")], canProceed: false };
    }
    if ((newS === "snapshot" && curr === "forge") || (curr === "snapshot" && newS === "forge")) {
      return { types: [3], messages: [$t("warning.type3")], canProceed: false };
    }

    // Type 0: Paper ↔ Any other software (plugins stop working)
    if (curr === "paper" || newS === "paper") {
      types.push(0);
      messages.push($t("warning.type0"));
    }

    // Type 2: Any → Snapshot (snapshots are experimental)
    if (newS === "snapshot") {
      types.push(2);
      messages.push($t("warning.type2"));
    }

    // Type 1: Modded loaders ↔ Vanilla
    const currIsModded = modLoaders.includes(curr);
    const newIsModded = modLoaders.includes(newS);
    if ((currIsModded && newS === "vanilla") ||
        (newIsModded && curr === "vanilla")) {
      types.push(1);
      messages.push($t("warning.type1"));
    }

    return { types, messages, canProceed: true };
  }

  function onModalOpen() {
    if (browser) {
      currentSoftware = localStorage.getItem("serverSoftware") || "";
      currentVersion = localStorage.getItem("serverVersion") || "";
      newSoftware = "";
      newVersion = "";
      softwareVersionOptions = [];
      warningTypes = [];
      warningMessages = [];
      canProceed = true;

      // Fetch available jars
      fetch(apiurl + "info/jars", {
        method: "GET",
        headers: {
          token: localStorage.getItem("token"),
          username: localStorage.getItem("accountEmail"),
        },
      })
        .then((x) => x.json())
        .then((x) => {
          jarsList = x;
          buildSoftwareVersionOptions();
        });
    }
  }

  function buildSoftwareVersionOptions() {
    const currentBaseVersion = getBaseVersion(currentVersion);
    const optionsMap = new Map<string, { software: string; version: string; display: string; hasVersion: boolean }[]>();
    const softwaresWithVersions = new Set<string>();

    // First pass: find all versions for each software that match current base version
    for (let i in jarsList) {
      let jarFile = jarsList[i];
      let [software, version] = jarFile.split("-");

      if (!software || !version) continue;

      // Clean up version string
      version = version.split(".jar")[0].split(".zip")[0];
      const versionBase = getBaseVersion(version);

      // Check if this is a runnable software and if version matches
      if (allSoftwares.includes(software) && software !== currentSoftware.toLowerCase()) {
        if (versionBase === currentBaseVersion) {
          softwaresWithVersions.add(software);

          if (!optionsMap.has(software)) {
            optionsMap.set(software, []);
          }

          const entry = {
            software: software,
            version: version,
            display: software.charAt(0).toUpperCase() + software.slice(1) + " (" + version + ")",
            hasVersion: true,
          };

          // Check if this version already exists
          const existing = optionsMap.get(software);
          if (!existing?.find((e) => e.version === version)) {
            existing?.push(entry);
          }
        }
      }
    }

    // Second pass: add only softwares without matching versions as "Not Supported"
    for (let i in allSoftwares) {
      const software = allSoftwares[i];
      if (software === currentSoftware.toLowerCase()) continue;

      // Only add "Not Supported" if this software has NO matching versions
      if (!softwaresWithVersions.has(software)) {
        if (!optionsMap.has(software)) {
          optionsMap.set(software, []);
        }

        const entry = {
          software: software,
          version: "",
          display: software.charAt(0).toUpperCase() + software.slice(1) + " (Not Supported)",
          hasVersion: false,
        };

        optionsMap.get(software)?.push(entry);
      }
    }

    // Convert map to array for display
    softwareVersionOptions = Array.from(optionsMap.values()).flat();
  }

  function onSoftwareVersionChange() {
    if (!newSoftware || !newVersion) {
      warningTypes = [];
      warningMessages = [];
      canProceed = true;
      return;
    }

    const warnings = getWarnings(currentSoftware, newSoftware);
    warningTypes = warnings.types;
    warningMessages = warnings.messages;
    canProceed = warnings.canProceed;
  }

  async function onConfirm() {
    if (!canProceed || !newSoftware || !newVersion) {
      return;
    }

    isChanging = true;
    try {
      const result = await changeSoftware(
        parseInt(localStorage.getItem("serverID")),
        newSoftware,
        newVersion
      );

      if (result === "error") {
        alert($t("alert.error") || "Error changing software", "error");
      } else {
        // Update localStorage
        localStorage.setItem("serverSoftware", newSoftware);
        localStorage.setItem("serverVersion", newVersion);

        alert("Software changed successfully", "success");

        // Close modal
        document.getElementById("softwaremodal").checked = false;

        // Refresh page after a short delay
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    } catch (error) {
      console.error("Error changing software:", error);
      alert($t("alert.error") || "Error changing software", "error");
    } finally {
      isChanging = false;
    }
  }
</script>

<label
  for="softwaremodal"
  style="margin:0rem;"
  class="btn bg-base-100 btn-ms w-36"
  on:click={onModalOpen}
  ><Cpu size=20 />
  {$t("button.software")}</label
>

<input
  type="checkbox"
  id="softwaremodal"
  style="margin:0rem;"
  class="modal-toggle"
/>
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="softwaremodal"
      style="margin:0rem;"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2"
      >✕</label
    >

    <h3 class="text-xl font-bold mb-2">{$t("software.title")}</h3>
    <p class="text-xs text-gray-400 mb-4">{$t("software.versionNote") || "Software can only be changed to the same Minecraft version"}</p>

    <!-- Current Software Display -->
    <div class="form-control w-full max-w-xs mb-4">
      <label class="label">
        <span class="label-text">{$t("software.current")}</span>
      </label>
      <input
        type="text"
        value={currentSoftware + " - " + currentVersion}
        disabled
        class="input input-bordered"
      />
    </div>

    <!-- Software + Version Combined Selection -->
    <div class="form-control w-full max-w-xs mb-4">
      <label class="label">
        <span class="label-text">{$t("software.select")}</span>
      </label>
      <select
        class="select select-bordered"
        bind:value={newSoftware}
        on:change={(e) => {
          const selected = softwareVersionOptions.find((opt) => opt.software === newSoftware);
          if (selected) {
            newVersion = selected.version;
          }
          onSoftwareVersionChange();
        }}
      >
        <option value="">Select software...</option>
        {#each softwareVersionOptions as option}
          <option
            value={option.software}
            disabled={!option.hasVersion}
            class={!option.hasVersion ? "opacity-50" : ""}
          >
            {option.display}
          </option>
        {/each}
      </select>
    </div>

    <!-- Warning/Info Messages -->
    {#each warningTypes as warnType, idx}
      {#if warnType === 0}
        <div
          class="bg-warning w-full rounded-lg text-black p-2 py-2 flex items-start mb-3 space-x-2 text-sm"
        >
          <AlertTriangle size="20" class="flex-shrink-0 mt-0.5" />
          <span>{warningMessages[idx]}</span>
        </div>
      {:else if warnType === 1}
        <div
          class="bg-warning w-full rounded-lg text-black p-2 py-2 flex items-start mb-3 space-x-2 text-sm"
        >
          <AlertTriangle size="20" class="flex-shrink-0 mt-0.5" />
          <span>{warningMessages[idx]}</span>
        </div>
      {:else if warnType === 2}
        <div
          class="bg-warning w-full rounded-lg text-black p-2 py-2 flex items-start mb-3 space-x-2 text-sm"
        >
          <AlertTriangle size="20" class="flex-shrink-0 mt-0.5" />
          <span>{warningMessages[idx]}</span>
        </div>
      {:else if warnType === 3}
        <div
          class="bg-error w-full rounded-lg text-white p-2 py-2 flex items-start mb-3 space-x-2 text-sm"
        >
          <AlertCircle size="20" class="flex-shrink-0 mt-0.5" />
          <span>{warningMessages[idx]}</span>
        </div>
      {/if}
    {/each}

    <!-- Buttons -->
    <div class="flex gap-2 mt-6">
      {#if canProceed && newSoftware && newVersion}
        <button
          on:click={onConfirm}
          disabled={isChanging}
          class="btn btn-primary flex-1"
        >
          {#if isChanging}
            <span class="loading loading-spinner loading-sm"></span>
          {/if}
          {$t("confirm") || "Confirm"}
        </button>
      {:else}
        <button disabled class="btn btn-disabled flex-1">
          {$t("confirm") || "Confirm"}
        </button>
      {/if}

      <label
        for="softwaremodal"
        style="margin:0rem;"
        class="btn btn-neutral flex-1">{$t("cancel") || "Cancel"}</label
      >
    </div>
  </div>
</div>
