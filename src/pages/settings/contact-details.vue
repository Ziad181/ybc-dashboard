<!-- eslint-disable semi -->
<script setup>
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter, useRoute } from "vue-router";
import { useUtilityStore } from "@/stores/utility";
import { VueEditor } from "vue3-editor";
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

const store = useUtilityStore();

const { getContactDetails } = storeToRefs(store);

const router = useRouter();

const contactDetailForm = ref({
  phone_number_1: null,
  phone_number_2: null,
  whatsapp: null,
  email: null,
  facebook: null,
  twitter: null,
  instagram: null,
  snapchat: null,
  address_ar: null,
  address_en: null,
});

watch(getContactDetails, () => {
  if (getContactDetails.value) {
    contactDetailForm.value.phone_number_1 =
      getContactDetails.value.phone_number_1;
    contactDetailForm.value.phone_number_2 =
      getContactDetails.value.phone_number_2;
    contactDetailForm.value.whatsapp = getContactDetails.value.whatsapp;
    contactDetailForm.value.email = getContactDetails.value.email;
    contactDetailForm.value.facebook = getContactDetails.value.facebook;
    contactDetailForm.value.twitter = getContactDetails.value.twitter;
    contactDetailForm.value.instagram = getContactDetails.value.instagram;
    contactDetailForm.value.snapchat = getContactDetails.value.snapchat;
    contactDetailForm.value.address_ar = getContactDetails.value.address_ar;
    contactDetailForm.value.address_en = getContactDetails.value.address_en;
  }
});

onMounted(() => {
  store.loadContactDetails().then(() => {
    contactDetailForm.value.phone_number_1 =
      getContactDetails.value.phone_number_1;
    contactDetailForm.value.phone_number_2 =
      getContactDetails.value.phone_number_2;
    contactDetailForm.value.whatsapp = getContactDetails.value.whatsapp;
    contactDetailForm.value.email = getContactDetails.value.email;
    contactDetailForm.value.facebook = getContactDetails.value.facebook;
    contactDetailForm.value.twitter = getContactDetails.value.twitter;
    contactDetailForm.value.instagram = getContactDetails.value.instagram;
    contactDetailForm.value.snapchat = getContactDetails.value.snapchat;
    contactDetailForm.value.address_ar = getContactDetails.value.address_ar;
    contactDetailForm.value.address_en = getContactDetails.value.address_en;
  });
});

const refVForm = ref();

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.updateContactDetails(contactDetailForm.value).then((res) => {});
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
            {{ $t("common.Contact Details") }}
          </h4>
        </div>

        <VCardText>
          <!-- 👉 Form -->
          <VForm ref="refVForm" class="mt-0" @submit.prevent="onSubmitForm">
            <VRow>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.phone_number_1"
                  :label="$t('common.phone_number')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.phone_number_2"
                  :label="
                    $t('common.another_phone_number') +
                    ` (${$t('common.Optional')})`
                  "
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.whatsapp"
                  :label="$t('common.whatsapp')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol cols="6" md="6">
                <VTextField
                  v-model="contactDetailForm.email"
                  :label="$t('common.email')"
                  type="email"
                  :rules="[requiredValidator, emailValidator]"
                />
              </VCol>

              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.facebook"
                  :label="$t('common.facebook')"
                  :rules="[requiredValidator, urlValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.twitter"
                  :label="$t('common.twitter')"
                  :rules="[requiredValidator, urlValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.instagram"
                  :label="$t('common.instagram')"
                  :rules="[requiredValidator, urlValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.snapchat"
                  :label="$t('common.snapchat')"
                  :rules="[requiredValidator, urlValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.address_ar"
                  :label="$t('common.address_ar')"
                  :rules="[requiredValidator]"
                />
              </VCol>
              <VCol md="6" cols="12">
                <VTextField
                  v-model="contactDetailForm.address_en"
                  :label="$t('common.address_en')"
                  :rules="[requiredValidator]"
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
