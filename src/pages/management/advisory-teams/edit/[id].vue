<script setup>
import { useAdvisoryTeamsStore } from "@/stores/advisoryTeams";
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
const store = useAdvisoryTeamsStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);

const formData = ref({
  id: route.params.id,
  type: "executive_management",
  name_en: "",
  name_ar: "",
  job_ar: "",
  job_en: "",
  description_ar: "",
  description_en: "",
  images: [],
  facebook_link: "",
  instagram_link: "",
  linkedin_link: "",
});
const loadImages = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    images.value = [];
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
        type: formData.value.type,
        name_en: formData.value.name_en,
        name_ar: formData.value.name_ar,
        job_ar: formData.value.job_ar,
        job_en: formData.value.job_en,
        description_ar: formData.value.description_ar,
        description_en: formData.value.description_en,
        image: images.value && images.value.length > 0 ? images.value[0] : null,
        facebook_link: formData.value.facebook_link,
        instagram_link: formData.value.instagram_link,
        linkedin_link: formData.value.linkedin_link,
      };
      store.updateEmployee(data).then((res) => {
        router.push({
          name: "management-advisory-teams",
        });
      });
    }
  });
};

onMounted(() => {
  store.loadEmployeeDetails(route.params.id).then(() => {
    formData.value.type = store.getEmployeeDetails.type;
    formData.value.name_ar = store.getEmployeeDetails.name_ar;
    formData.value.name_en = store.getEmployeeDetails.name_en;
    formData.value.job_ar = store.getEmployeeDetails.job_ar;
    formData.value.job_en = store.getEmployeeDetails.job_en;
    formData.value.description_ar = store.getEmployeeDetails.description_ar;
    formData.value.description_en = store.getEmployeeDetails.description_en;
    images.value = store.getEmployeeDetails.image
      ? [store.getEmployeeDetails.image]
      : [];
    formData.value.facebook_link = store.getEmployeeDetails.facebook_link;
    formData.value.instagram_link = store.getEmployeeDetails.instagram_link;
    formData.value.linkedin_link = store.getEmployeeDetails.linkedin_link;
  });
});
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <VCardText class="pt-0">
          <div class="d-flex align-center py-5">
            <VBtn :class="i18n.global.locale.value == 'en' ? 'mr-3' : 'ml-3'" variant="outlined" :icon="i18n.global.locale.value == 'en'
                ? 'tabler-arrow-left'
                : 'tabler-arrow-right'
              " onclick="window.history.back()" size="small">
            </VBtn>
            <h4 class="text-h6 font-weight-bold">
              {{ $t("common.edit_consultant") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
              <VCol cols="12" md="12">
                <VRow class="my-2 p-0" v-if="images && images.length > 0">
                  <VCol md="2" v-for="(image, index) in images" :key="index" class="position-relative">
                    <VImg style="width: 100%; height: 80px; border-radius: 8px"
                      :src="getAssetUploadedFilesPath(image)" />
                    <VBtn color="error" icon="tabler-trash" @click="removeImageByIndex(index)" class="remove-image" />
                  </VCol>
                </VRow>
                <VFileInput accept="image/*" :label="$t('common.image')" v-model="formData.images" @change="loadImages"
                  class="hide-input" />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField v-model="formData.name_ar" :label="$t('common.name_ar')" :rules="[requiredValidator]" />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField v-model="formData.name_en" :label="$t('common.name_en')" :rules="[requiredValidator]" />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField v-model="formData.job_ar" :label="$t('common.job_ar')" :rules="[requiredValidator]" />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField v-model="formData.job_en" :label="$t('common.job_en')" :rules="[requiredValidator]" />
              </VCol>
              <VCol md="3" cols="12">
                <VSelect v-model="formData.type" :items="[
                  { id: 'business-support-center', name: $t('common.business-support-center') },
                  { id: 'yemeni-institute-for-managers', name: $t('common.yemeni-institute-for-managers') }
                ]" item-title="name" item-value="id" clear-icon="tabler-x" :label="$t('common.The center')"
                  :rules="[requiredValidator]" />
              </VCol>
              <VCol md="3" cols="12">
                <VTextField v-model="formData.facebook_link" :label="$t('common.facebook_link')"
                  :rules="[urlValidator]" />
              </VCol>
              <VCol md="3" cols="12">
                <VTextField v-model="formData.instagram_link" :label="$t('common.instagram_link')"
                  :rules="[urlValidator]" />
              </VCol>
              <VCol md="3" cols="12">
                <VTextField v-model="formData.linkedin_link" :label="$t('common.linkedin_link')"
                  :rules="[urlValidator]" />
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit" :disabled="!formData.images.length && !images.length">{{ $t("common.save") }}</VBtn>

                <VBtn color="secondary" variant="tonal" type="reset" :to="{ name: 'management-advisory-teams' }">
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
