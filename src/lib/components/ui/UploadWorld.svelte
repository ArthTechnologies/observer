<script>
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { t } from "$lib/scripts/i18n";
</script>

<label for="upload-world" class="btn btn-primary btn-block">Upload World</label>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="upload-world" class="modal-toggle" />
<div class="modal">
  <div class="modal-box relative flex flex-col space-y-3">
    <label
      for="upload-world"
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</label
    >
    Upload World File
    <input type="file" id="worldFile" class="file-input w-full max-w-xs" />
  </div>
</div>
