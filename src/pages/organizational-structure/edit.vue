<!-- eslint-disable semi -->
<script setup>
import i18n from "@/plugins/i18n";
import { useUtilityStore } from "@/stores/utility";
import { requiredValidator } from "@validators";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const store = useUtilityStore();

const { getSetting } = storeToRefs(store);

const router = useRouter();
const organizational_structure_ar = ref([]);
const organizational_structure_en = ref([]);
const formData = ref({
  organizational_structure_ar: [],
  organizational_structure_en: [],
});
const loadorganizational_structure_ar = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    organizational_structure_ar.value = [];
    organizational_structure_ar.value.push(...files);
  }
};

const loadorganizational_structure_en = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    organizational_structure_en.value = [];
    organizational_structure_en.value.push(...files);
  }
};

const removeorganizational_structure_arByIndex = (index) => {
  organizational_structure_ar.value = Array.from(
    organizational_structure_ar.value
  );
  organizational_structure_ar.value.splice(index, 1);
  formData.value.organizational_structure_ar =
    organizational_structure_ar.value;
};

const removeorganizational_structure_enByIndex = (index) => {
  organizational_structure_en.value = Array.from(
    organizational_structure_en.value
  );
  organizational_structure_en.value.splice(index, 1);
  formData.value.organizational_structure_en =
    organizational_structure_en.value;
};

onMounted(() => {
  store.loadSetting().then(() => {
    organizational_structure_ar.value = getSetting.value.organizational_structure_ar
      ? [getSetting.value.organizational_structure_ar]
      : [];
    organizational_structure_en.value = getSetting.value.organizational_structure_en
      ? [getSetting.value.organizational_structure_en]
      : [];
  });
});

const refVForm = ref();

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      var data = {
        organizational_structure_ar:
          organizational_structure_ar.value &&
          organizational_structure_ar.value.length > 0
            ? organizational_structure_ar.value[0]
            : null,
        organizational_structure_en:
          organizational_structure_en.value &&
          organizational_structure_en.value.length > 0
            ? organizational_structure_en.value[0]
            : null,
      };
      store.updateOrganizationalStructure(data).then((res) => {
        router.push({ name: "organizational-structure" });
      });
    }
  });
};
</script>

<template>
  <VRow>
    <VCol cols="12">
      <VCard>
        <div class="d-flex align-center pt-5 px-6">
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
            {{ $t("common.edit organizational structure") }}
          </h4>
        </div>

        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refVForm" class="mt-0" @submit.prevent="onSubmitForm">
            <VRow>
              <VCol cols="12" md="12">
                <p>{{ $t("common.organizational_structure_ar") }}</p>
                <VRow
                  class="my-2 p-0"
                  v-if="
                    organizational_structure_ar &&
                    organizational_structure_ar.length > 0
                  "
                >
                  <VCol
                    md="2"
                    v-for="(image, index) in organizational_structure_ar"
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
                      @click="removeorganizational_structure_arByIndex(index)"
                      class="remove-image"
                    />
                  </VCol>
                </VRow>
                <VFileInput
                  accept="image/*"
                  :label="$t('common.image')"
                  v-model="formData.organizational_structure_ar"
                  @change="loadorganizational_structure_ar"
                  class="hide-input"
                />
              </VCol>
              <VCol cols="12" md="12">
                <p>{{ $t("common.organizational_structure_en") }}</p>
                <VRow
                  class="my-2 p-0"
                  v-if="
                    organizational_structure_en &&
                    organizational_structure_en.length > 0
                  "
                >
                  <VCol
                    md="2"
                    v-for="(image, index) in organizational_structure_en"
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
                      @click="removeorganizational_structure_enByIndex(index)"
                      class="remove-image"
                    />
                  </VCol>
                </VRow>
                <VFileInput
                  accept="image/*"
                  :label="$t('common.image')"
                  v-model="formData.organizational_structure_en"
                  @change="loadorganizational_structure_en"
                  class="hide-input"
                />
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">
                  {{ $t("common.save") }}
                </VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'settings' }"
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
