<template>
  <w-toolbar class="border-b h-[50px] flex justify-end">
    <div class="justify-self-start mr-auto">
      {{ $route.path }}
    </div>
    <button class="btn-toolbar">
      <fa-icon icon="eye" />
    </button>
    <button class="btn-toolbar">
      <fa-icon icon="folder" />
    </button>
    <button class="btn-toolbar">
      <fa-icon icon="cog" />
    </button>
  </w-toolbar>
</template>

<style>
.btn-toolbar {
  @apply h-full w-[60px] hover:bg-gray-100;
}
</style>
