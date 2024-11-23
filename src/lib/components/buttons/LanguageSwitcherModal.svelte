<script>
  import { browser } from "$app/environment";
    import { t } from "$lib/scripts/i18n";
  import { Languages, ShoppingCart } from "lucide-svelte";
  import { onMount } from "svelte";
  function en() {
    localStorage.setItem("lang", "en-US");
    window.location.reload();
    closeModal();
  }
  function es() {
    localStorage.setItem("lang", "es-ES");
    window.location.reload();
  closeModal();
  }

  function closeModal() {
    const modal = document.getElementById("modal_language");
    modal.close();
  }	


  
</script>


<dialog id="modal_language" class="modal">
  <div class="modal-box">
    <form method="dialog">
      <button class="btn btn-sm btn-circle btn-neutral absolute right-2 top-2">✕</button>
    </form>
    <h3 class="text-lg font-bold mb-4">Language</h3>
    <select class="select select-bordered w-full max-w-xs">
      <option on:click={en}>English</option>
      <option on:click={es}>Español</option>
    </select>
  </div>
</dialog>