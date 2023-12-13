<script lang="ts">
  import { t } from "$lib/scripts/i18n";
  import { Moon, User, Plus, ShoppingCart } from "lucide-svelte";
</script>

<!--Skeleton Navbar-->
<div>
  <div
    class="bg-base-300 w-screen h-[4.1rem] px-4 py-2 flex justify-between items-center"
  >
    <div class="bg-base-100 animate-pulse rounded-lg w-[7rem] h-[2.5rem]" />
    <div class="flex space-x-2">
      <button
        class="btn btn-ghost pointer-events-none animate-pulse text-slate-700"
      >
        {$t("navbar.servers")}
      </button>
      <button class="btn btn-ghost pointer-events-none btn-circle">
        <Plus class="animate-pulse" color="#2f3c4d" />
      </button>
      <button class="btn btn-ghost pointer-events-none btn-circle">
        <ShoppingCart class="animate-pulse" color="#2f3c4d" />
      </button>
      <button class="btn btn-ghost pointer-events-none btn-circle">
        <Moon class="animate-pulse" color="#2f3c4d" />
      </button>
      <button class="btn btn-ghost pointer-events-none btn-circle">
        <User class="animate-pulse" color="#2f3c4d" />
      </button>
    </div>
  </div>
  <slot />
</div>
