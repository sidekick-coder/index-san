<script setup lang="ts">
import IsSidebar from './components/is-sidebar.vue'

</script>
<template>
  <w-layout>
    <is-sidebar />

    <w-content class="bg-zinc-900 text-white">      
      <router-view></router-view>      
    </w-content>
  </w-layout>
</template>