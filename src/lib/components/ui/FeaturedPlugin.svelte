<script lang="ts">
    import { getVersions, sendVersion } from "$lib/scripts/req";

    import { browser } from "$app/environment";
    import Helper from "./Helper.svelte";
    import { t } from "$lib/scripts/i18n";
    export let name: string;
    export let author: string;
    export let desc: string;
    export let icon: string;
    export let disclaimer: string;
    export let link: string;
    export let authorLink: string;
    export let nameLink: string;

    function get() {
        getVersions(id).then((data) => {
            console.log(data);
        });
    }
    let software = "";
    let version = "";
    if (browser) {
        software = localStorage.getItem("serverSoftware");
        version = localStorage.getItem("serverVersion");
    }

    function submit() {
        let id = "";
        if (browser) {
            id = localStorage.getItem("serverID");
        }
        sendVersion(link, id);
    }
</script>

<div class="bg-base-200 rounded-lg p-3">
    <div class="flex justify-between place-items-center">
        <div class="flex space-x-3">
            <a href={nameLink} target="_blank">
                <img
                    src={icon}
                    alt="noicon"
                    class="w-14 h-14 bg-base-300 rounded-lg text-sm"
                /></a
            >
            <div>
                <div class="flex space-x-1">
                    <a
                        href={nameLink}
                        target="_blank"
                        class="flex link link-hover text-xl font-bold"
                        >{name}
                    </a>
                    <div class="flex space-x-1 place-items-end">
                        <p>{$t("by")}</p>
                        <a
                            href={authorLink}
                            target="_blank"
                            class="flex link link-hover"
                            >{author}
                        </a>
                        {#if disclaimer != ""}
                            <div
                                class="tooltip  tooltip-right"
                                data-tip={disclaimer}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    class="feather feather-info ml-1"
                                    ><circle cx="12" cy="12" r="10" /><line
                                        x1="12"
                                        y1="16"
                                        x2="12"
                                        y2="12"
                                    /><line
                                        x1="12"
                                        y1="8"
                                        x2="12.01"
                                        y2="8"
                                    /></svg
                                >
                            </div>
                        {/if}
                    </div>
                </div>
                <p>{desc}</p>
            </div>
        </div>
        <label
            on:click={submit}
            class="btn btn-circle btn-ghost swap swap-rotate"
        >
            <input type="checkbox" /><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-plus swap-off"
                ><line x1="12" y1="5" x2="12" y2="19" /><line
                    x1="5"
                    y1="12"
                    x2="19"
                    y2="12"
                /></svg
            ><svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="feather feather-check swap-on"
                ><polyline points="20 6 9 17 4 12" /></svg
            ></label
        >
    </div>
</div>
