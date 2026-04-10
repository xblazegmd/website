<script lang="ts">
    import BrownBox from "$lib/BrownBox.svelte";
    import BlueBG from "$lib/BlueBG.svelte";
    import Corners from "$lib/Corners.svelte";

    import { page } from "$app/state";
    import { SvelteURL } from "svelte/reactivity";
    import { goto } from "$app/navigation";
    import { resolve } from "$app/paths";

    let { data, form } = $props();

    let badgeTier = $state("");

    const tier = page.url.searchParams.get("tier");
    if (tier != null) {
        badgeTier = tier;
    }

    function patreonOAuth() {
        let url = new SvelteURL("https://www.patreon.com/oauth2/authorize");
        url.search = new URLSearchParams({
            response_type: "code",
            client_id: "UWwo4hBdOLdsP5835k_rYZD3rl3JYOiKYXUYM4OFm9L7RVmEGiZV1whiDvxRB93r",
            redirect_uri: "https://xblazegmd.vercel.app/patreon/link/callback",
            scopes: "identity.memberships"
        }).toString();

        window.open(url.href);
    }

    function cancel() {
        goto(resolve("/patreon/link/cancel"), {});
    }
</script>

<svelte:head>
    <title>Link Patreon Account</title>
</svelte:head>

<BlueBG>
    <Corners />
    {#if form?.success}
        <!-- Linked Patreon and GD -->
        <BrownBox width=60 height=35>
            <h2>All done!</h2>
            <p>Now open up <span class="cj">Geometry Dash</span>, load your profile, and your <span class="cy">badge</span> should be there!</p>
            <p>Make sure <span class="cg">"Xblaze's Geode API"</span> is installed</p>
        </BrownBox>
    {:else if data?.linkedPatreon}
        <!-- Linked Patreon, log into GD -->
        <BrownBox width=100 height=60>
            <h2 class="log-in-label">Log In</h2>

            <form method="POST" class="login-form">
                <label class="login-form-item">
                    Username:
                    <input name="username" type="text" class="gd-input" autocomplete="off" required />
                </label>
                <label class="login-form-item">
                    Password
                    <input name="password" type="password" class="gd-input" autocomplete="off" required />
                </label>

                {#if form?.error}
                    <p class="cr">{form.error}</p>
                {:else}
                    <p>
                        Your <span class="cl">Geometry Dash</span> password will not be stored <span class="cy">ANYWHERE</span>, both <br />
                        <span class="cg">locally</span> and <span class="cj">server side</span>
                    </p>
                {/if}

                <div class="button-container">
                    <button type="button" onclick={cancel} class="red-btn">Cancel</button>
                    <button type="submit">Submit</button>
                </div>
            </form>
        </BrownBox>
    {:else}
        <!-- Link Patreon -->
        <BrownBox width=70 height=50>
            <h2>Thank you for supporting me!</h2>
            <div class="desc-container">
                <p>As a sign of <span class="cg">appreciation</span>, you will earn a <span class="cy">{badgeTier} badge</span> in-game showing that YOU are a <span class="cj">supporter</span>!</p>
                <p>Please link your <span class="co">Patreon account</span> with your <span class="cl">Geometry Dash account</span> in order to recieve the <span class="cy">badge</span></p>
            </div>

            <button onclick={patreonOAuth}>Link Patreon</button>
        </BrownBox>
    {/if}
</BlueBG>

<style>
    .login-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .login-form-item {
        display: flex;
        flex-direction: column;
        text-align: left;
    }

    .button-container {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        text-align: center;
        gap: 30px;
    }

    .log-in-label {
        margin-top: 0;
        margin-bottom: 20px;
    }

    .desc-container {
        margin-bottom: 20px;
    }
</style>