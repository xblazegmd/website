<script lang="ts">
    import BlueBG from "$lib/BlueBG.svelte";
    import Corners from "$lib/Corners.svelte";
    import BrownBox from "$lib/BrownBox.svelte";
    import ProgressBar from "$lib/ProgressBar.svelte";
    import Popup from "$lib/Popup.svelte";
    import Loading from "$lib/Loading.svelte";

    import otherCurrencies from "$lib/assets/Other Currencies.png";
    import crab from "$lib/assets/crab.png";

    import { onMount } from "svelte";

    let progress = 25;
    let max = 1748;

    let showPopup = $state(false);

    let rates: Record<string, number> = {};
    let loaded = $state(false);

    onMount(async () => {
        const res = await fetch("https://api.frankfurter.dev/v2/rates?base=USD&quotes=COP,EUR,GBP,RUB,MXN");
        if (res.ok) {
            const data = await res.json();

            for (const currency of data) {
                rates[currency.quote] = currency.rate;
            }
            loaded = true;
        }
    })

    function convert(currency: string, value: number): string {
        const converted = Math.round(value * rates[currency]);
        return new Intl.NumberFormat("en-US").format(converted);
    }
</script>


<BlueBG>
    <Popup width=69 height=40 bind:flag={showPopup}>
        {#if loaded}
            <img src={otherCurrencies} alt="Other Currencies" class="other-currencies-title" />

            <div class="currencies-container">
                <p>COP: <span class="cy">${convert("COP", progress)}</span> / <span class="cj">${convert("COP", max)}</span></p>
                <p>EUR: <span class="cy">€{convert("EUR", progress)}</span> / <span class="cj">€{convert("EUR", max)}</span></p>
                <p>GBP: <span class="cy">£{convert("GBP", progress)}</span> / <span class="cj">£{convert("GBP", max)}</span></p>
                <p>MXN: <span class="cy">${convert("MXN", progress)}</span> / <span class="cj">${convert("MXN", max)}</span></p>
                <p>RUB: <span class="cy">₽{convert("RUB", progress)}</span> / <span class="cj">₽{convert("RUB", max)}</span></p>
            </div>

            <button onclick={() => {showPopup = false}}>OK</button>
        {:else}
            <Loading size=50 />
            <p>If you see this then the currency rates are either taking ages to load, or they failed to load /Xblaze</p>
        {/if}
    </Popup>

    <Corners />
    <BrownBox width=90 height=50>
        <img src={crab} alt="carb" class="crab">
        <h2>Get This Poor Crab a PC</h2>

        <ProgressBar progress={progress} max={max} />
        <p> <span class="cy">${progress}</span>  / ${max}</p>

        <p>This page shows the <span class="cg">amount of money</span> I have <span class="cy">collected</span> so far<br />to <span class="cj">get me a PC</span></p>
        <p>You can help me in this journey by <a href="https://patreon.com">joining my Patreon</a></p>

        <!-- svelte-ignore a11y_invalid_attribute -->
        <p class="currency">
            The following values are displayed in USD. To view<br />
            other currencies click <a href="javascript:void(0)" onclick={(e) => {
                e.preventDefault();
                showPopup = true;
            }}>here</a>
        </p>
    </BrownBox>
</BlueBG>

<style>
    .crab {
        position: absolute;
        top: 0;
        left: 0;
        margin-top: 20px;
        margin-left: 5px;
        width: 120px;
        rotate: -5deg;
    }

    .currency {
        font-size: 1rem;
        position: absolute;
        color: rgb(153, 153, 153);
        opacity: 60%;
        bottom: 0;
    }

    .other-currencies-title {
        position: absolute;
        top: 0;
        margin-top: 20px;
        width: 400px;
    }

    .currencies-container {
        margin-top: 50px;
        margin-bottom: 20px;
    }

    @media (max-width: 648px) {
        .crab {
            width: 100px;
            margin-top: 0;
        }
    }
</style>