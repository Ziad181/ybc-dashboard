<script setup>
import { useBannersStore } from "@/stores/banners";

import { getAssetUploadedFilesPath } from "@/helpers/assets";
import i18n from "@/plugins/i18n";
import { requiredValidator, urlValidator } from "@validators";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const { t } = useI18n(); //
const router = useRouter();
const route = useRoute();
const store = useBannersStore();

const refInputEl = ref();
const refVForm = ref();
const images = ref([]);
const sections = [
  {
    title: t("nav.home"),
    id: "home",
  },
  {
    title: t("nav.business_support_center"),
    id: "business_support_center",
  },
  {
    title: t("nav.yemen_business_center"),
    id: "yemen_business_center",
  },
];

const formData = ref({
  id: null,
  section: null,
  title: "",
  link: "",
  product_id: null,
  images: [],
});

const loadImages = (e) => {
  const files = e.target.files;
  if (files.length > 0) {
    images.value = [];
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
        section: formData.value.section,
        title: formData.value.title,
        link: formData.value.link,
        image: images.value && images.value.length > 0 ? images.value[0] : [],
      };
      store.updateBanner(data).then((res) => {
        router.push({
          name: "banners",
        });
      });
    }
  });
};

onMounted(() => {
  formData.value.id = route.params.id;
  store
    .loadBannerDetails(route.params.id)
    .then(() => {
      formData.value.section = store.getBannerDetails.section;
      formData.value.title = store.getBannerDetails.title;
      formData.value.link = store.getBannerDetails.link;
      images.value = store.getBannerDetails.image
        ? [store.getBannerDetails.image]
        : [];
    })
    .then(() => {});
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
              {{ $t("common.edit_banner") }}
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
                  :label="$t('common.images')"
                  v-model="formData.images"
                  @change="loadImages"
                  class="hide-input"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.title"
                  :label="$t('common.title')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VSelect
                  v-model="formData.section"
                  :placeholder="$t('common.select_section')"
                  :items="sections"
                  item-title="title"
                  item-value="id"
                  clear-icon="tabler-x"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="formData.link"
                  :label="
                    $t('common.url') + ' ' + '( ' + $t('common.Optional') + ' )'
                  "
                  :rules="[urlValidator]"
                />
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn
                  type="submit"
                  :disabled="
                    !formData.section ||
                    !formData.title ||
                    !images ||
                    !images.length
                  "
                  >{{ $t("common.save") }}</VBtn
                >

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'banners' }"
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
