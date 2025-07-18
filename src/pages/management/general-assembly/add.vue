<script setup>
import { useManagementStore } from "@/stores/management";
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
const store = useManagementStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);
const companyLogo = ref([]);

const formData = ref({
  type: "general_assembly",
  name_en: "",
  name_ar: "",
  job_ar: "",
  job_en: "",
  company_ar: "",
  company_en: "",
  description_ar: "",
  description_en: "",
  images: [],
  company_logo: "",
  company_scope_of_work: "",
  website_link: "",
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

const loadCompanyLogo = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    companyLogo.value = [];
    companyLogo.value.push(...files);
  }
};

const removeImageByIndex = (index) => {
  images.value = Array.from(images.value);
  images.value.splice(index, 1);
  formData.value.images = images.value;
};

const removeCompanyLogoByIndex = (index) => {
  companyLogo.value = Array.from(companyLogo.value);
  companyLogo.value.splice(index, 1);
  formData.value.company_logo = companyLogo.value;
};

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      var data = {
        type: formData.value.type,
        name_en: formData.value.name_en,
        name_ar: formData.value.name_ar,
        job_ar: formData.value.job_ar,
        job_en: formData.value.job_en,
        company_ar: formData.value.company_ar,
        company_en: formData.value.company_en,
        description_ar: formData.value.description_ar,
        description_en: formData.value.description_en,
        image: images.value && images.value.length > 0 ? images.value[0] : null,
        company_logo:
          companyLogo.value && companyLogo.value.length > 0
            ? companyLogo.value[0]
            : null,
        company_scope_of_work: formData.value.company_scope_of_work,
        website_link: formData.value.website_link,
        facebook_link: formData.value.facebook_link,
        instagram_link: formData.value.instagram_link,
        linkedin_link: formData.value.linkedin_link,
      };
      store.storEmployee(data).then((res) => {
        router.push({
          name: "management-general-assembly",
        });
      });
    }
  });
};

onMounted(() => {});
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
              {{ $t("common.Add a member") }}
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
                  :label="$t('common.image')"
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
                  v-model="formData.job_ar"
                  :label="$t('common.job_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.job_en"
                  :label="$t('common.job_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.company_ar"
                  :label="$t('common.company_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.company_en"
                  :label="$t('common.company_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="12" cols="12">
                <VRow
                  class="my-2 p-0"
                  v-if="companyLogo && companyLogo.length > 0"
                >
                  <VCol
                    md="2"
                    v-for="(image, index) in companyLogo"
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
                      @click="removeCompanyLogoByIndex(index)"
                      class="remove-image"
                    />
                  </VCol>
                </VRow>
                <VFileInput
                  accept="image/*"
                  :label="$t('common.company_logo')"
                  v-model="formData.company_logo"
                  @change="loadCompanyLogo"
                  class="hide-input"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.company_scope_of_work"
                  :label="$t('common.company_scope_of_work')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.website_link"
                  :label="$t('common.website_link')"
                  :rules="[urlValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="formData.facebook_link"
                  :label="$t('common.facebook_link')"
                  :rules="[urlValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="formData.instagram_link"
                  :label="$t('common.instagram_link')"
                  :rules="[urlValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="formData.linkedin_link"
                  :label="$t('common.linkedin_link')"
                  :rules="[urlValidator]"
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
                <VBtn
                  type="submit"
                  :disabled="!formData.images.length && !images.length"
                  >{{ $t("common.save") }}</VBtn
                >

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'management-general-assembly' }"
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
