<template>
  <w-layout>
    <is-left-bar />

    <w-content>
      <w-layout use-percentage>
        <is-toolbar :layout-ignore="['right']" />

        <w-content>
          <router-view />
        </w-content>

        <is-right-bar right layout-id="right" />
      </w-layout>
    </w-content>
  </w-layout>
</template>
