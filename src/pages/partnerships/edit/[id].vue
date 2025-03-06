<script setup>
import { usePartnershipsStore } from "@/stores/partnerships";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  alphaDashValidator,
  alphaValidator,
  betweenValidator,
  confirmedValidator,
  emailValidator,
  integerValidator,
  lengthValidator,
  passwordValidator,
  regexValidator,
  requiredValidator,
  urlValidator,
} from "@validators";
import i18n from "@/plugins/i18n";
import defaultImage from "@images/default-image.webp";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const router = useRouter();
const route = useRoute();
const store = usePartnershipsStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);

const formData = ref({
  id: route.params.id,
  title_en: "",
  title_ar: "",
  content_en: "",
  content_ar: "",
  partnership_year: "",
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
      formData.value.old_images =
        images.value && images.value.length > 0
          ? images.value.filter((image) => typeof image === "string")
          : [];
      formData.value.images =
        images.value && images.value.length > 0
          ? images.value.filter((image) => typeof image != "string")
          : [];
      store.updatePartnership(formData.value).then((res) => {
        router.push({
          name: "partnerships",
        });
      });
    }
  });
};

onMounted(() => {
  store.loadPartnershipDetails(route.params.id).then(() => {
    formData.value.title_ar = store.getPartnershipDetails.title_ar;
    formData.value.title_en = store.getPartnershipDetails.title_en;
    formData.value.content_ar = store.getPartnershipDetails.content_ar;
    formData.value.content_en = store.getPartnershipDetails.content_en;
    formData.value.partnership_year = store.getPartnershipDetails.partnership_year;
    images.value = store.getPartnershipDetails.images ?? [];
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
              {{ $t("common.edit_partnership") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
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
              <VCol md="4" cols="12">
                <VTextField
                  v-model="formData.title_ar"
                  :label="$t('common.title_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="formData.title_en"
                  :label="$t('common.title_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="formData.partnership_year"
                  :label="$t('common.partnership_year')"
                  :rules="[requiredValidator, integerValidator]"
                />
              </VCol>

     
              <VCol cols="12">
                <label>{{ $t("common.content_ar") }}</label>
                <div class="texteditor" dir="ltr">
                  <QuillEditor
                    v-model:content="formData.content_ar"
                    theme="snow"
                    toolbar="full"
                    contentType="html"
                    name="content_ar"
                    :placeholder="$t('common.content_ar')"
                  />
                </div>
              </VCol>
              <VCol cols="12">
                <label>{{ $t("common.content_en") }}</label>
                <div class="texteditor" dir="ltr">
                  <QuillEditor
                    v-model:content="formData.content_en"
                    theme="snow"
                    toolbar="full"
                    contentType="html"
                    name="content_en"
                    :placeholder="$t('common.content_en')"
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
                  :to="{ name: 'partnerships' }"
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
