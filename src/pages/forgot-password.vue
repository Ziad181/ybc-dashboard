<script setup>
import authV1BottomShape from "@images/svg/auth-v1-bottom-shape.svg";
import authV1TopShape from "@images/svg/auth-v1-top-shape.svg";
import { VNodeRenderer } from "@layouts/components/VNodeRenderer";
import { themeConfig } from "@themeConfig";

const form = ref({ email: "" });
</script>

<template>
  <div class="auth-wrapper d-flex align-center justify-center pa-4">
    <div class="position-relative my-sm-16">
      <!-- 👉 Top shape -->
      <VImg :src="authV1TopShape" class="auth-v1-top-shape d-none d-sm-block" />

      <!-- 👉 Bottom shape -->
      <VImg
        :src="authV1BottomShape"
        class="auth-v1-bottom-shape d-none d-sm-block"
      />

      <!-- 👉 Auth card -->
      <VCard class="auth-card pa-4" max-width="448">
        <VCardItem class="justify-center">
          <template #prepend>
            <div class="d-flex">
              <img src="/logo.png" alt="Logo" />
            </div>
          </template>

          <!-- <VCardTitle class="font-weight-bold text-h5 py-1">
            {{ themeConfig.app.title }}
          </VCardTitle> -->
        </VCardItem>

        <VCardText class="pt-2">
          <h5 class="text-h5 font-weight-semibold mb-1">
            {{ $t("common.Forgot Password?") }} 🔒
          </h5>
          <p class="mb-0">
            {{
              $t(
                "common.Enter your email and well send you instructions to reset your password"
              )
            }}
          </p>
        </VCardText>

        <VCardText>
          <VForm @submit.prevent="() => {}">
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  v-model="form.email"
                  :label="$t('common.email')"
                  type="email"
                />
              </VCol>

              <!-- reset password -->
              <VCol cols="12">
                <VBtn block type="submit"
                  >{{ $t("common.Send Reset Link") }}
                </VBtn>
              </VCol>

              <!-- back to login -->
              <VCol cols="12">
                <RouterLink
                  class="d-flex align-center justify-center"
                  :to="{ name: 'login' }"
                >
                  <VIcon icon="tabler-chevron-left" class="flip-in-rtl" />
                  <span>{{ $t("common.Back to login") }} </span>
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </div>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
<route lang="yaml">
meta:
  layout: blank
  action: read
  subject: Auth
  redirectIfLoggedIn: true
</route>
