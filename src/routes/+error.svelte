<script lang="ts">
    import { page } from "$app/state";

    import BrownBox from "$lib/BrownBox.svelte";
    import BlueBG from "$lib/BlueBG.svelte";
    import Corners from "$lib/Corners.svelte";

    const possibleCaptions = [
        "Perhaps you forgot a coma?",
        "Are you lost?",
        "Player used type gibberish into search bar, it's not very effective",
        "Oops mb",
        "THIS is why 2.21's not out yet",
        "sixSevcon, sevenSevcon",
        "ERROR: 600 Skill Issue",
        "Is this a sign?",
        "sry ssev ate the servers",
        "meow :3",
        "...what was that",
        "6767676767676767",
        "5555555555555555",
        "9 + 10 = 21",
        "10 + 9 = 12",
        "10 + 10 + 9 + 10 = 85",
        "Sayodevice",
        "Is it taking a shower?",
        "YOU'VE BEEN HIT BY",
        "YOU'VE BEEN STRUCK BY",
        "A SMOOOOOOOOTH CRIMINAL",
        "The girl is bad",
        "The girl is DANGEROUS",
        "She has no idea, no idea, that I'm even here, I'm even here",
        "Could be in Brazil, could be in Cuba",
        "Could be in Colombia"
    ];

    let caption = possibleCaptions[Math.floor(Math.random() * possibleCaptions.length)];
</script>

<BlueBG>
    <Corners />
    <BrownBox width=50 height=33>
        <h1>{page.status}</h1>
        <h3>{page.error?.message}</h3>
        <p>{caption}</p>
    </BrownBox>
</BlueBG>