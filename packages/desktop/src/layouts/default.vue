<template>
    <w-layout>
        <is-app-drawer />

        <w-content class="bg-b-primary text-t-primary">
            <w-layout use-percentage>
                <is-app-toolbar />

                <w-content>
                    <slot></slot>
                </w-content>
            </w-layout>
        </w-content>
    </w-layout>
</template>
