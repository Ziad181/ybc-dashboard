<script setup>
import { getAssetUploadedFilesPath } from "@/helpers/assets";
import i18n from "@/plugins/i18n";
import { usePageContentStore } from "@/stores/pageContent";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n(); //
const router = useRouter();
const route = useRoute();
const store = usePageContentStore();
const refInputEl = ref();
const refVForm = ref();

const formData = ref({
  id: route.params.id,
  section_name_ar: "",
  section_name_en: "",
  description_ar: "",
  description_en: "",
  can_change_slug: false,
});


const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      var data = {
        id: formData.value.id,
        section_name_ar: formData.value.section_name_ar,
        section_name_en: formData.value.section_name_en,
        description_ar: formData.value.description_ar,
        description_en: formData.value.description_en,
        can_change_slug: formData.value.can_change_slug,
      };
      store.updatePageContent(data).then((res) => {
        router.push({
          name: "about-us-business-support-center",
        });
      });
    }
  });
};

onMounted(() => {
  store.loadPageContentDetails(route.params.id).then(() => {
    formData.value.section_name_ar =
      store.getPageContentDetails.section_name_ar;
    formData.value.section_name_en =
      store.getPageContentDetails.section_name_en;
    formData.value.description_ar = store.getPageContentDetails.description_ar;
    formData.value.description_en = store.getPageContentDetails.description_en;
  });
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pt-0">
          <div class="d-flex align-center py-5">
            <VBtn
              :class="i18n.global.locale.value == 'en' ? 'mr-3' : 'ml-3'"
              variant="outlined"
              :icon="
                i18n.global.locale.value == 'en'
                  ? 'tabler-arrow-left'
                  : 'tabler-arrow-right'
              "
              onclick="window.history.back()"
              size="small"
            >
            </VBtn>
            <h4 class="text-h6 font-weight-bold">
              {{ $t("common.edit_content") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
              <VCol md="12" cols="12">
                <VTextField
                  v-model="formData.section_name_ar"
                  :label="$t('common.section_name')"
                  disabled
                />
              </VCol>

              <VCol cols="12">
                <label>{{ $t("common.description_ar") }}</label>
                <div class="texteditor" dir="ltr">
                  <QuillEditor
                    v-model:content="formData.description_ar"
                    theme="snow"
                    toolbar="full"
                    contentType="html"
                    name="description_ar"
                    :placeholder="$t('common.description_ar')"
                  />
                </div>
              </VCol>
              <VCol cols="12">
                <label>{{ $t("common.description_en") }}</label>
                <div class="texteditor" dir="ltr">
                  <QuillEditor
                    v-model:content="formData.description_en"
                    theme="snow"
                    toolbar="full"
                    contentType="html"
                    name="description_en"
                    :placeholder="$t('common.description_en')"
                  />
                </div>
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'about-us-business-support-center' }"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
