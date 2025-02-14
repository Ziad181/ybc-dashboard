<script setup>
import { useCategoriesStore } from "@/stores/categories";
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

const { t } = useI18n(); //
const router = useRouter();
const store = useCategoriesStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref("");

const formData = ref({
  name_ar: "",
  name_en: "",
  section: "solar-energy",
  sub_categories: [],
});

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      formData.value.images =
        images.value && images.value.length > 0 ? images.value : [];

      store.storeCategory(formData.value).then((res) => {
        router.push({
          name: "solar-energy-categories",
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
              {{ $t("common.add_category") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
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
            </VRow>
            <VRow>
              <VCol cols="12">
                <h2 style="font-size: 20px">
                  {{ $t("common.sub_categories") }}:
                </h2>
              </VCol>
            </VRow>
            <VRow v-for="(item, index) in formData.sub_categories" :key="index">
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.sub_categories[index].name_ar"
                  :label="$t('common.name_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol :md="5" :cols="11">
                <VTextField
                  v-model="formData.sub_categories[index].name_en"
                  :label="$t('common.name_en')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="1">
                <VBtn
                  color="error"
                  icon="tabler-trash"
                  @click="formData.sub_categories.splice(index, 1)"
                />
              </VCol>
            </VRow>
            <VRow>
              <VCol cols="12">
                <VBtn
                  color="primary"
                  @click="
                    formData.sub_categories.push({ name_ar: '', name_en: '' })
                  "
                >
                  {{ $t("common.add_sub_category") }}
                </VBtn>
              </VCol>
            </VRow>
            <VRow>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4 mt-5">
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'solar-energy-categories' }"
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
