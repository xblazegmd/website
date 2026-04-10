<script>
    let { children } = $props();
</script>

<div class="blue-bg">
    {@render children()}
</div>

<style>
    .blue-bg {
        background-image: linear-gradient(#0065FD, #002E73);
        height: 100vh;
    }
</style>