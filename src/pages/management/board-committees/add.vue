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
import defaultImage from "@images/default-image.png";
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
  employees: [],
});

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      var data = {
        title_en: formData.value.title_en,
        title_ar: formData.value.title_ar,
        description_ar: formData.value.description_ar,
        description_en: formData.value.description_en,
        employees: formData.value.employees,
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
              <VCol cols="12">
                <VSelect
                  v-model="formData.employees"
                  :items="managementStore.getEmployees"
                  item-title="name"
                  item-value="id"
                  clear-icon="tabler-x"
                  :disabled="managementStore.getEmployees.length == 0"
                  multiple
                  chips
                  :label="$t('common.employees')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn
                  type="submit"
                  >{{ $t("common.save") }}</VBtn
                >

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
