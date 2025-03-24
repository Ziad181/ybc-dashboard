<script setup>
import { useActivityStore } from "@/stores/activity";
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useI18n } from "vue-i18n";
import Datepicker from "vue3-datepicker";
import { ar, enGB } from "date-fns/locale";
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
const store = useActivityStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);
const types = [
{
    title: t("common.conferences"),
    id: "conferences",
  },
  {
    title: t("common.flights"),
    id: "flights",
  },
  {
    title: t("common.workshops"),
    id: "workshops",
  },
  {
    title: t("common.social"),
    id: "social",
  },
  {
    title: t("common.research"),
    id: "research",
  },
  {
    title: t("common.ceo"),
    id: "ceo",
  },
];
const formData = ref({
  id: route.params.id,
  type: "",
  title_en: "",
  title_ar: "",
  content_en: "",
  content_ar: "",
  images: [],
  date: null,
  address: "",
});
const disabledDate = (date) => {
  const now = new Date();
  return date < now;
};
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
      formData.value.old_images =
        images.value && images.value.length > 0
          ? images.value.filter((image) => typeof image === "string")
          : [];
      formData.value.images =
        images.value && images.value.length > 0
          ? images.value.filter((image) => typeof image != "string")
          : [];

      const date = new Date(formData.value.date);
      formData.value.date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
      store.updateActivity(formData.value).then((res) => {
        router.push({
          name: "activities",
        });
      });
    }
  });
};

onMounted(() => {
  store.loadActivityDetails(route.params.id).then(() => {
    formData.value.type = store.getActivityDetails.type;
    formData.value.date = new Date(store.getActivityDetails.date);
    formData.value.address = store.getActivityDetails.address;
    formData.value.title_ar = store.getActivityDetails.title_ar;
    formData.value.title_en = store.getActivityDetails.title_en;
    formData.value.content_ar = store.getActivityDetails.content_ar;
    formData.value.content_en = store.getActivityDetails.content_en;
    images.value = store.getActivityDetails.images ?? [];
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
              {{ $t("common.edit_activity") }}
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
                  chips
                  multiple
                  :label="$t('common.images')"
                  v-model="formData.images"
                  @change="loadImages"
                  class="hide-input"
                />
              </VCol>
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
                <VSelect
                  v-model="formData.type"
                  :placeholder="$t('common.select_type')"
                  :items="types"
                  item-title="title"
                  item-value="id"
                  clear-icon="tabler-x"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol md="6" cols="12" dir="ltr">
                <Datepicker
                  dir="rtl"
                  v-model="formData.date"
                  :minimumView="'time'"
                  :placeholder="$t('common.Activity date')"
                  :locale="i18n.global.locale.value == 'en' ? enGB : ar"
                  :inputFormat="'yyyy-MM-dd HH:mm'"
                />
              </VCol>

              <VCol md="12" cols="12">
                <VTextField
                  v-model="formData.address"
                  :label="$t('common.address')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="12">
                <label>{{ $t("common.content_ar") }}</label>
                <div class="texteditor" dir="ltr">
                  <QuillEditor
                    v-model:content="formData.content_ar"
                    theme="snow"
                    toolbar="full"
                    contentType="html"
                    name="content_ar"
                    :placeholder="$t('common.content_ar')"
                  />
                </div>
              </VCol>
              <VCol cols="12">
                <label>{{ $t("common.content_en") }}</label>
                <div class="texteditor" dir="ltr">
                  <QuillEditor
                    v-model:content="formData.content_en"
                    theme="snow"
                    toolbar="full"
                    contentType="html"
                    name="content_en"
                    :placeholder="$t('common.content_en')"
                  />
                </div>
              </VCol>
              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn
                  type="submit"
                  :disabled="
                    !images ||
                    images.length == 0 ||
                    !formData.type ||
                    !formData.date ||
                    !formData.address ||
                    !formData.title_ar ||
                    !formData.title_en ||
                    !formData.content_ar ||
                    !formData.content_en
                  "
                  >{{ $t("common.save") }}</VBtn
                >

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'activities' }"
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
