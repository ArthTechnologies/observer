<script>
  import { t, locale } from "$lib/scripts/i18n";
  import { onMount } from "svelte";
  import { getSettings } from "$lib/scripts/req";
  import { disableScrollHandling } from "$app/navigation";
  import { themeChange } from "theme-change";
  let stripe = true;
  function readSettings() {
    getSettings().then((res) => {
      console.log("response:" + res.enablePay);
      //set element "webport"'s placeholder to res.webport
      //set checkbox "enablepay" to res.enablePay
      if (res.enablePay == false) {
        stripe = false;
      }
      if (res.disableAuth == true) {
        //add checkked attribute to checkbox
        //document.getElementById("disableauth").setAttribute("checked", "");
      }
      document.getElementById("serversperuser").placeholder =
        res.serversPerUser;
      document.getElementById("weblogo").placeholder = res.webLogo;
      document.getElementById("trusteddomains").placeholder =
        res.trustedDomains;
    });
    document.getElementById("browsertitle").placeholder = res.browserTitle;
  }
  onMount(() => {
    readSettings();
  });
</script>

<p class="label">{$t("settings.l.max")}</p>
<div class="flex space-x-2">
  <input
    id="serversperuser"
    class="input-bordered input-primary input w-full max-w-xs bg-base-300"
    type="text"
    placeholder=""
  />
</div>

<p class="label">{$t("settings.l.logo")}</p>
<div class="flex space-x-2">
  <input
    id="weblogo"
    class="input-bordered input-primary input w-full max-w-xs bg-base-300"
    type="text"
    placeholder=""
  />
  <img
    src="/images/sitelogo.svg"
    width="60ch"
    height="60ch"
    alt="The current Panel logo."
  />
</div>

<p class="text p-2">
  {#if stripe}{$t("settings.stripeOn")}{:else}{$t("settings.stripeOff")}{/if}
</p>

<div class="cursor-pointer label">
  <p class="label-text">{$t("settings.requireAuth")}</p>
  <input id="disableauth" type="checkbox" class="toggle toggle-primary" />
</div>

<div class="divider text-xl font-semibold mt-8 mb-6">
  {$t("settings.h.trusted")}
</div>

<p>
  {$t("settings.desc.trusted")}
</p>
<input
  id="trusteddomains"
  class="input-bordered input-primary input w-full max-w-xs bg-base-300 my-4"
  type="text"
  placeholder=""
/>
