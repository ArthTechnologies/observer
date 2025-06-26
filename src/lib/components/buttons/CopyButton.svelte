<script>
    import { alert } from "$lib/scripts/utils";
    import { CopyIcon } from "lucide-svelte";
    export let text = "";
</script>
<button
    class="btn btn-ghost btn-sm btn-circle"
    on:click={() => {
        navigator.clipboard.writeText(text);
        alert("Copied to clipboard", "success");
    }}
    aria-label="Copy to clipboard"
>
    <CopyIcon size=16 />
</button>