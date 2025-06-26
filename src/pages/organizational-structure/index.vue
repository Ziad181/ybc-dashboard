<script setup>
import { useUtilityStore } from "@/stores/utility";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useUtilityStore();

const { getSetting } = storeToRefs(store);

onMounted(() => {
  store.loadSetting().then(() => {});
});
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.organizational-structure')">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <VCol
                cols="12"
                sm="3"
                class="d-md-flex justify-space-between ps-0 ms-auto"
              >
                <VBtn
                  class="px-7 ms-auto"
                  :to="{ name: 'organizational-structure-edit' }"
                >
                  {{ $t("common.edit") }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>

          <VRow class="px-6">
            <VCol
              cols="12"
              md="12"
              sm="3"
              class=""
            >
            <h1 class="text-primary">{{ $t("common.organizational_structure_ar") }}</h1>
              <VImg
                v-if="getSetting?.organizational_structure_ar"
                
                :src="
                  getAssetUploadedFilesPath(
                    getSetting?.organizational_structure_ar
                  )
                "
                class="mb-4"
                style="width: 100%; height: auto"
              >
              </VImg>

            </VCol>
            <VCol
              cols="12"
              md="12"
              sm="3"
              class=""
              style="border-top: 2px solid black;"
            >

            <h1 class="text-primary">{{ $t("common.organizational_structure_en") }}</h1>
              <VImg
                v-if="getSetting?.organizational_structure_en"
                :src="
                  getAssetUploadedFilesPath(
                    getSetting?.organizational_structure_en
                  )
                "
                class="mb-4"
                  style="width: 100%; height: auto"
              >
              </VImg>

            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
