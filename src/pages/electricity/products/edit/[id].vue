<script setup>
import { useCategoriesStore } from "@/stores/categories";
import { usePartnershipsStore } from "@/stores/partnerships";
import { useProductsStore } from "@/stores/products";

import { getAssetUploadedFilesPath } from "@/helpers/assets";
import i18n from "@/plugins/i18n";
import {
  requiredValidator
} from "@validators";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRoute, useRouter } from "vue-router";

const { t } = useI18n(); //
const router = useRouter();
const route = useRoute();
const store = useProductsStore();
const partnershipsStore = usePartnershipsStore();
const categoriesStore = useCategoriesStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);

const filterData = ref({
  section: "electricity",
  search: "",
  status: null,
  page: 1,
  per_page: 1000,
});

const formData = ref({
  id: route.params.id,
  section: "electricity",
  partnership_id: null,
  category: null,
  sub_category_id: null,
  name_ar: "",
  name_en: "",
  description_ar: "",
  description_en: "",
  images: [],
  is_feature: false,
});

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
      var data = {
        id: formData.value.id,
        section: "electricity",
        partnership_id: formData.value.partnership_id,
        category_id: formData.value.category.id,
        sub_category_id: formData.value.sub_category_id,
        name_ar: formData.value.name_ar,
        name_en: formData.value.name_en,
        description_ar: formData.value.description_ar,
        description_en: formData.value.description_en,
        is_feature: formData.value.is_feature ? 1 : 0,
        old_images:
          images.value && images.value?.length > 0
            ? images.value.filter((image) => typeof image === "string")
            : [],
        images:
          images.value && images.value?.length > 0
            ? images.value.filter((image) => typeof image != "string")
            : [],
      };

      store.updateProduct(data).then((res) => {
        router.push({
          name: "electricity-products",
        });
      });
    }
  });
};

onMounted(() => {
  partnershipsStore.loadPartnerships(filterData);
  categoriesStore.loadCategories(filterData);
  store.loadProductDetails(formData.value.id).then((res) => {
    formData.value.partnership_id = store.getProductDetails.partnership_id;
    formData.value.category = store.getProductDetails.category;
    formData.value.sub_category_id = store.getProductDetails.sub_category_id;
    formData.value.name_ar = store.getProductDetails.name_ar;
    formData.value.name_en = store.getProductDetails.name_en;
    formData.value.description_ar = store.getProductDetails.description_ar;
    formData.value.description_en = store.getProductDetails.description_en;
    formData.value.is_feature =
      store.getProductDetails.is_feature == 1 ? true : false;
    images.value = store.getProductDetails.images ?? [];
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
              {{ $t("common.edit_product") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <VRow>
              <VCol md="4" cols="12">
                <VSelect
                  v-model="formData.partnership_id"
                  :placeholder="$t('common.Agents')"
                  :items="partnershipsStore.getPartnerships"
                  item-title="title"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                  :disabled="partnershipsStore.getPartnerships?.length === 0"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="4" cols="12">
                <VSelect
                  v-model="formData.category"
                  :placeholder="$t('common.category')"
                  :items="categoriesStore.getCategories"
                  item-title="name"
                  clearable
                  return-object
                  clear-icon="tabler-x"
                  :disabled="categoriesStore.getCategories?.length === 0"
                  :rules="[requiredValidator]"
                >
                </VSelect>
              </VCol>
              <VCol md="4" cols="12">
                <VSelect
                  v-model="formData.sub_category_id"
                  :placeholder="$t('common.sub_categories')"
                  :items="formData.category?.sub_categories"
                  item-title="name"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                  :disabled="
                    categoriesStore.getCategories?.length === 0 ||
                    !formData.category ||
                    formData.category === null ||
                    !formData.category?.sub_categories ||
                    formData.category?.sub_categories?.length === 0
                  "
                >
                </VSelect>
              </VCol>
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
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'electricity-products' }"
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
