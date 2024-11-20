<script>
  import { HelpCircle, Languages, ShoppingCart, User } from "lucide-svelte";
</script>

<div class="bg-base-100 h-16 mb-5 flex justify-between items-center px-8">
  <div class="flex gap-4">
    <img src="/favicon.png" class="w-12" />
    <select class="select select-bordered w-full max-w-xs">
      <option disabled selected>TophNTrish</option>
      <option>Han Solo</option>
      <option>Greedo</option>
    </select>
  </div>
  <div class="flex gap-4">
    <button class="btn btn-ghost btn-square">
      <HelpCircle />
    </button>
    <button class="btn btn-ghost btn-square">
      <Languages />
    </button>
    <button class="btn btn-ghost btn-square">
      <ShoppingCart />
    </button>
    <button class="btn btn-ghost btn-square">
      <User />
    </button>
  </div>
</div>
