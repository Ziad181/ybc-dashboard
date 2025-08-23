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
const basic_system = ref([]);
const formData = ref({
  basic_system: [],
});

const loadbasic_system = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    basic_system.value = [];
    basic_system.value.push(...files);
  }
};

const removebasic_systemByIndex = (index) => {
  basic_system.value = Array.from(basic_system.value);
  basic_system.value.splice(index, 1);
  formData.value.basic_system = basic_system.value;
};

const openBlock = (file) => {
  const fileUrl = getAssetUploadedFilesPath(file);
  window.open(fileUrl, "_blank");
};

onMounted(() => {
  store.loadSetting().then(() => {
    basic_system.value = getSetting.value.basic_system
      ? [getSetting.value.basic_system]
      : [];
  });
});

const refVForm = ref();

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      var data = {
        basic_system:
          basic_system.value && basic_system.value.length > 0
            ? basic_system.value[0]
            : null,
      };
      store.updateBasicSystem(data).then((res) => {});
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
            {{ $t("common.edit basic system") }}
          </h4>
        </div>

        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refVForm" class="mt-0" @submit.prevent="onSubmitForm">
            <VRow>
              <VCol cols="12" md="12">
                <VRow
                  class="my-2 p-0"
                  v-if="basic_system && basic_system.length > 0"
                >
                  <VCol
                    md="12"
                    v-for="(file, index) in basic_system"
                    :key="index"
                    class="position-relative"
                  >
                    <v-card class="w-100">
                      <template v-slot:title>
                        <div class="d-flex align-center justify-between w-100">
                          <span class="font-weight-black">{{
                            $t("common.The basic system")
                          }}</span>
                          <div class="ms-auto">
                            <VBtn
                              color="primary"
                              icon="tabler-eye"
                              @click="openBlock(file)"
                              class=""
                            />

                            <!-- <VBtn
                              color="error"
                              icon="tabler-trash"
                              @click="removebasic_systemByIndex(index)"
                            /> -->
                          </div>
                        </div>
                      </template>
                    </v-card>
                  </VCol>
                </VRow>
                <VFileInput
                  accept="application/pdf"
                  :label="$t('common.file')"
                  v-model="formData.basic_system"
                  @change="loadbasic_system"
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
