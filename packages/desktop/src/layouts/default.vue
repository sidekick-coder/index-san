<template>
    <w-layout>
        <is-app-drawer />

        <w-content class="bg-zinc-900 text-white">
            <w-layout use-percentage>
                <is-app-toolbar />

                <w-content>
                    <slot></slot>
                </w-content>
            </w-layout>
        </w-content>
    </w-layout>
</template>
