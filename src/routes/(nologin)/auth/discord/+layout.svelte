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
      <button class="btn btn-disabled">
        {$t("navbar.servers")}
      </button>
      <button class="btn btn-disabled btn-circle">
        <Plus />
      </button>
      <button class="btn btn-disabled btn-circle">
        <ShoppingCart />
      </button>
      <button class="btn btn-disabled btn-circle">
        <Moon />
      </button>
      <button class="btn btn-disabled btn-circle">
        <User />
      </button>
    </div>
  </div>
  <slot />
</div>
