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

    let progress = 0;
    let max = 1779;

    let showCurrencyPopup = $state(false);
    let showActivityPopup = $state(false);

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

    const activity: [number, string, string, string][] = [
        [0, "25/04/26", "Made this page", "+25"],
        [1, "12/05/26", "My dad took my money away 😭", "-25"]
    ];

    function deficitOrSurplus(change: string) {
        if (change.startsWith("+")) {
            return "cg";
        } else if (change.startsWith("-")) {
            return "cr";
        } else {
            return "cx";
        }
    }
</script>

<svelte:head>
    <title>Get This Poor Crab a PC 🥺</title>
</svelte:head>

<BlueBG>
    <Popup width=69 height=40 bind:flag={showCurrencyPopup}>
        {#if loaded}
            <img src={otherCurrencies} alt="Other Currencies" class="other-currencies-title" />

            <div class="currencies-container">
                <p>COP: <span class="cy">${convert("COP", progress)}</span> / <span class="cj">${convert("COP", max)}</span></p>
                <p>EUR: <span class="cy">€{convert("EUR", progress)}</span> / <span class="cj">€{convert("EUR", max)}</span></p>
                <p>GBP: <span class="cy">£{convert("GBP", progress)}</span> / <span class="cj">£{convert("GBP", max)}</span></p>
                <p>MXN: <span class="cy">${convert("MXN", progress)}</span> / <span class="cj">${convert("MXN", max)}</span></p>
                <p>RUB: <span class="cy">₽{convert("RUB", progress)}</span> / <span class="cj">₽{convert("RUB", max)}</span></p>
            </div>

            <button onclick={() => {showCurrencyPopup = false}}>OK</button>
        {:else}
            <Loading size=50 />
            <p>If you see this then the currency rates are either taking ages to load, or they failed to load /Xblaze</p>
        {/if}
    </Popup>

    <Popup width=69 height=40 bind:flag={showActivityPopup}>
        <table>
            <thead>
                <tr>
                    <th><span class="cj">Date (dd/mm/yy)</span></th>
                    <th><span class="cj">Note</span></th>
                    <th><span class="cj">Change</span></th>
                </tr>
            </thead>
            <tbody>
                {#each activity as update (update[0])}
                    <tr>
                        <td><span class="cy">{update[1]}</span></td>
                        <td>{update[2]}</td>
                        <td><span class={deficitOrSurplus(update[3])}>{update[3]}</span></td>
                    </tr>
                {/each}
            </tbody>
        </table>
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
            <a href="javascript:void(0)" onclick={(e) => {
                e.preventDefault();
                showCurrencyPopup = true;
            }}>Other currencies</a>
            <a href="javascript:void(0)" onclick={(e) => {
                e.preventDefault();
                showActivityPopup = true;
            }}>Activity logs</a>
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