<script setup>
import Loading from "@/layouts/components/loading.vue"
import { useProfileStore } from "@/stores/profile"
import { useThemeConfig } from "@core/composable/useThemeConfig"
import { hexToRgb } from "@layouts/utils"
import { onMounted } from "vue"
import { useCookies } from "vue3-cookies"
import { useTheme } from "vuetify"

const { cookies } = useCookies()

const store = useProfileStore()

const {
  syncInitialLoaderTheme,
  syncVuetifyThemeWithTheme: syncConfigThemeWithVuetifyTheme,
  isAppRtl,
} = useThemeConfig()

const { global } = useTheme()

const loginData = cookies.get("yBCLoginData", {
  parseJSON: true,
})

onMounted(() => {
  if (loginData) {
    store.loadUserInfo()
  }
})

// ℹ️ Sync current theme with initial loader theme
syncInitialLoaderTheme()
syncConfigThemeWithVuetifyTheme()
</script>

<template>
  <Loading />
  <VLocaleProvider :rtl="isAppRtl">
    <!-- ℹ️ This is required to set the background color of active nav link based on currently active global theme's primary -->
    <VApp
      :style="`--v-global-theme-primary: ${hexToRgb(
        global.current.value.colors.primary
      )}`"
    >
      <RouterView v-if="!loginData || store.getUserInfo" />
    </VApp>
  </VLocaleProvider>
</template>
