<script setup>
import { ref, onMounted, watch } from "vue";
import { useMemberStore } from "@/stores/member";
import { useRouter, useRoute } from "vue-router";
import i18n from "@/plugins/i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const store = useMemberStore();
const router = useRouter();
const route = useRoute();

const resolveDataStatusVariant = (stat) => {
  if (stat === "pending") return "warning";
  if (stat === "complete") return "success";
  if (stat === "actived") return "success";
  if (stat === "stopped") return "warning";
  if (stat === "processed") return "primary";
  if (stat === "canceled") return "error";
  return "primary";
};

onMounted(() => {
  store.loadMemberDetails(route.params.id);
});
</script>

<template>
  <VRow v-if="store.getMemberDetails">
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
            {{ $t("common.member details") }}
          </h4>
        </div>
        <VCardText>
          <VRow>
            <VCol cols="12">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.name") }}
                  </span>
                  <VImg
                    v-if="store.getMemberDetails?.image"
                    style="
                      max-width: 100%;
                      height: 150px;
                      width: 150px;
                      border-radius: 8px;
                    "
                    :src="
                      getAssetUploadedFilesPath(store.getMemberDetails?.image)
                    "
                  />
                  <span class="text-h6 font-weight-medium mt-3">{{
                    store.getMemberDetails.name
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.sender_phone") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.phone
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.WhatsApp number") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.whatsapp_number
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.email") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.email
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.created_at") }}
                  </span>
                  <span class="text-h6 font-weight-medium">
                    {{
                      $filters.moment(
                        store.getMemberDetails.created_at,
                        "YYYY-MM-DD, h:mm:ss A"
                      ) || "unknown"
                    }}</span
                  >
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Birth Date") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.birth_date
                  }}</span>
                </div>
              </div>
            </VCol>

            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.gender") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    $t(
                      "common." +
                        store.getMemberDetails.business_support_center_member
                          ?.gender
                    )
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Project Name in Arabic") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.project_name_ar
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Project Name in English") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.project_name_en
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Project Sector") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.project_sector
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.service_type") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.service_type
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.The year of establishment of the project") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.year_of_establishment
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Average annual revenues of the project") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.average_annual_revenues
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Determination of project capital") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.project_capital
                  }}</span>
                </div>
              </div>
            </VCol>

            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Number of employees of the company") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.number_of_employees
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.address") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.address
                  }}</span>
                </div>
              </div>
            </VCol>

            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Instagram page link") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.instagram_link ?? "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>

            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Facebook page link") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.facebook_link ?? "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.X page link") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.x_link ?? "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Linkedin page link") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.linkedin_link ?? "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{
                      $t(
                        "common.Attach a copy of the ID card or a valid passport"
                      )
                    }}
                  </span>
                  <VImg
                    v-if="
                      store.getMemberDetails.business_support_center_member
                        ?.id_image
                    "
                    style="
                      max-width: 100%;
                      height: 300px;
                      width: 300px;
                      border-radius: 8px;
                    "
                    :src="
                      getAssetUploadedFilesPath(
                        store.getMemberDetails.business_support_center_member
                          ?.id_image
                      )
                    "
                  />
                  <span v-else class="text-h6 font-weight-medium">{{
                    "---------------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Attach CV") }}
                  </span>
                  <VImg
                    v-if="
                      store.getMemberDetails.business_support_center_member?.cv
                    "
                    style="
                      max-width: 100%;
                      height: 300px;
                      width: 300px;
                      border-radius: 8px;
                    "
                    :src="
                      getAssetUploadedFilesPath(
                        store.getMemberDetails.business_support_center_member
                          ?.cv
                      )
                    "
                  />
                  <span v-else class="text-h6 font-weight-medium">{{
                    "---------------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.license") }}
                  </span>

                  <VImg
                    v-if="
                      store.getMemberDetails.business_support_center_member
                        ?.license
                    "
                    style="
                      max-width: 100%;
                      height: 300px;
                      width: 300px;
                      border-radius: 8px;
                    "
                    :src="
                      getAssetUploadedFilesPath(
                        store.getMemberDetails.business_support_center_member
                          ?.license
                      )
                    "
                  />
                  <span v-else class="text-h6 font-weight-medium">{{
                    "---------------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Attach the project logo") }}
                  </span>

                  <VImg
                    v-if="
                      store.getMemberDetails.business_support_center_member
                        ?.project_logo
                    "
                    style="
                      max-width: 100%;
                      height: 300px;
                      width: 300px;
                      border-radius: 8px;
                    "
                    :src="
                      getAssetUploadedFilesPath(
                        store.getMemberDetails.business_support_center_member
                          ?.project_logo
                      )
                    "
                  />
                  <span v-else class="text-h6 font-weight-medium">{{
                    "---------------------"
                  }}</span>
                </div>
              </div>
            </VCol>

            <VCol cols="12">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.A brief overview of the project in Arabic") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.project_description_ar
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="12">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{
                      $t("common.A brief overview of the project in English")
                    }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.business_support_center_member
                      ?.project_description_en
                  }}</span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
