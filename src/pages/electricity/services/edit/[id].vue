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
const images = ref([]);

const formData = ref({
  id: route.params.id,
  section_name_ar: "",
  section_name_en: "",
  description_ar: "",
  description_en: "",
  can_change_slug: true,
  images: [],
});

const loadImages = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    images.value.push(...files);
  }
};

const removeImageByIndex = (index) => {
  images.value = Array.from(images.value);
  images.value.splice(index, 1);
  formData.value.images = images.value;
};
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
        image:
          images.value && images.value.length > 0
            ? images.value.filter((image) => typeof image != "string")
            : [],
        old_images:
          images.value && images.value.length > 0
            ? images.value.filter((image) => typeof image === "string")
            : [],
      };
      store.updatePageContent(data).then((res) => {
        router.push({
          name: "electricity-services",
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
    images.value = sstore.getPageContentDetails.image ?? [];
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
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.section_name_ar"
                  :label="$t('common.name_ar')"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.section_name_en"
                  :label="$t('common.name_en')"
                />
              </VCol>
              <VCol cols="12" md="12">
                <VRow class="my-2 p-0" v-if="images && images.length > 0">
                  <VCol
                    md="2"
                    v-for="(image, index) in images"
                    :key="index"
                    class="position-relative"
                  >
                    <VImg
                      style="width: 100%; height: 80px; border-radius: 8px"
                      :src="getAssetUploadedFilesPath(image)"
                    />
                    <VBtn
                      color="error"
                      icon="tabler-trash"
                      @click="removeImageByIndex(index)"
                      class="remove-image"
                    />
                  </VCol>
                </VRow>
                <VFileInput
                  accept="image/*"
                  chips
                  multiple
                  :label="$t('common.images')"
                  v-model="formData.images"
                  @change="loadImages"
                  class="hide-input"
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
                  :to="{ name: 'electricity-services' }"
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
