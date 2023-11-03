<script lang="ts">
    import ModpackVersion from "./ModpackVersion.svelte";
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
    var software = "";
    var sVersion = "";

    if (browser) {
        software = document.getElementById("softwareDropdown").value;
        sVersion = document.getElementById("versionDropdown").value;

        software = software.toLowerCase();

        switch (sVersion) {
            case "latest":
                sVersion = "1.19.4";
                break;
        }
    }
    function get() {
        if (platform == "mr") {
            fetch(lrurl + "project/" + id, {
                method: "GET",

                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())

                .then((data) => {
                    document.getElementById("body").innerHTML = marked(
                        data.body
                    );
                    document.getElementById("pluginTitle").innerHTML =
                        data.title;

                    document.getElementById("pluginDesc").innerHTML =
                        data.description;
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
                    console.error(data);
                    document.getElementById("body").innerHTML = marked(data);
                });
        }
        let vname = "undefined";
        getVersions(id).then((data) => {
            document.getElementById("list").innerHTML = "";
            data.forEach((version) => {
                if (
                    version.name != vname &&
                    version.loaders.includes(software) &&
                    version.game_versions.includes(sVersion)
                ) {
                    vname = version.name;
                    console.log(version.name + vname);
                    new ModpackVersion({
                        target: document.getElementById("list"),
                        props: {
                            name: version.name,
                            date: version.date_published,
                            type: version.version_type,
                            url: version.files[0].url,
                            modpackId: id,
                            versionId: version.id,
                        },
                    });
                }
            });

            if (document.getElementById("list").innerHTML == "") {
                document.getElementById("list").innerHTML =
                    "<p class='text-center'>This modpack doesn't support your selected Minecraft version currently.</p>";
            }
        });
    }
</script>

<label
    for="versions"
    on:click={get}
    class="btn btn-circle btn-ghost absolute right-0"><Plus /></label
>

<!-- Put this part before </body> tag -->
<input type="checkbox" id="versions" class="modal-toggle" />
<div class="modal flex flex-col justify-center">
    <div class="modal-box w-[97%] h-[97%] max-w-5xl space-y-5">
        <div class="pt-6">
            <!-- Plugin Result cannot be imported due to a bug where it always says 'Simple Voice Chat'-->
            <div class="bg-base-200 rounded-lg p-3">
                <div
                    class="flex justify-between place-items-center max-w-full relative"
                >
                    <div class="flex space-x-3 flex-shrink-0 w-minus-7">
                        <a
                            href="https://modrinth.com/plugin/{id}"
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
                                    href="https://modrinth.com/plugin/{id}"
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
                    </div>
                </div>
            </div>

            <div
                class="flex max-md:flex-col-reverse justify-between gap-2 lg:gap-5 mt-5"
            >
                <div class="">
                    <h3 class="font-bold text-2xl mb-4">{$t("description")}</h3>
                    <article
                        id="body"
                        class="mb-5 prose bg-base-200 rounded-lg p-3"
                    />
                </div>

                <div class="">
                    <h3 class="font-bold text-2xl mb-4">{$t("versions")}</h3>
                    <div id="list" class="space-y-2 mb-5" />
                </div>
            </div>
        </div>

        <div class="modal-action">
            <label
                for="versions"
                class="btn btn-sm btn-circle absolute right-2 top-2 mb-5"
                >✕</label
            >
        </div>
    </div>
</div>
