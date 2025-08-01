<script>
    import { ArrowDownUp, X } from "lucide-svelte";
    export let subscription = {};
    
</script>
   <label for="delete" class="btn btn-error btn-sm" 
                                            >
                                                <X size=16 class="mr-1"/>
                                                Cancel
</label>
<!-- Put this part before </body> tag -->
<input type="checkbox" id="delete" class="modal-toggle" />
<div class="modal" style="margin:0rem;">
  <div class="modal-box bg-opacity-95 backdrop-blur relative">
    <label
      for="delete"
      class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2">✕</label
    ></div></div>