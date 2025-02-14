<!-- eslint-disable semi -->
<script setup>
import i18n from "@/plugins/i18n";
import { useUtilityStore } from "@/stores/utility";
import {
    requiredValidator
} from "@validators";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useUtilityStore();

const { getContactDetails } = storeToRefs(store);

const router = useRouter();

const contactDetailForm = ref({
  total_agents: 0,
  total_branches: 0,
  total_mw: 0,
});

watch(getContactDetails, () => {
  if (getContactDetails.value) {
    contactDetailForm.value.total_agents = getContactDetails.value.total_agents;
    contactDetailForm.value.total_branches =
      getContactDetails.value.total_branches;
    contactDetailForm.value.total_mw =
      getContactDetails.value.total_mw;
  }
});

onMounted(() => {
  store.loadContactDetails().then(() => {
    contactDetailForm.value.total_agents = getContactDetails.value.total_agents;
    contactDetailForm.value.total_branches =
      getContactDetails.value.total_branches;
    contactDetailForm.value.total_mw =
      getContactDetails.value.total_mw;
  });
});

const refVForm = ref();

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.updateStatistics(contactDetailForm.value).then((res) => {});
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
            {{ $t("common.Statistics") }}
          </h4>
        </div>

        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refVForm" class="mt-0" @submit.prevent="onSubmitForm">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.total_agents"
                  :label="$t('common.Total Agents')"
                  :rules="[requiredValidator]"
                  type="number"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.total_branches"
                  :label="$t('common.Total branches')"
                  :rules="[requiredValidator]"
                  type="number"
                />
              </VCol>
              <VCol cols="6" md="6">
                <VTextField
                  v-model="contactDetailForm.total_mw"
                  :label="$t('common.Total MW')"
                  :rules="[requiredValidator]"
                  type="number"
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
