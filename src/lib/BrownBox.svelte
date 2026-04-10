<script>
    let { children, width, height } = $props();
</script>

<div class="center">
    <div class="brown-box" style="width: {width}vh; height: {height}vh">
        {@render children()}
    </div>
</div>

<!-- ty colon for the css styling I may or may not have gotten off gd browser with inspect element -->
<style>
    .brown-box {
        border-width: 2.5vh;
        border-style: solid;
        border-radius: 3vh;
        background-color: #995533;
        border-image: url("$lib/assets/GJ_square01.png") 10% round;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: center;
    }
</style>