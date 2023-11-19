<script lang="ts">
  import Version from "./Version.svelte";
  import { apiurl, getVersions, lrurl } from "$lib/scripts/req";
  import { browser } from "$app/environment";
  import { Plus } from "lucide-svelte";
  import PluginResult from "./PluginResult.svelte";
  import { marked } from "marked";
  import { t } from "$lib/scripts/i18n";

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

  if (browser) {
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
  function get() {
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
          //change youtube.com to youtube-nocookie.com
          data.body = data.body.replaceAll(
            "https://www.youtube.com/embed",
            "https://www.youtube-nocookie.com/embed"
          );
          data.body = data.body.replaceAll("http://", "https://");

          let newDimensions = '"height="304" width="542"';
          if (window.innerWidth < 768) {
            newDimensions = '"height="198" width="380"';
          }
          data.body = data.body.replaceAll(
            'height="358" width="638"',
            newDimensions
          );
          data.body = data.body.replaceAll(
            'height="360" width="640"',
            newDimensions
          );
          //make all links open in a new tab
          data.body = data.body.replaceAll(
            "href=",
            'target="_blank" rel="noreferrer" href='
          );
          document.getElementById("body" + suffix).innerHTML = marked(
            data.body
          );

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
          //change youtube.com to youtube-nocookie.com
          data = data.replaceAll(
            "https://www.youtube.com/embed",
            "https://www.youtube-nocookie.com/embed"
          );
          data = data.replaceAll("http://", "https://");
          let newDimensions = '"height="304" width="542"';
          if (window.innerWidth < 768) {
            newDimensions = '"height="198" width="380"';
          }
          data = data.replaceAll('height="358" width="638"', newDimensions);
          data = data.replaceAll('height="360" width="640"', newDimensions);
          //make all links open in a new tab
          data = data.replaceAll(
            "href=",
            'target="_blank" rel="noreferrer" href='
          );
          document.getElementById("body" + suffix).innerHTML = marked(data);
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
              },
            });
          }
        });
        //if it's still blank, add a message saying that there are no versions for this plugin
        if (document.getElementById("list" + suffix).innerHTML == "") {
          document.getElementById("list" + suffix).innerHTML =
            "<p class='text-center'>" + $t("noVersionsMod") + "</p>";
        }
      });
    } else if (platform == "cf") {
      document.getElementById("list" + suffix).innerHTML = "";

      fetch(apiurl + "curseforge/" + id + "/versions", {
        method: "GET",

        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
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
                },
              });
            }
          });
          //if it's still blank, add a message saying that there are no versions for this plugin
          if (document.getElementById("list" + suffix).innerHTML == "") {
            document.getElementById("list" + suffix).innerHTML =
              "<p class='text-center'>" + $t("noVersionsMod") + "</p>";
          }
        });
    }
  }
</script>

{#if buttonType == "default"}
  <label
    for="versions"
    on:click={get}
    class="btn btn-circle btn-ghost absolute right-0"><Plus /></label
  >
{:else if buttonType == "2"}
  <label
    for="versions{suffix}"
    on:click={get}
    class="btn btn-xs btn-neutral mt-0.5">{$t("versions")}</label
  >
{/if}

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versions{suffix}" class="modal-toggle" />
<div class="modal flex flex-col justify-center">
  <div class="modal-box w-[97%] h-[97%] max-w-5xl space-y-5">
    <div class="pt-6">
      <!-- Plugin Result cannot be imported due to a bug where it always says 'Simple Voice Chat'-->
      <div class="bg-base-200 rounded-lg p-3">
        <div
          class="flex justify-between place-items-center max-w-full relative"
        >
          <div class="flex space-x-3 flex-shrink-0 w-minus-7">
            {#if platform == "mr"}
              <a href="https://modrinth.com/plugin/{slug}" target="_blank">
                <img
                  id="pluginIcon"
                  src={icon}
                  alt="noicon"
                  class="w-14 h-14 bg-base-300 rounded-lg text-sm"
                />
              </a>
              <div class="max-w-full w-minus-7">
                <div class="sm:flex gap-1 max-w-full">
                  <a
                    id="pluginTitle"
                    href="https://modrinth.com/plugin/{slug}"
                    target="_blank"
                    class="flex link link-hover text-xl font-bold w-[10rem] md:w-auto break-all sm:break-works"
                    >{name}</a
                  >
                  <div class="flex space-x-1 place-items-end">
                    <p>{$t("by")}</p>
                    <a
                      id="pluginAuthor"
                      href="https://modrinth.com/user/{author}"
                      target="_blank"
                      class="link link-hover">{author}</a
                    >
                  </div>
                </div>
                <p class="w-minus-7" id="pluginDesc">
                  {desc}
                </p>
              </div>
            {:else if platform == "cf"}
              <a
                href="https://curseforge.com/minecraft/mc-mods/{slug}"
                target="_blank"
              >
                <img
                  id="pluginIcon"
                  src={icon}
                  alt="noicon"
                  class="w-14 h-14 bg-base-300 rounded-lg text-sm"
                />
              </a>
              <div class="max-w-full w-minus-7">
                <div class="sm:flex gap-1 max-w-full">
                  <a
                    id="pluginTitle"
                    href="https://curseforge.com/minecraft/mc-mods/{slug}"
                    target="_blank"
                    class="flex link link-hover text-xl font-bold w-[10rem] md:w-auto break-all sm:break-works"
                    >{name}</a
                  >
                  <div class="flex space-x-1 place-items-end">
                    <p>{$t("by")}</p>
                    <a
                      id="pluginAuthor"
                      href="https://curseforge.com/members/{author}"
                      target="_blank"
                      class="link link-hover">{author}</a
                    >
                  </div>
                </div>
                <p class="w-minus-7" id="pluginDesc">
                  {desc}
                </p>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div
        class="flex max-md:flex-col-reverse justify-between gap-2 lg:gap-5 mt-5"
      >
        <div class="">
          <h3 class="font-bold text-2xl mb-4">{$t("description")}</h3>
          <article
            id="body{suffix}"
            class="mb-5 prose bg-base-200 rounded-lg p-3"
          />
        </div>

        <div class="">
          <h3 class="font-bold text-2xl mb-4">{$t("versions")}</h3>
          <div id="list{suffix}" class="space-y-2 mb-5" />
        </div>
      </div>
    </div>

    <div class="modal-action">
      <label
        for="versions{suffix}"
        class="btn btn-neutral btn-sm btn-circle absolute right-2 top-2 mb-5"
        >✕</label
      >
    </div>
  </div>
</div>
