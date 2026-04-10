<script>
    import GJ_sideArt from "$lib/assets/GJ_sideArt.png";
</script>

<div>
    <img class="corner top-left" src={GJ_sideArt} alt="sideArt" />
    <img class="corner top-right" src={GJ_sideArt} alt="sideArt" />
    <img class="corner bottom-left" src={GJ_sideArt} alt="sideArt" />
    <img class="corner bottom-right" src={GJ_sideArt} alt="sideArt" />
</div>

<style>
    .corner {
        width: 140px;
    }

    .top-left {
        position: fixed;
        top: 0;
        left: 0;
        transform: scaleY(-1);
    }

    .top-right {
        position: fixed;
        top: 0;
        right: 0;
        transform: scale(-1, -1);
    }

    .bottom-left {
        position: fixed;
        bottom: 0;
        left: 0;
    }

    .bottom-right {
        position: fixed;
        bottom: 0;
        right: 0;
        transform: scaleX(-1);
    }

    @media (max-width: 768px) {
        .corner {
            width: 110px;
        }
    }
</style>