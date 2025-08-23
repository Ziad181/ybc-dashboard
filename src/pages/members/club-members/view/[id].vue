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
const openBlock = (file) => {
  const fileUrl = getAssetUploadedFilesPath(file);
  window.open(fileUrl, "_blank");
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
                    store.getMemberDetails.phone || "-------------"
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
                    store.getMemberDetails.club_member?.whatsapp_number ||
                    "-------------"
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
                    store.getMemberDetails.email || "-------------"
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
                    store.getMemberDetails.club_member?.birth_date ||
                    "-------------"
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
                    store.getMemberDetails.club_member?.gender
                      ? $t(
                          "common." + store.getMemberDetails.club_member?.gender
                        )
                      : "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Marital status") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.marital_status
                      ? $t(
                          "common." +
                            store.getMemberDetails.club_member?.marital_status
                        )
                      : "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.payment") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.payment_type
                      ? store.getMemberDetails.club_member?.payment_type ==
                        "subscription_annually"
                        ? $t("common.Pay for a subscription annually $500")
                        : $t("common.Pay a membership fee($100)")
                      : "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.The name of the entity in Arabic") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.entity_name_ar ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.The name of the entity in English") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.entity_name_en ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Office Manager Name") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.office_manager_name ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Office Manager Number") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.office_manager_number ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.The field of business of the entity") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.entity_business_field
                      ? i18n.global.te("common." + store.getMemberDetails.club_member?.entity_business_field)
                        ? $t("common." + store.getMemberDetails.club_member?.entity_business_field)
                        : store.getMemberDetails.club_member?.entity_business_field
                      : "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.position") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.position ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Year of establishment of the entity") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.year_of_establishment ||
                    "-------------"
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
                    store.getMemberDetails.club_member?.number_of_employees ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Entity Primary Address") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.main_address ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.Branches Address") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.sub_address ||
                    "-------------"
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
                    store.getMemberDetails.club_member?.instagram_link ||
                    "-------------"
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="4">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.website_link") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMemberDetails.club_member?.website_link ||
                    "-------------"
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
                    store.getMemberDetails.club_member?.facebook_link ||
                    "-------------"
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
                    store.getMemberDetails.club_member?.x_link ??
                    "-------------"
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
                    store.getMemberDetails.club_member?.linkedin_link ??
                    "-------------"
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

                  <v-card
                    v-if="store.getMemberDetails.club_member?.id_image"
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member?.id_image
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="
                        openBlock(store.getMemberDetails.club_member?.id_image)
                      "
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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

                  <v-card
                    v-if="store.getMemberDetails.club_member?.cv"
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member?.cv
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="openBlock(store.getMemberDetails.club_member?.cv)"
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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
                    {{ $t("common.Attach the commercial registration") }}
                  </span>
                  <v-card
                    v-if="
                      store.getMemberDetails.club_member?.commercial_register
                    "
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member
                            ?.commercial_register
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="
                        openBlock(
                          store.getMemberDetails.club_member
                            ?.commercial_register
                        )
                      "
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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
                    {{ $t("common.Attach the company logo") }}
                  </span>
                  <v-card
                    v-if="store.getMemberDetails.club_member?.entity_logo"
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member?.entity_logo
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="
                        openBlock(
                          store.getMemberDetails.club_member?.entity_logo
                        )
                      "
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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
                    {{ $t("common.Attach the companys profile (profile)") }}
                  </span>
                  <v-card
                    v-if="store.getMemberDetails.club_member?.entity_profile"
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member?.entity_profile
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="
                        openBlock(
                          store.getMemberDetails.club_member?.entity_profile
                        )
                      "
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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
                    {{ $t("common.Attach the Zakat Card") }}
                  </span>
                  <v-card
                    v-if="store.getMemberDetails.club_member?.zakat_card"
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member?.zakat_card
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="
                        openBlock(
                          store.getMemberDetails.club_member?.zakat_card
                        )
                      "
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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
                    {{ $t("common.Attach the tax card") }}
                  </span>
                  <v-card
                    v-if="store.getMemberDetails.club_member?.tax_card"
                    class="position-relative"
                  >
                    <VImg
                      style="
                        max-width: 100%;
                        height: 300px;
                        width: 300px;
                        border-radius: 8px;
                      "
                      :src="
                        getAssetUploadedFilesPath(
                          store.getMemberDetails.club_member?.tax_card
                        )
                      "
                    />
                    <VBtn
                      color="primary"
                      icon="tabler-download"
                      @click="
                        openBlock(store.getMemberDetails.club_member?.tax_card)
                      "
                      style="position: absolute; top: 10px; left: 10px"
                    />
                  </v-card>

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
                    {{ $t("common.Brief description of the entity") }}
                  </span>
                  <span class="text-h6 font-weight-medium" v-html="store.getMemberDetails.club_member?.entity_description || '-------------'"></span>
                </div>
              </div>
            </VCol>
          </VRow>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>
