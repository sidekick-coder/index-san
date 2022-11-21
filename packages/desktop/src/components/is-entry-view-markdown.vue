<script setup lang="ts">
import { useDirectoryEntry } from '@/composables/directory-entry'
import { useState } from '@/composables/state'
import { ref } from 'vue'

const props = defineProps({
    workspaceId: {
        type: String,
        required: true,
    },
    path: {
        type: String,
        required: true,
    },
})

const repository = useDirectoryEntry(props.workspaceId)
const root = ref<HTMLTextAreaElement>()
const previewRef = ref<HTMLTextAreaElement>()

const decoder = new TextDecoder('utf-8')

const content = ref('')
const edit = useState('app:markdown:preview', false, {
    localStorage: true
})
const loading = ref(false)
const previewHeight = ref(100)

async function load(){    
    const contentBuffer = await repository.read(props.path)    
    
    content.value = decoder.decode(contentBuffer)
}

async function setPreview(){
    loading.value = true

    setTimeout(() => loading.value = false, 500)
}

load()

async function save() {

    if (previewRef.value) {
        previewHeight.value  = previewRef.value.clientHeight
    }

    await repository.write(props.path, content.value)

    setPreview()
}


</script>
<template>
    <w-layout use-percentage>  
        <w-toolbar class="border-b border-zinc-700">
            <is-container class="-mr-3 flex justify-end w-full">
                
                <template v-if="edit">
                    <is-btn size="sm" class="mr-2" text @click="setPreview" >
                        <is-icon name="arrows-rotate" class="mr-2" />
                        {{ $t('reload') }}
                    </is-btn>
                    
                    <is-btn size="sm" class="mr-2" text @click="save" >
                        <is-icon name="save" class="mr-2" />
                        {{ $t('save') }}
                    </is-btn>
                </template>               
                <is-btn size="sm" @click="edit = !edit" text>
                    <is-icon :name="!edit ? 'pen' : 'eye' " class="mr-2" />
                    {{ !edit ? $t('editMode') : $t('viewMode') }}
                </is-btn>
            </is-container>
        </w-toolbar>

        <w-content>
            <div class="h-full w-full flex">
                <is-container v-show="edit" class="min-h-full w-6/12 border-r border-zinc-700 pt-5">
                    <is-textarea                        
                        ref="root"
                        v-model="content"
                        class="min-h-full w-full bg-transparent outline-none"                        
                        autofocus
                        spellcheck
                        @keydown.ctrl.s="save"
                    />
                </is-container>
        
                <div
                    ref="previewRef"
                    class="overflow-auto pt-5"
                    :class="edit ? 'w-6/12' : 'w-full'"
                    :style="`min-height: ${previewHeight}px`"
                >
                <is-container>
                    <is-markdown  class="w-full pb-32" v-if="!loading && content" :content="content" />
                </is-container>
                    
        
                </div>
            </div>          
        </w-content>

        
    </w-layout>
</template>