<script setup>
import { useBoardCommitteesStore } from "@/stores/boardCommittees";
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
const store = useBoardCommitteesStore();
const managementStore = useManagementStore();
const refInputEl = ref();
const refVForm = ref();
const filteredData = ref({
  type: "",
  search: "",
  status: null,
  page: 1,
  per_page: 10000,
});

const formData = ref({
  title_en: "",
  title_ar: "",
  description_ar: "",
  description_en: "",
  employees: [
    {
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
    },
  ],
});

const addNewEmployee = () => {
  formData.value.employees.push({
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
};

const loadImages = (e, employeeIndex) => {
  const files = e.target.files;
  if (files.length > 0) {
    formData.value.employees[employeeIndex].images = [];
    formData.value.employees[employeeIndex].images.push(...files);
  }
};

const removeImageByIndex = (employeeIndex, index) => {
  formData.value.employees[employeeIndex].images = Array.from(
    formData.value.employees[employeeIndex].images
  );
  formData.value.employees[employeeIndex].images.splice(index, 1);
};

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      var employees = formData.value.employees.map((item) => {
        return {
          name_ar: item.name_ar,
          name_en: item.name_en,
          job_ar: item.job_ar,
          job_en: item.job_en,
          description_ar: item.description_ar,
          description_en: item.description_en,
          image: item.images && item.images.length > 0 ? item.images[0] : null,
          facebook_link: item.facebook_link,
          instagram_link: item.instagram_link,
          linkedin_link: item.linkedin_link,
        };
      });
      var data = {
        title_en: formData.value.title_en,
        title_ar: formData.value.title_ar,
        description_ar: formData.value.description_ar,
        description_en: formData.value.description_en,
        employees: employees,
      };
      store.storCommittee(data).then((res) => {
        router.push({
          name: "management-board-committees",
        });
      });
    }
  });
};

onMounted(() => {
  managementStore.loadEmployees(filteredData);
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
              {{ $t("common.add_committee") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.title_ar"
                  :label="$t('common.title_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.title_en"
                  :label="$t('common.title_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol md="6" cols="12">
                <VTextarea
                  v-model="formData.description_ar"
                  :label="$t('common.description_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextarea
                  v-model="formData.description_en"
                  :label="$t('common.description_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="12" cols="12">
                <h4
                  class="text-h8 font-weight-bold"
                  style="margin-bottom: 16px"
                >
                  {{ $t("common.Employee data") }}
                </h4>
              </VCol>
            </VRow>

            <VRow
              v-for="(employee, employeeIndex) in formData.employees"
              :key="employeeIndex"
              style="
                margin-bottom: 30px;
                padding: 12px;
                border: 1px solid #e0e0e0;
                border-radius: 8px;
              "
            >
              <VCol :cols="employeeIndex == 0 ? '12' : '11'">
                <VRow class="my-2 p-0" v-if="employee.images && employee.images.length > 0">
                  <VCol
                    md="2"
                    v-for="(image, index) in employee.images"
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
                      @click="removeImageByIndex(employeeIndex, index)"
                      class="remove-image"
                    />
                  </VCol>
                </VRow>
                <VFileInput
                  accept="image/*"
                  :label="$t('common.image')"
                  v-model="employee.images"
                  @change="loadImages($event, employeeIndex)"
                  class="hide-input"
                />
              </VCol>
              <VCol v-if="employeeIndex > 0" cols="1" class="text-center">
                <VBtn
                  color="error"
                  icon="tabler-trash"
                  @click="formData.employees.splice(employeeIndex, 1)"
                  class="remove-employee"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="employee.name_ar"
                  :label="$t('common.name_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="employee.name_en"
                  :label="$t('common.name_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField
                  v-model="employee.job_ar"
                  :label="$t('common.job_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="employee.job_en"
                  :label="$t('common.job_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="employee.facebook_link"
                  :label="$t('common.facebook_link')"
                  :rules="[urlValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="employee.instagram_link"
                  :label="$t('common.instagram_link')"
                  :rules="[urlValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VTextField
                  v-model="employee.linkedin_link"
                  :label="$t('common.linkedin_link')"
                  :rules="[urlValidator]"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VBtn type="button" @click="addNewEmployee">{{
                  $t("common.add_member")
                }}</VBtn>
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'management-board-committees' }"
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
