<script lang="ts" setup>
import type { DriveEntry } from '@/composables/useDrive';
import { findEntryIcon } from '@/modules/directory/composables/findEntryIcon';
import { findEntryIconColor } from '@/modules/directory/composables/findEntryIconColor';

const entry = defineProp<DriveEntry>('entry', {
    type: Object,
    required: true
})

const icon = findEntryIcon(entry.value)
const iconColor = findEntryIconColor(entry.value)

</script>

<template>
    <is-icon
        :name="icon"
        :class="iconColor"
    />
</template>
