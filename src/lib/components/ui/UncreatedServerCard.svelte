<script lang="ts">
  import { browser } from "$app/environment";
  import { t } from "$lib/scripts/i18n";
  export let id: number;
  let address = "arthmc.xyz";
  let port = 10000 + parseInt(id);
  if (browser) {
    address = localStorage.getItem("address");
  }
</script>

<div class="m-3 w-[21rem] mb-[1.25rem]">
  <div class="card w-50 bg-neutral shadow-xl image-full h-[10.5rem]">
    <div class="card-body pr-0">
      <h2 class="card-title mb-1.5">
        <div class="h-3.5 bg-base-100 rounded w-16 mt-[.45rem]" />
      </h2>
      <p class="opacity-50">{address}:{port}</p>
      <!-- <div class="card-actions justify-beginning" /> -->
      <div class="card-actions justify-end">
        <!-- placeholder for now? -->
        <div class="grow space-x-1.5 flex">
          <a href="/newserver?id={id}"
            ><button class="btn btn-primary btn-sm h-9">Create Server</button
            ></a
          >

          <button
            type="submit"
            class="btn bg-base-100 btn-sm h-9 pointer-events-none"
            ><p class="invisible">{$t("button.start")}</p></button
          >
        </div>
        <div class="self-center">
          <div class="badge w-24 bg-base-100 right-4 top-4 absolute" />
        </div>
      </div>
    </div>
  </div>
</div>
