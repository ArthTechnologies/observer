<script lang="ts">
  import Version from "./Version.svelte";
  import { apiurl, getVersions, lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { InfoIcon, ClipboardList, Plus } from "lucide-svelte";
  import { handleDesc } from "$lib/scripts/utils";
  import { marked } from "marked";
  import { t } from "$lib/scripts/i18n";
  import TranslateableText from "./TranslateableText.svelte";

  export let id: string;
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let platform: string;
  export let slug: string;
  export let buttonType: string = "default";
  //the suffix is needed to seperate the modal for a mod search result and a installed mod.
  let suffix = "";
  if (buttonType != "default") {
    suffix = "manage";
  }
  var software = "";
  var sVersion = "";
  let fullDesc = "";
  let lang = "en";

  if (browser) {
    lang = window.navigator.language;
    if (localStorage.getItem("lang") != null) {
      lang = localStorage.getItem("lang");
    }
    lang = lang.split("-")[0];
    lang = lang.split("_")[0];
    software = localStorage.getItem("serverSoftware");
    sVersion = localStorage.getItem("serverVersion");
    switch (software) {
      case "Velocity":
        sVersion = localStorage.getItem("latestVersion");
      default:
        software = software.toLowerCase();
        break;
    }
    switch (sVersion) {
      case "latest":
        sVersion = "1.19.4";
        break;
    }
  }
  function get(index = 0) {
    //this disables the scrollbar of the modal below this one
    document.getElementById("addModModalScroll").style.overflow = "hidden";
    //get description
    if (platform == "mr") {
      fetch(lrurl + "project/" + id, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())

        .then((data) => {
          document.getElementById("body" + suffix).innerHTML = marked(
            data.body
          );
          document.getElementById("body" + suffix).innerHTML = handleDesc(
            marked(data.body)
          );

          fullDesc = data.body
            .replace(/<[^>]*>?/gm, "")
            .replace(/&nbsp;/g, "\n")
            .replace(/\n/g, "  ");

          document.getElementById("pluginTitle").innerHTML = data.title;

          document.getElementById("pluginDesc").innerHTML = data.description;
          document.getElementById("pluginIcon").src = data.icon_url;

          fetch(lrurl + "team/" + data.team + "/members", {
            method: "GET",

            headers: {
              "Content-Type": "application/json",
            },
          })
            .then((response) => response.json())

            .then((data) => {
              document.getElementById("pluginAuthor").innerHTML =
                data[0].user.username;
            });
        });
    } else if (platform == "cf") {
      fetch(apiurl + "curseforge/" + id + "/description", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("body" + suffix).innerHTML = marked(data);
          document.getElementById("body" + suffix).innerHTML = handleDesc(
            marked(data)
          );
          fullDesc = data
            .replace(/<[^>]*>?/gm, "")
            .replace(/&nbsp;/g, "\n")
            .replace(/\n/g, "  ");

          console.log(fullDesc);
          document.getElementById("pluginTitle").innerHTML = name;
          document.getElementById("pluginDesc").innerHTML = desc;
          document.getElementById("pluginIcon").src = icon;
          document.getElementById("pluginAuthor").innerHTML = author;
        });
    }

    let vname = "undefined";
    if (platform == "mr") {
      getVersions(id).then((data) => {
        document.getElementById("list" + suffix).innerHTML = "";
        data.forEach((version) => {
          if (
            version.name != vname &&
            version.loaders.includes(software) &&
            version.game_versions.includes(sVersion)
          ) {
            vname = version.name;

            new Version({
              target: document.getElementById("list" + suffix),
              props: {
                name: version.name,
                date: version.date_published,
                type: version.version_type,
                url: version.files[0].url,
                pluginId: id,
                pluginName: name,
                modtype: "mod",
                dependencies: version.dependencies,
                changelog: version.changelog,
                versionId: version.id,
              },
            });
          }
        });
        //if it's still blank, add a message saying that there are no versions for this plugin
        if (document.getElementById("list" + suffix).innerHTML == "") {
          get(index + 1);
        }
      });
    } else if (platform == "cf") {
      document.getElementById("list" + suffix).innerHTML = "";

      fetch(apiurl + "curseforge/" + id + "/versions?index=" + index * 50, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.error(sVersion, software);
          console.log(data);
          data.forEach((version) => {
            if (
              version.name != vname &&
              version.gameVersions.includes(sVersion)
            ) {
              vname = version.displayName;
              console.log(version.releaseType == 1);
              let type = "release";
              if (version.releaseType == 1) type = "beta";
              else if (version.releaseType == 0) type = "alpha";
              //If software is specified
              if (
                version.gameVersions.includes(
                  software.charAt(0).toUpperCase() + software.slice(1)
                )
              ) {
                new Version({
                  target: document.getElementById("list" + suffix),
                  props: {
                    name: version.displayName,
                    date: version.fileDate,
                    type: type,
                    url: version.downloadUrl,
                    pluginId: id,
                    pluginName: name,
                    modtype: "mod",
                    dependencies: version.dependencies,
                    platform: "cf",
                    versionId: version.id,
                  },
                });
              } else {
                new Version({
                  target: document.getElementById(
                    "noSoftwareSpecifiedList" + suffix
                  ),
                  props: {
                    name: version.displayName,
                    date: version.fileDate,
                    type: type,
                    url: version.downloadUrl,
                    pluginId: id,
                    pluginName: name,
                    modtype: "mod",
                    dependencies: version.dependencies,
                    platform: "cf",
                    versionId: version.id,
                  },
                });
              }
            }
          });
          //this goes to the next page if there are no applicable versions.

          if (document.getElementById("list" + suffix).innerHTML == "") {
            //if none of the pages have an applicable version the noVersionsMod texxt will be applied.
            if (data.length == 50) {
              get(index + 1);
            } else {
              document.getElementById("list" + suffix).innerHTML =
                "<p class='text-center'>" + $t("noVersionsMod") + "</p>";
            }
          }
        });
    }
  }
  function close() {
    document.getElementById("addModModalScroll").style.overflow = "auto";
  }
</script>

{#if buttonType == "default"}
  <label
    for="versions"
    on:click={() => {
      get();
    }}
    class="btn btn-circle btn-ghost absolute right-0"><Plus /></label
  >
{:else if buttonType == "2"}
  <label
    for="versions{suffix}"
    on:click={() => {
      get();
    }}
    class="btn btn-xs btn-neutral">{$t("versions")}</label
  >
{/if}

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versions{suffix}" class="modal-toggle" />
<div class="modal flex flex-col justify-center" style="margin:0rem;">
  <div
    id="chooseVersionsModalScroll"
    class="modal-box w-[97%] h-[97%] max-w-5xl space-y-5"
  >
    <div class="pt-6">
      <!-- Plugin Result cannot be imported due to a bug where it always says 'Simple Voice Chat'-->
      <div class="bg-base-200 rounded-lg p-3">
        <div
          class="flex justify-between place-items-center max-w-full relative"
        >
          <div class="flex space-x-3 flex-shrink-0 w-minus-7">
            {#if platform == "mr"}
              <a
                class="shrink-0"
                href="https://modrinth.com/plugin/{slug}"
                target="_blank"
              >
                <img
                  id="pluginIcon"
                  src={icon}
                  class="w-16 h-16 bg-base-300 rounded-lg text-sm"
                />
              </a>
              <div class="max-w-full w-minus-7">
                <div>
                  <a
                    id="pluginTitle"
                    href="https://modrinth.com/plugin/{slug}"
                    target="_blank"
                    class=" hover:link text-xl font-bold w-[10rem] md:w-auto break-all sm:break-works"
                    >{name}</a
                  >

                  {$t("by")}
                  <a
                    id="pluginAuthor"
                    href="https://modrinth.com/user/{author}"
                    target="_blank"
                    class="hover:link">{author}</a
                  >
                </div>
                <p class="w-minus-7" id="pluginDesc">
                  <TranslateableText text={desc} />
                </p>
              </div>
            {:else if platform == "cf"}
              <a
                class="shrink-0"
                href="https://curseforge.com/minecraft/mc-mods/{slug}"
                target="_blank"
              >
                <img
                  id="pluginIcon"
                  src={icon}
                  class="w-16 h-16 bg-base-300 rounded-lg text-sm"
                />
              </a>
              <div class="max-w-full w-minus-7">
                <div>
                  <a
                    id="pluginTitle"
                    href="https://curseforge.com/minecraft/mc-mods/{slug}"
                    target="_blank"
                    class=" hover:link text-xl font-bold w-minus-7 md:w-auto break-all sm:break-works"
                    >{name}</a
                  >

                  {$t("by")}
                  <a
                    id="pluginAuthor"
                    href="https://curseforge.com/members/{author}"
                    target="_blank"
                    class="hover:link">{author}</a
                  >
                </div>
                <p class="w-minus-7" id="pluginDesc">
                  <TranslateableText text={desc} />
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div
        class="flex max-md:flex-col-reverse justify-between gap-2 lg:gap-5 mt-5"
      >
        <div class="md:w-[36.6rem]">
          <div class="flex justify-between items-center">
            <h3 class="font-bold text-2xl mb-4">{$t("description")}</h3>
            {#if lang.toLowerCase() != "en"}
              <button
                class="btn btn-xs btn-ghost"
                on:click={() => {
                  navigator.clipboard.writeText(fullDesc);
                }}
                ><ClipboardList size="16" class="mr-1" />
                {$t("button.copyToClipboard")}</button
              >
            {/if}
          </div>
          <article
            id="body{suffix}"
            class="mb-5 prose bg-base-200 rounded-lg p-3 min-h-[50rem]"
          />
        </div>

        <div class="md:w-[21.6rem]">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-2xl">{$t("versions")}</h3>
            <a href="#body{suffix}" class="md:hidden btn btn-sm btn-neutral"
              >{$t("button.goToDesc")}</a
            >
          </div>
          <div id="list{suffix}" class="space-y-2 mb-5" />
          <div id="noSoftwareSpecifiedWarning" class="mb-3 mt-6">
            <div role="alert" class="alert">
              <InfoIcon />
              <span>{$t("warning.noSoftwareSpecified")}</span>
            </div>
          </div>
          <div id="noSoftwareSpecifiedList{suffix}" class="space-y-2 mb-5" />
        </div>
      </div>
    </div>

    <div class="modal-action">
      <label
        for="versions{suffix}"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2 mb-5"
        on:click={close}>✕</label
      >
    </div>
  </div>
</div>
