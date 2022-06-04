import Vue from 'vue'

declare global {
  interface Window {
    vue: typeof Vue
  }
}
