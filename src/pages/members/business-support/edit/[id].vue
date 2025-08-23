<script setup>
import { useMemberStore } from "@/stores/member";
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
import defaultImage from "@images/default-image.webp";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const router = useRouter();
const store = useMemberStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref([]);
const companyLogo = ref([]);

const sectorList = ref([
  {
    text: t("common.service"),
    value: "service",
  },
  {
    text: t("common.commercial"),
    value: "commercial",
  },
  {
    text: t("common.industrial"),
    value: "industrial",
  },
  {
    text: t("common.technology"),
    value: "technology",
  },
  {
    text: t("common.other"),
    value: "other",
  },
]);

const otherProjectSector = ref("");
const formData = ref({
  name: "",
  email: "",
  phone: "",
  image: [],
  whatsapp_number: "",
  birth_date: "",
  gender: "",
  project_name_ar: "",
  project_name_en: "",
  project_sector: "",
  year_of_establishment: "",
  address: "",
  project_description_ar: "",
  project_description_en: "",
  average_annual_revenues: "",
  number_of_employees: "",
  project_capital: "",
  service_type: "",
  instagram_link: "",
  x_link: "",
  facebook_link: "",
  linkedin_link: "",
  website_link: "",
  id_image: [],
  cv: [],
  project_logo: [],
  license: [],
});
const rules = {
  required: (value) => !!value || t("validators.This field is required"),
  email: (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
    t("validators.The Email field must be a valid email"),
  requiredFile: (value) =>
    (value && value.length > 0) || t("validators.This field is required"),
};
const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      formData.value.project_sector =
        formData.value.project_sector === "other"
          ? otherProjectSector.value
          : formData.value.project_sector;

      formData.value.image =
        formData.value.image && formData.value.image.length > 0
          ? formData.value.image[0]
          : null;
      formData.value.id_image =
        formData.value.id_image && formData.value.id_image.length > 0
          ? formData.value.id_image[0]
          : null;
      formData.value.cv =
        formData.value.cv && formData.value.cv.length > 0
          ? formData.value.cv[0]
          : null;
      formData.value.project_logo =
        formData.value.project_logo && formData.value.project_logo.length > 0
          ? formData.value.project_logo[0]
          : null;
      formData.value.license =
        formData.value.license && formData.value.license.length > 0
          ? formData.value.license[0]
          : null;
      store.updateMember(formData.value).then((res) => {
        router.push({
          name: "members-business-support",
        });
      });
    }
  });
};

onMounted(() => {
  const route = useRoute();
  if (route.params.id) {
    store.loadMemberDetails(route.params.id).then((res) => {
      formData.value = {
        id: store.getMemberDetails.id,
        name: store.getMemberDetails.name,
        email: store.getMemberDetails.email,
        phone: store.getMemberDetails.phone,
        image: store.getMemberDetails.image
          ? [store.getMemberDetails.image]
          : [],
        whatsapp_number:
          store.getMemberDetails.business_support_center_member.whatsapp_number,
        birth_date:
          store.getMemberDetails.business_support_center_member.birth_date,
        gender: store.getMemberDetails.business_support_center_member.gender,
        project_name_ar:
          store.getMemberDetails.business_support_center_member.project_name_ar,
        project_name_en:
          store.getMemberDetails.business_support_center_member.project_name_en,
        project_sector:
          store.getMemberDetails.business_support_center_member.project_sector,
        year_of_establishment:
          store.getMemberDetails.business_support_center_member
            .year_of_establishment,
        address: store.getMemberDetails.business_support_center_member.address,
        project_description_ar:
          store.getMemberDetails.business_support_center_member
            .project_description_ar,
        project_description_en:
          store.getMemberDetails.business_support_center_member
            .project_description_en,
        average_annual_revenues:
          store.getMemberDetails.business_support_center_member
            .average_annual_revenues,
        number_of_employees:
          store.getMemberDetails.business_support_center_member
            .number_of_employees,
        project_capital:
          store.getMemberDetails.business_support_center_member.project_capital,
        service_type:
          store.getMemberDetails.business_support_center_member.service_type,
        instagram_link:
          store.getMemberDetails.business_support_center_member.instagram_link,
        x_link: store.getMemberDetails.business_support_center_member.x_link,
        facebook_link:
          store.getMemberDetails.business_support_center_member.facebook_link,
        linkedin_link:
          store.getMemberDetails.business_support_center_member.linkedin_link,
        website_link:
          store.getMemberDetails.business_support_center_member.website_link,
        id_image: store.getMemberDetails.business_support_center_member.id_image
          ? [store.getMemberDetails.business_support_center_member.id_image]
          : [],
        cv: store.getMemberDetails.business_support_center_member.cv
          ? [store.getMemberDetails.business_support_center_member.cv]
          : [],
        project_logo: store.getMemberDetails.business_support_center_member
          .project_logo
          ? [store.getMemberDetails.business_support_center_member.project_logo]
          : [],
        license: store.getMemberDetails.business_support_center_member.license
          ? [store.getMemberDetails.business_support_center_member.license]
          : [],
      };
      if (
        !sectorList.value.find(
          (sector) => sector.value === store.getMemberDetails.business_support_center_member.project_sector
        )
      ) {
        otherProjectSector.value = store.getMemberDetails.business_support_center_member.project_sector;
        formData.value.project_sector = "other";
      } else {
        formData.value.project_sector = store.getMemberDetails.business_support_center_member.project_sector;
      }
    });
  }
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
              {{ $t("common.Edit a member") }}
            </h4>
          </div>
          <VDivider />
          <!-- <VDivider /> -->
          <!-- 👉 Form -->
          <VForm ref="refVForm" @submit.prevent="onSubmitForm" class="mt-6">
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :rules="[rules.required]"
                  :label="$t('common.Full Name')"
                  v-model="formData.name"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  type="number"
                  suffix="+967"
                  :rules="[rules.required]"
                  v-model="formData.phone"
                  :label="$t('common.Mobile Number')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  type="number"
                  suffix="+967"
                  :rules="[rules.required]"
                  v-model="formData.whatsapp_number"
                  :label="$t('common.WhatsApp number')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  type="email"
                  :placeholder="$t('common.Enter email')"
                  :rules="[rules.required, rules.email]"
                  v-model="formData.email"
                  :label="$t('common.email')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  type="date"
                  :rules="[rules.required]"
                  v-model="formData.birth_date"
                  :label="$t('common.Birth Date')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <div class="form_group mb-0">
                  <p class="form_group_label mb-0">
                    {{ $t("common.gender") }}
                  </p>
                  <v-radio-group
                    v-model="formData.gender"
                    inline
                    :rules="[rules.required]"
                  >
                    <v-radio :label="$t('common.male')" value="male"></v-radio>
                    <v-radio
                      :label="$t('common.female')"
                      value="female"
                    ></v-radio>
                  </v-radio-group>
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :rules="[rules.required]"
                  v-model="formData.project_name_ar"
                  :label="$t('common.Project Name in Arabic')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :rules="[rules.required]"
                  v-model="formData.project_name_en"
                  :label="$t('common.Project Name in English')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :rules="[rules.required]"
                  v-model="formData.project_sector"
                  :items="sectorList"
                  variant="outlined"
                  item-title="text"
                  item-value="value"
                  :label="$t('common.Project Sector')"
                >
                </v-select>
                <v-text-field
                  v-if="formData.project_sector == 'other'"
                  variant="outlined"
                  :placeholder="$t('common.Specify')"
                  :rules="
                    formData.project_sector == 'other' ? [rules.required] : []
                  "
                  v-model="otherProjectSector"
                  class="mt-2"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  type="date"
                  :rules="[rules.required]"
                  v-model="formData.year_of_establishment"
                  :label="$t('common.The year of establishment of the project')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :placeholder="''"
                  append-inner-icon="mdi-map-marker"
                  :rules="[rules.required]"
                  v-model="formData.address"
                  :label="$t('common.address')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :rules="[rules.required]"
                  v-model="formData.project_capital"
                  :label="$t('common.Determination of project capital')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :placeholder="''"
                  :rules="[rules.required]"
                  v-model="formData.service_type"
                  :label="$t('common.Type of service provided by the project')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="[
                    {
                      text: '$1000-$5000',
                      value: '$1000-$5000',
                    },
                    {
                      text: '$5000-$2000',
                      value: '$5000-$2000',
                    },
                    {
                      text: '$50000-$20000',
                      value: '$50000-$20000',
                    },

                    {
                      text: $t('common.More than 50000$'),
                      value: 'more-than-50000$',
                    },
                  ]"
                  variant="outlined"
                  item-title="text"
                  item-value="value"
                  :rules="[rules.required]"
                  v-model="formData.average_annual_revenues"
                  :label="$t('common.Average annual revenues of the project')"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select
                  :items="[
                    {
                      text: '1-10',
                      value: '1-10',
                    },
                    {
                      text: '11-50',
                      value: '11-50',
                    },
                    {
                      text: '51-100',
                      value: '51-100',
                    },
                    {
                      text: '101-200',
                      value: '101-200',
                    },
                    {
                      text: '201-500',
                      value: '201-500',
                    },
                    {
                      text: $t('common.More than 500'),
                      value: 'more-than-500',
                    },
                  ]"
                  variant="outlined"
                  item-title="text"
                  item-value="value"
                  :rules="[rules.required]"
                  v-model="formData.number_of_employees"
                  :label="$t('common.Number of employees of the company')"
                ></v-select>
              </v-col>

              <v-col cols="12" sm="12">
                <v-textarea
                  variant="outlined"
                  rows="5"
                  no-resize
                  :rules="[rules.required]"
                  v-model="formData.project_description_ar"
                  :label="
                    $t('common.A brief overview of the project in Arabic')
                  "
                ></v-textarea>
              </v-col>

              <v-col cols="12" sm="12">
                <v-textarea
                  variant="outlined"
                  rows="5"
                  no-resize
                  :rules="[rules.required]"
                  v-model="formData.project_description_en"
                  :label="
                    $t('common.A brief overview of the project in English')
                  "
                ></v-textarea>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :placeholder="''"
                  :rules="[]"
                  v-model="formData.instagram_link"
                  :label="$t('common.Instagram page link')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :placeholder="''"
                  :rules="[]"
                  v-model="formData.facebook_link"
                  :label="$t('common.Facebook page link')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :placeholder="''"
                  :rules="[]"
                  v-model="formData.x_link"
                  :label="$t('common.X page link')"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field
                  variant="outlined"
                  :rules="[]"
                  v-model="formData.linkedin_link"
                  :label="$t('common.Linkedin page link')"
                ></v-text-field>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                  variant="outlined"
                  prepend-icon=""
                  append-inner-icon="mdi-image"
                  :rules="[rules.requiredFile]"
                  v-model="formData.id_image"
                  :label="
                    $t(
                      'common.Attach a copy of the ID card or a valid passport'
                    )
                  "
                ></v-file-input>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                  variant="outlined"
                  prepend-icon=""
                  append-inner-icon="mdi-image"
                  :rules="[rules.requiredFile]"
                  v-model="formData.image"
                  :label="
                    $t('common.Attach the personal photo of the project owner')
                  "
                ></v-file-input>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                  variant="outlined"
                  prepend-icon=""
                  append-inner-icon="mdi-image"
                  :rules="[rules.requiredFile]"
                  v-model="formData.cv"
                  :label="$t('common.Attach CV')"
                ></v-file-input>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                  variant="outlined"
                  :placeholder="$t('common.Select')"
                  prepend-icon=""
                  append-inner-icon="mdi-image"
                  :rules="[]"
                  v-model="formData.license"
                  :label="$t('common.Attach the license, if any')"
                ></v-file-input>
              </v-col>

              <v-col cols="12" sm="6">
                <v-file-input
                  variant="outlined"
                  :placeholder="$t('common.Select')"
                  prepend-icon=""
                  append-inner-icon="mdi-image"
                  :rules="[rules.requiredFile]"
                  v-model="formData.project_logo"
                  :label="$t('common.Attach the project logo')"
                ></v-file-input>
              </v-col>
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'members-business-support' }"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
              </VCol>
            </v-row>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
