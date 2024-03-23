<script lang="ts" setup>

const text = ref('')


function save(){

}

</script>

<template>
    <is-monaco-editor
        v-model="text"
        @keydown.ctrl.s="save"
    />
</template>
