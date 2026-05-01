<script lang="ts">
    import BrownBox from "$lib/BrownBox.svelte";
    import BlueBG from "$lib/BlueBG.svelte";
    import Corners from "$lib/Corners.svelte"

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
</script>

<svelte:head>
    <title>XblazeGMD</title>
</svelte:head>

<BlueBG>
    <Corners />
    <BrownBox width=50 height=30>
        <h1>Not Coming :(</h1>
        <p>{caption}</p>
    </BrownBox>
</BlueBG>