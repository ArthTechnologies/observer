<script lang="ts">
  import { t } from "$lib/scripts/i18n";
</script>

<div class="m-3">
  <div class="card w-[21rem] h-40 bg-base-100 image-full">
    <div class="card-body animate-pulse">
      <h2 class="card-title">
        <div class="h-3.5 bg-base-100 rounded w-16 mt-[.45rem]" />
      </h2>

      <div class="h-2.5 bg-base-100 rounded w-28 mt-[.9rem]" />

      <!-- <div class="card-actions justify-beginning" /> -->
      <div class="card-actions mt-[.4rem]">
        <!-- placeholder for now? -->
        <div class="grow space-x-1.5 flex">
          <button
            type="submit"
            class="btn btn-disabled bg-base-100 btn-sm h-9 w-[3.75rem]"
          />
          <button type="submit" class="btn btn-disabled bg-base-100 btn-sm h-9"
            ><p class="invisible">{$t("button.start")}</p></button
          >
          <button type="submit" class="btn btn-disabled bg-base-100 btn-sm h-9"
            ><p class="invisible">{$t("button.stop")}</p></button
          >
        </div>

        <div class="badge w-20 bg-base-100 right-4 top-4 absolute" />
      </div>
    </div>
  </div>
</div>
