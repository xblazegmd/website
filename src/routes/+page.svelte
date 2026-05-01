<script lang="ts">
    import BrownBox from "$lib/BrownBox.svelte";
    import BlueBG from "$lib/BlueBG.svelte";
    import Corners from "$lib/Corners.svelte"
    import Popup from "$lib/Popup.svelte";

    const possibleCaptions = [
        "It's cooking...",
        "Have you heard about patience?",
        "No website for you",
        "Wonderful",
        "God bless you <3",
        "I can't think of any good captions",
        "Website releases in ...?",
        "New daily in 00:00:00",
        "2.3 when",
        "Who is more lazy, Xblaze or RobTop?",
        "Vortrox",
        "Kingsammelot",
        "EVW",
        "sixSevcon",
        "meow :3",
        "woof",
        "Do you have a life?",
        "I guessed so...",
        "Annie are you ok? So, Annie are you ok? Are you ok Annie?",
        "GET OUT OF MY HEAD",
        "STOP PRESSURIN' ME",
        "REMEMBER",
        "It is done",
        "sike",
        "*insert caption here*",
        "I can do all things through Christ who strengthens me",
        "Made in Colombia™",
        "SevChipz confirmed??????",
        "Hatsune Mintku ftw",
        "Sevconae Teto",
        "If it doesn't look like a duck, and it doesn't sound like a duck, it's prolly not a duck"
    ];

    let caption = possibleCaptions[Math.floor(Math.random() * possibleCaptions.length)];

    let showPopup = $state(false);
</script>

<svelte:head>
    <title>Goodbye...</title>
</svelte:head>

<BlueBG>
    <Popup width=69 height=40 bind:flag={showPopup}>
        <p>Cuz it turns out, you need to be <span class="co">16 years old</span> to use <a href="https://vercel.io" target="_blank">Vercel</a>, which is what I used to host this website (and <span class="cy">I'm 14</span>)</p>
        <p>Now cuz of this I am switching to using <a href="https://netlify.com" target="_blank">Netlify</a> instead cuz at least for that you need to be <span class="cg">13 years old</span> to use it</p>
        <p>So yeah, the website's now gonna be hosted on <a href="https://xblaze.netlify.app" target="_blank">xblaze.netlify.app</a> for now and all other links will redirect to it until it inevitably <span class="cr">shuts down</span></p>
        <p>Thank you for understanding :3</p> <!-- yes this line was an excuse to use ':3' cuz I like it and no that doesn't make me a furry -->

        <button id="ok-btn" onclick={() => {showPopup = false}}>OK</button>
    </Popup>

    <Corners />
    <BrownBox width=50 height=30>
        <div class="title">
            <h2>Not Coming Soon...</h2>
            <h3>(at least here)</h3>
        </div>

        <!-- svelte-ignore a11y_invalid_attribute -->
        <a id="why" href="javascript:void(0)" onclick={(e) => {
            e.preventDefault();
            showPopup = true;
        }}>Why?</a>

        <p>{caption}</p>
    </BrownBox>
</BlueBG>

<style>
    .title {
        display: flex;
        flex-direction: column;
        margin-bottom: 5px;
    }

    .title > * {
        margin: 3px;
    }

    #why {
        font-size: 1rem;
        margin-bottom: 3px;
    }

    #ok-btn {
        margin-top: 20px;
    }
</style>