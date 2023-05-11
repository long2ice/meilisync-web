<template>
  <section class="flex h-full items-center p-16">
    <div class="container mx-auto my-8 flex flex-col items-center justify-center px-5">
      <div class="max-w-md text-center">
        <h2 class="mb-8 text-9xl font-extrabold"><span class="sr-only">Error</span>404</h2>
        <p class="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
        <p class="mb-8 mt-4">
          But don't worry, you can find plenty of other things on our homepage.
        </p>
        <router-link to="/" class="rounded px-8 py-3 font-semibold">
          <button class="btn">Back to homepage</button>
        </router-link>
      </div>
    </div>
  </section>
</template>
