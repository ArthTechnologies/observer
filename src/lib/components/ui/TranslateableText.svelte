<script lang="ts">
  import { browser } from "$app/environment";
  import { apiurl } from "$lib/scripts/req";
  import { Sparkles } from "lucide-svelte";
  import { alert } from "$lib/scripts/utils";
  import { t } from "$lib/scripts/i18n";

  export let text: string;
  let deeplEnabled = false;
  let translatedText: string = $t("translating");
  let showing = "original";
  let lang = "en";
  if (browser) {
    lang = window.navigator.language;
    if (localStorage.getItem("lang") != null) {
      lang = localStorage.getItem("lang");
    }
    lang = lang.split("-")[0];
    lang = lang.split("_")[0];
    if (localStorage.getItem("enableDeepL") == "true") {
      deeplEnabled = true;
    }
  }
  function translate() {
    let url =
      apiurl +
      "translate?" +
      new URLSearchParams({ text: text, target_lang: lang });
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        translatedText = data.text;
        if (data.msg != null) {
          if (data.msg.includes("Error translating")) {
            alert("Error translating text");
          } else if (data.msg.includes("access is at capacity")) {
            alert("Sorry, our DeeL translation access is at capacity");
          } else {
            alert(data.msg);
          }
        }
      });
  }
</script>

{#if lang.toLowerCase() != "en" && text.split("").length < 500 && deeplEnabled}
  {#if showing == "original"}{text}{:else}{translatedText}{/if}
  <button
    class="btn btn-xs bg-[#0f2b46]"
    on:click={() => {
      if (showing == "original") {
        showing = "translated";
        if (translatedText == $t("translating")) translate();
      } else {
        showing = "original";
      }
    }}
    ><Sparkles size="16" class="mr-1.5" />
    <p>
      {#if showing == "original"}{$t(
          "button.deepL"
        )}{:else if showing == "translated"}{$t("button.deepL.back")}{/if}
    </p></button
  >
{:else}
  {text}
{/if}
