<script setup lang="ts">
import IsSidebar from './components/is-sidebar.vue'
import WLayout from 'vue-wind/components/w-layout/w-layout.vue'
import WContent from 'vue-wind/components/w-content/w-content.vue'

</script>
<template>
  <w-layout>
    <is-sidebar />

    <w-content class="bg-zinc-900 text-white">
      <div class="h-full w-full flex items-center justify-center">
        <router-view></router-view>
      </div>
    </w-content>
  </w-layout>
</template>