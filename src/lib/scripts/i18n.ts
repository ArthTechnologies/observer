import { derived, writable } from "svelte/store";
import translations from "./translations";
import { browser } from "$app/environment";

export const locale = writable("en-US");
export const locales = Object.keys(translations);

function translate(locale: string, key: string, vars: string) {
  if (!key) throw new Error("no key provided to $t()");
  if (!locale) throw new Error(`no translation for key "${key}"`);

  if (browser) if (localStorage.getItem("lang") != null) locale = localStorage.getItem("lang");

  let text;
  if (Object.keys(translations).includes(locale)) {
    text = translations[locale][key]; 
  } else {
    let foundSimilarLocale = false;
    //take the first 2 letters of the locale, see if something in the
    //translations starts with that, and if so, use that
    const shortLocale = locale.split("-")[0];

    if (Object.keys(translations).includes(shortLocale)) {
      //search for a key that starts with the short locale
      const matchingKey = Object.keys(translations).find((k) =>
        k.startsWith(shortLocale)
      );
      if (matchingKey) {
        text = translations[matchingKey][key];
        foundSimilarLocale = true;
      }
    }
    if (!foundSimilarLocale) {
      text = translations["en-US"][key];
    }
  }


  if (!text) console.error(`no translation found for ${locale}.${key}`);

  Object.keys(vars).map((k) => {
    const regex = new RegExp(`{{${k}}}`, "g");
    text = text.replace(regex, vars[k]);
  });

  return text;
} 


export const t = derived(
  locale,
  ($locale) =>
    (key: string, vars = {}) =>
      translate($locale, key, vars)
);
