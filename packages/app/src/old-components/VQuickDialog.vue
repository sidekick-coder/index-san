<script setup lang="ts">
import { dialogItems } from '../composables/useQuickDialog'
</script>

<template>
    <v-dialog v-for="d in dialogItems" :key="d.id" :model-value="d.show">
        <div>
            {{ d.title }}
        </div>
    </v-dialog>
</template>
