<script setup>
import { usePartnersStore } from "@/stores/partners";
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
const store = usePartnersStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);

const formData = ref({
  id: route.params.id,
  name_ar: "",
  name_en: "",
  url: "",
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
        name_ar: formData.value.name_ar,
        name_en: formData.value.name_en,
        url: formData.value.url,
        logo: images.value && images.value.length > 0 ? images.value[0] : [],
      };
      store.updatePartner(data).then((res) => {
        router.push({
          name: "partners",
        });
      });
    }
  });
};

onMounted(() => {
  store.loadPartnerDetails(route.params.id).then(() => {
    formData.value.name_ar = store.getPartnerDetails.name_ar;
    formData.value.name_en = store.getPartnerDetails.name_en;
    formData.value.url = store.getPartnerDetails.url;
    images.value = store.getPartnerDetails.logo
      ? [store.getPartnerDetails.logo]
      : [];
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
              {{ $t("common.edit_partner") }}
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
                  :label="$t('common.images')"
                  v-model="formData.images"
                  @change="loadImages"
                  class="hide-input"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.name_ar"
                  :label="$t('common.name_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.name_en"
                  :label="$t('common.name_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.url"
                  :label="
                    $t('common.url') + ' ' + '( ' + $t('common.Optional') + ' )'
                  "
                  :rules="[urlValidator]"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn
                  type="submit"
                  :disabled="!formData.images.length && !images.length"
                  >{{ $t("common.save") }}</VBtn
                >

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'partners' }"
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
