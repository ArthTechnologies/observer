<script lang="ts">
    import SignedOutNav from "$lib/components/layout/SignedOutNav.svelte";



</script>

<div>
  <SignedOutNav />
  <slot />
  <div class="hero min-h-screen">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">404 Not Found</h1>
        <p class="py-6">
          This page doesn't exist! If you think this is an error, open an issue
          at <a
            href="https://codeberg.org/diamonc/observer/issues/new"
            class="link link-primary">codeberg.</a
          >
        </p>
        <button class="btn btn-primary"
          ><a href="/">Go back to Servers</a></button
        >
      </div>
    </div>
  </div>

</div>
