<script lang="ts">
    import { Check, ChevronDown, Cross, XIcon } from "lucide-svelte";
    import { loadStripe } from "@stripe/stripe-js";
    import { EmbeddedCheckout } from "svelte-stripe";
    import { onMount } from "svelte";
    import { apiurl } from "$lib/scripts/req";
    import { browser } from "$app/environment";

    let stripe = null;
    let clientSecret = null;
    let moddedCheckoutDiv;
    let basicCheckoutDiv;

    let plan = "basic";

    onMount(async () => {
        if (browser) {
            moddedCheckoutDiv = document.getElementById("moddedCheckoutDiv");
            basicCheckoutDiv = document.getElementById("basicCheckoutDiv");
        }
        stripe = await loadStripe(
            "pk_live_51Lzn2zJYPXquzaSzOpvIIfZl98HVgKP6gLoWFgQqykAbONLIXPNn2leGhMVIhNKJ4urq9mq3OGfV97R9rYxz9n77008C2WOdrZ",
        );
        clientSecret = await fetch(apiurl + "checkout/" + plan, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                return data.clientSecret;
            });
    });

    function selectBasic() {
        document.getElementById("basicSelect").classList.remove("btn-neutral");
        document
            .getElementById("basicSelect")
            .classList.add("pointer-events-none");
        document.getElementById("basicSelect").innerHTML = "Selected";

        document.getElementById("moddedSelect").classList.add("btn-neutral");
        document
            .getElementById("moddedSelect")
            .classList.remove("pointer-events-none");
        document.getElementById("moddedSelect").innerHTML = "Select";

        //destroy the old embedded checkout
        const checkoutDiv = document.getElementById("checkoutDiv");
        checkoutDiv.innerHTML = "";
        clientSecret = null;
        new EmbeddedCheckout(
            { target: document.getElementById("checkoutDiv") },
            { stripe, clientSecret },
        );
        plan = "modded";
        clientSecret = fetch(apiurl + "checkout/" + plan, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                return data.clientSecret;
            });
    }
    function selectModded() {
        document.getElementById("moddedSelect").classList.remove("btn-neutral");
        document
            .getElementById("moddedSelect")
            .classList.add("pointer-events-none");
        document.getElementById("moddedSelect").innerHTML = "Selected";

        document.getElementById("basicSelect").classList.add("btn-neutral");
        document
            .getElementById("basicSelect")
            .classList.remove("pointer-events-none");
        document.getElementById("basicSelect").innerHTML = "Select";

        //destroy the old embedded checkout
        basicCheckoutDiv.innerHTML = "";
        clientSecret = null;
        new EmbeddedCheckout(
            { target: moddedCheckoutDiv },
            { stripe, clientSecret },
        );

        plan = "modded";
        clientSecret = fetch(apiurl + "checkout/" + plan, {
            method: "POST",
        })
            .then((res) => res.json())
            .then((data) => {
                return data.clientSecret;
            });
    }
</script>

<div class="md:flex">
    <div
        class=" md:h-screen px-16 px-[2.5rem] lg:px-[7rem] py-[4.5rem] flex flex-col max-md:place-items-center relative"
    >
        <p class="text-lg mb-4 font-bold">Pick a plan</p>

        <div class="flex mb-12">
            <div class="flex flex-col gap-2">
                Basic
                <div class="flex gap-2">
                    <p class="text-accent-content text-4xl font-bold">$4.00</p>

                    <p class="w-5 text-sm">per month</p>
                </div>
                <img
                    src="/images/basicPlan.png"
                    class="rounded-xl h-[5.75rem] w-[9.5rem]"
                />
                <button
                    class="btn btn-sm my-0.5 w-full pointer-events-none"
                    id="basicSelect"
                    on:click={selectBasic}>Selected</button
                >
                <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
                    <Check size="16" class="shrink-0" /> Built-in Geyser™ crossplay
                    between all editions
                </p>
                <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
                    <Check size="16" class="shrink-0" /> One-click worldgen mods
                    like Terralith
                </p>
                <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
                    <Check size="16" class="shrink-0" /> Thousands of plugins one
                    click away via Modrinth
                </p>
            </div>
            <div
                class="divider divider-horizontal m-0 ml-2 mr-5 h-12 mt-7"
            ></div>
            <div class="flex flex-col gap-2">
                Modded
                <div class="flex gap-2">
                    <p class="text-accent-content text-4xl font-bold">$6.00</p>

                    <p class="w-5 text-sm">per month</p>
                </div>

                <img
                    src="/images/moddedPlan.png"
                    class="rounded-xl h-[5.75rem] w-[9.5rem]"
                />
                <button
                    class="btn btn-neutral btn-sm my-0.5 w-full"
                    id="moddedSelect"
                    on:click={selectModded}>Select</button
                >
                <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
                    <Check size="16" class="shrink-0" /> Add new enemies, biomes,
                    weapons, and so much more with mods!
                </p>
                <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
                    <Check size="16" class="shrink-0" /> Turn Minecraft into a whole
                    new game with modpacks
                </p>
                <p class="flex items-center gap-2 text-[.95rem] w-[9.5rem]">
                    <Check size="16" class="shrink-0" /> Over 10,000 mods available
                    via CurseForge & Modrinth
                </p>
            </div>
        </div>

        <div>
            <!--
            <img src="/images/sitelogo.svg" width="100px" />-->
            <p>
                <!--Arth Technologies<br />-->© 2022-{new Date().getFullYear()}
                <br />
                <!---->
                <a
                    href="https://arthmc.xyz/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:link text-[.825rem]">Arth Technologies</a
                >
                <span class="text-[.825rem]">|</span>
                <a
                    href="https://arthmc.xyz/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="hover:link text-[.825rem]">Privacy Policy</a
                >
            </p>
        </div>
    </div>

    <div class="md:min-h-screen bg-[#525f7f] w-full pt-10 pb-16">
        <div id="basicCheckoutDiv">
            <EmbeddedCheckout {stripe} {clientSecret} />
        </div>
        <div id="moddedCheckoutDiv">gi</div>
    </div>
</div>

<style>
</style>
