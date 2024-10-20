<template>
    <is-app>
        <is-snackbar-provider />
        <is-dialog-provider />

        <suspense>
            <router-view />
        </suspense>
    </is-app>
</template>
