<script setup>
import Loading from "vue3-loading-overlay";
import "vue3-loading-overlay/dist/vue3-loading-overlay.css";
import { useAppsStore } from "@/stores/app";

const store = useAppsStore();
</script>

<template>
  <div class="loading-page">
    <Loading
      :active="store.getloading"
      :can-cancel="false"
      :is-full-page="true"
      :color="'#1F1F1F'"
    />
  </div>
</template>
