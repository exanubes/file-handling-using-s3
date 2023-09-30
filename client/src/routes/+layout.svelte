<script>
    import "../app.css";
</script>
  
<slot />

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.slate.900);
        color: theme(colors.cyan.50)
    }
</style>