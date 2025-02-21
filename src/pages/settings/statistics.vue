<!-- eslint-disable semi -->
<script setup>
import i18n from "@/plugins/i18n";
import { useUtilityStore } from "@/stores/utility";
import { requiredValidator } from "@validators";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const store = useUtilityStore();

const { getSetting } = storeToRefs(store);

const router = useRouter();

const statisticForm = ref({
  total_member: 0,
  total_conferences: 0,
  total_seminar: 0,
  total_workshops: 0,
});

watch(getSetting, () => {
  if (getSetting.value) {
    statisticForm.value.total_member = getSetting.value.total_member;
    statisticForm.value.total_conferences =
      getSetting.value.total_conferences;
    statisticForm.value.total_seminar = getSetting.value.total_seminar;
    statisticForm.value.total_workshops = getSetting.value.total_workshops;
  }
});

onMounted(() => {
  store.loadSetting().then(() => {
    statisticForm.value.total_member = getSetting.value.total_member;
    statisticForm.value.total_conferences =
      getSetting.value.total_conferences;
    statisticForm.value.total_seminar = getSetting.value.total_seminar;
    statisticForm.value.total_workshops = getSetting.value.total_workshops;
  });
});

const refVForm = ref();

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.updateStatistics(statisticForm.value).then((res) => {});
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
                  v-model="statisticForm.total_member"
                  :label="$t('common.total_member')"
                  :rules="[requiredValidator]"
                  type="number"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="statisticForm.total_conferences"
                  :label="$t('common.total_conferences')"
                  :rules="[requiredValidator]"
                  type="number"
                />
              </VCol>
              <VCol cols="6" md="6">
                <VTextField
                  v-model="statisticForm.total_seminar"
                  :label="$t('common.total_seminar')"
                  :rules="[requiredValidator]"
                  type="number"
                />
              </VCol>
              <VCol cols="6" md="6">
                <VTextField
                  v-model="statisticForm.total_workshops"
                  :label="$t('common.total_workshops')"
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
