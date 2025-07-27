<script>
  import { BoxIcon, ChevronUp, InfoIcon, Trash2 } from "lucide-svelte";
</script>

  <div
    class="p-2 rounded-lg bg-base-200 flex justify-between items-center h-16"
  >
    <div class="flex items-center justify-between gap-1 break-all w-full">
      <div class="flex gap-2 mr-1 items-center max-md:mb-1">
  
        <div class="h-12 w-12 flex-shrink-0 bg-slate-700 animate-pulse rounded-md flex items-center justify-center">
         
        </div>

        <div class="flex flex-col justify-between h-11">
        <div class="bg-slate-700 animate-pulse h-5 mt-1 rounded-md w-[5rem]"></div>
           <div  class="bg-slate-700 animate-pulse h-3.5 rounded-md w-[12rem]">
      
    
         
        </div>
        
      </div>

    
    </div>

    <div class="flex items-center">
                      <button class="btn btn-sm text-xs btn-ghost opacity-50 pointer-events-none">
          Disable
        </button>

      <div
       class="btn btn-square btn-ghost btn-sm disabled opacity-50 pointer-events-none"

      >
       <Trash2 size="16" />
       </div>
             <div
       class="btn btn-square btn-ghost btn-sm disabled opacity-50 pointer-events-none"

 
      >
       <InfoIcon size="16" />
    </div>
                
     
  

      

    </div>
  </div></div>
