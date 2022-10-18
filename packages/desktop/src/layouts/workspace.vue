<template>
    <w-layout>
        <is-sidebar />

        <w-content class="bg-zinc-900 text-white">      
            <w-layout use-percentage>
                <is-app-toolbar />

                <w-content>
                    <div class="h-full w-full px-20 overflow-auto">
                        <slot></slot>
                    </div>
                </w-content>
            </w-layout>

        </w-content>
    </w-layout>
</template>