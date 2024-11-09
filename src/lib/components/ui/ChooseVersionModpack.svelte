<script lang="ts">
  import ModpackVersion from "./ModpackVersion.svelte";
  import { apiurl, getVersions, lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import {
    AlertTriangle,
    ArrowUpRight,
    ClipboardIcon,
    ClipboardList,
    InfoIcon,
    Plus,
  } from "lucide-svelte";
  import PluginResult from "./PluginResult.svelte";
  import { marked } from "marked";
  import { t } from "$lib/scripts/i18n";
  import { handleDesc } from "$lib/scripts/utils";
  import { fromJSON } from "postcss";
  import TranslateableText from "./TranslateableText.svelte";

  export let id: string;
  export let name: string;
  export let author: string;
  export let desc: string;
  export let icon: string;
  export let platform: string;
  export let slug: string = "/";
  export let buttonType: string = "default";
  let fullDesc = "";
  let lang = "en";
  var software = "";
  var sVersion = "";

  if (browser) {
    lang = window.navigator.language;
    if (localStorage.getItem("lang") != null) {
      lang = localStorage.getItem("lang");
    }
    lang = lang.split("-")[0];
    lang = lang.split("_")[0];
    //if on the /newserver page
    if (buttonType == "default") {
      software = document
        .getElementById("softwareDropdown")
        .value.split(" - ")[0]
        .toLowerCase();
      sVersion = document.getElementById("versionDropdown").value.split("*")[0];
    } else {
      software = localStorage.getItem("serverSoftware");
      sVersion = localStorage.getItem("serverVersion");
    }

    software = software.toLowerCase();

    switch (sVersion) {
      case "latest":
        sVersion = "1.19.4";
        break;
    }
  }
  function get() {
    //this disables the scrollbar of the modal below this one
    if (document.getElementById("addModpackModalScroll") != null) {
      document.getElementById("addModpackModalScroll").style.overflow =
        "hidden";
    }
    if (document.getElementById("manageScroll") != null) {
      document.getElementById("manageScroll").style.overflow = "hidden";
    }

    if (platform == "mr") {
      fetch(lrurl + "project/" + id, {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())

        .then((data) => {
          document.getElementById("body" + buttonType).innerHTML = marked(
            data.body
          );
          document.getElementById("body" + buttonType).innerHTML = handleDesc(
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
      console.error(id);

      fetch(apiurl + "curseforge/" + id + "/description", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          document.getElementById("body" + buttonType).innerHTML = marked(data);

          document.getElementById("body" + buttonType).innerHTML = handleDesc(
            marked(data),
            buttonType
          );
          fullDesc = data
            .replace(/<[^>]*>?/gm, "")
            .replace(/&nbsp;/g, "\n")
            .replace(/\n/g, "  ");

          console.log("name + " + name);

          document.getElementById("pluginTitle").innerHTML = name;
          document.getElementById("pluginDesc").innerHTML = desc;
          document.getElementById("pluginIcon").src = icon;
          document.getElementById("pluginAuthor").innerHTML = author;
        });
    }
    let vname = "undefined";
    if (platform == "mr") {
      document.getElementById("list" + buttonType).innerHTML = "";
      getVersions(id).then((data) => {
        data.forEach((version) => {
          let from = "modal";
          if (buttonType == "default") from = "serverpage";
          if (
            version.name != vname &&
            version.loaders.includes(software) &&
            version.game_versions.includes(sVersion)
          ) {
            vname = version.name;

            new ModpackVersion({
              target: document.getElementById("list" + buttonType),
              props: {
                name: version.name,
                date: version.date_published,
                type: version.version_type,
                url: version.files[0].url,
                modpackId: id,
                versionId: version.id,
                alreadyInstalled:
                  version.id == localStorage.getItem("modpackVersionID") &&
                  buttonType != "default",
                from: from,
                changelog: version.changelog,
                platform: "mr",
              },
            });
          }
        });

        if (document.getElementById("list" + buttonType).innerHTML == "") {
          document.getElementById("list" + buttonType).innerHTML =
            "<p class='text-center'>" + $t("noVersionsModpack") + "</p>";
        }
      });
    } else if (platform == "cf") {
      document.getElementById("list" + buttonType).innerHTML = "";
      fetch(apiurl + "curseforge/" + id + "/versions", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          document
            .getElementById("noSoftwareSpecifiedWarning")
            .classList.add("hidden");
          console.error(data);
          data.forEach((version) => {
            let from = "modal";
            if (buttonType == "default") from = "serverpage";
            if (
              version.name != vname &&
              (version.gameVersions.includes(
                software.charAt(0).toUpperCase() + software.slice(1)
              ) ||
                version.displayName
                  .toLowerCase()
                  .includes(software.toLowerCase())) &&
              version.gameVersions.includes(sVersion)
            ) {
              let type = "release";
              if (version.releaseType == 1) type = "beta";
              else if (version.releaseType == 0) type = "alpha";
              console.log(version);
              new ModpackVersion({
                target: document.getElementById("list" + buttonType),
                props: {
                  name: version.displayName,
                  date: version.fileDate,
                  type: type,
                  url: version.downloadUrl,
                  id: id,
                  pluginName: name,
                  modtype: "mod",
                  dependencies: version.dependencies,
                  versionId: version.id,
                  alreadyInstalled:
                    version.id == localStorage.getItem("modpackVersionID") &&
                    buttonType != "default",
                  from: from,
                  platform: "cf",
                  alternateFileId: version.alternateFileId,
                },
              });
            } else if (
              version.name != vname &&
              version.gameVersions.includes(sVersion)
            ) {
              //if there is no server software listed (rlcraft does this sometimes) put it
              //in a special section
              if (
                document.getElementById("noSoftwareSpecifiedWarning") != null
              ) {
                document
                  .getElementById("noSoftwareSpecifiedWarning")
                  .classList.remove("hidden");
              }
              let type = "release";
              if (version.releaseType == 1) type = "beta";
              else if (version.releaseType == 0) type = "alpha";
              console.log(version);
              new ModpackVersion({
                target: document.getElementById(
                  "noSoftwareSpecifiedList" + buttonType
                ),
                props: {
                  name: version.displayName,
                  date: version.fileDate,
                  type: type,
                  url: version.downloadUrl,
                  id: id,
                  pluginName: name,
                  modtype: "mod",
                  dependencies: version.dependencies,
                  versionId: version.id,
                  alreadyInstalled:
                    version.id == localStorage.getItem("modpackVersionID") &&
                    buttonType != "default",
                  from: from,
                  platform: "cf",
                  alternateFileId: version.alternateFileId,
                },
              });
            }
          });
          if (document.getElementById("list" + buttonType).innerHTML == "") {
            document.getElementById("list" + buttonType).innerHTML =
              "<p class='text-center'>" + $t("noVersionsModpack") + "</p>";
          }
        });
    }
  }

  function close() {
    //this function is for re-enabling the scrollbar of the modal below this one
    if (document.getElementById("addModpackModalScroll") != null)
      document.getElementById("addModpackModalScroll").style.overflow = "auto";

    if (document.getElementById("manageScroll") != null)
      document.getElementById("manageScroll").style.overflow = "auto";
  }
</script>

{#if buttonType == "default"}
  <label
    for="versions{buttonType}"
    on:click={get}
    class="btn btn-circle btn-ghost absolute right-0"><Plus /></label
  >
{:else if buttonType == "2"}
  <label
    for="versions{buttonType}"
    on:click={get}
    class="btn btn-xs btn-neutral">{$t("versions")}</label
  >
{/if}

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versions{buttonType}" class="modal-toggle" />
<div class="modal flex flex-col justify-center" style="margin:0rem;">
  <div
    id="chooseVersionsModalScroll"
    class="modal-box bg-opacity-[.975] backdrop-blur w-[97%] h-[97%] max-w-5xl space-y-5"
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
            {:else if platform == "cf"}
              <a
                class="shrink-0"
                href="https://curseforge.com/minecraft/modpacks/{slug}"
                target="_blank"
              >
                <img
                  id="pluginIcon"
                  src={icon}
                  class="w-16 h-16 bg-base-300 rounded-lg text-sm"
                />
              </a>
            {/if}
            <div class="max-w-full w-minus-7">
              <div>
                {#if platform == "mr"}
                  <a
                    id="pluginTitle"
                    href="https://modrinth.com/plugin/{slug}"
                    target="_blank"
                    class=" hover:link text-xl font-bold md:w-auto break-all sm:break-works"
                    >{name}</a
                  >

                  {$t("by")}
                  <a
                    id="pluginAuthor"
                    href="https://modrinth.com/user/{author}"
                    target="_blank"
                    class="hover:link">{author}</a
                  >
                {:else if platform == "cf"}
                  <a
                    id="pluginTitle"
                    href="https://curseforge.com/minecraft/modpacks/{slug}"
                    target="_blank"
                    class=" hover:link text-xl font-bold md:w-auto break-all sm:break-works"
                    >{name}</a
                  >

                  {$t("by")}
                  <a
                    id="pluginAuthor"
                    href="https://curseforge.com/members/{author}"
                    target="_blank"
                    class="hover:link">{author}</a
                  >
                {/if}
              </div>
              <p class="w-minus-7" id="pluginDesc">
                <TranslateableText text={desc} />
              </p>
            </div>
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
            id="body{buttonType}"
            class="mb-5 prose bg-base-200 rounded-lg p-3 min-h-[50rem]"
          />
        </div>

        <div class="md:w-[21.6rem]">
          <div class="flex justify-between items-center mb-4">
            <h3 class="font-bold text-2xl">{$t("versions")}</h3>
            <a href="#body{buttonType}" class="md:hidden btn btn-sm btn-neutral"
              >{$t("button.goToDesc")}</a
            >
          </div>
          <div id="list{buttonType}" class="space-y-2 mb-5" />
          <div id="noSoftwareSpecifiedWarning" class="mb-3 mt-6">
            <div role="alert" class="alert">
              <InfoIcon />
              <span>{$t("warning.noSoftwareSpecified")}</span>
            </div>
          </div>
          <div
            id="noSoftwareSpecifiedList{buttonType}"
            class="space-y-2 mb-5"
          />
        </div>
      </div>
    </div>

    <div class="modal-action">
      <label
        for="versions{buttonType}"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2 mb-5"
        on:click={close}>✕</label
      >
    </div>
  </div>
</div>
