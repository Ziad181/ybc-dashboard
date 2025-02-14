<script setup>
import i18n from "@/plugins/i18n";
import { useBranchesStore } from "@/stores/branches";
import {
  requiredValidator
} from "@validators";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const { t } = useI18n(); //
const router = useRouter();
const store = useBranchesStore();
const refInputEl = ref();
const refVForm = ref();
const images = ref("");
const isMapModalVisible = ref(false);

const centerAddress = ref({
  lat: 15.3694,
  lng: 44.191,
});
const formData = ref({
  name_ar: "",
  name_en: "",
  address: "",
  geo_location: {
    lat: 15.3694,
    lng: 44.191,
  },
});

const resetMap = () => {
  geolocate();
};

const geolocate = () => {
  navigator.geolocation.getCurrentPosition((position) => {
    centerAddress.value.lat = parseFloat(position.coords.latitude);
    centerAddress.value.lng = parseFloat(position.coords.longitude);
  });
};

const updateCenter = (location) => {
  if (location != null) {
    centerAddress.value.lat = parseFloat(location.latLng.lat());
    centerAddress.value.lng = parseFloat(location.latLng.lng());
  }
};

const saveLocation = () => {
  formData.value.geo_location.lat = parseFloat(centerAddress.value.lat);
  formData.value.geo_location.lng = parseFloat(centerAddress.value.lng);
  isMapModalVisible.value = false;
};

const onSubmitForm = () => {
  refVForm.value?.validate().then(({ valid: isValid }) => {
    if (isValid) {
      store.storeBranch(formData.value).then((res) => {
        router.push({
          name: "settings-branches",
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
              {{ $t("common.add_branch") }}
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
              <VCol cols="12">
                <VTextField
                  v-model="formData.address"
                  :label="$t('common.address')"
                  :rules="[requiredValidator]"
                />
              </VCol>

              <VCol cols="12">
                <VDivider class="mb-5" />

                <div class="d-flex align-center mt-3 mb-5">
                  <h4 class="text-h6 font-weight-bold mmb-0">
                    {{ $t("common.Location of the branch on the map") }}:
                  </h4>
                  <VBtn
                    @click="isMapModalVisible = !isMapModalVisible"
                    class="mx-3"
                  >
                    {{ $t("common.edit") }}
                  </VBtn>
                </div>
                <GMapMap
                  :center="{
                    lat: formData.geo_location.lat,
                    lng: formData.geo_location.lng,
                  }"
                  :zoom="15"
                  map-type-id="terrain"
                  style="width: 100%; height: 500px"
                >
                  <GMapMarker
                    :position="{
                      lat: formData.geo_location.lat,
                      lng: formData.geo_location.lng,
                    }"
                  />
                </GMapMap>
                <!-- Dialog -->
                <VDialog v-model="isMapModalVisible" class="v-dialog-lg">
                  <!-- Dialog close btn -->
                  <VBtn
                    icon
                    class="v-dialog-close-btn"
                    @click="isMapModalVisible = !isMapModalVisible"
                  >
                    <VIcon icon="tabler-x" />
                  </VBtn>

                  <VCard :title="$t('common.Location Edit')">
                    <VCardText
                      class="d-flex justify-end flex-wrap gap-3 position-relative"
                    >
                      <button class="mapBtn" @click="resetMap()">
                        <svg
                          id="gps"
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <g id="gps-2" data-name="gps">
                            <path
                              id="Vector"
                              d="M7.5-.75A8.25,8.25,0,1,1-.75,7.5,8.259,8.259,0,0,1,7.5-.75Zm0,15A6.75,6.75,0,1,0,.75,7.5,6.758,6.758,0,0,0,7.5,14.25Z"
                              transform="translate(4.5 4.5)"
                              fill="#ffffff"
                            />
                            <path
                              id="Vector-2"
                              data-name="Vector"
                              d="M3-.75A3.75,3.75,0,1,1-.75,3,3.754,3.754,0,0,1,3-.75Zm0,6A2.25,2.25,0,1,0,.75,3,2.253,2.253,0,0,0,3,5.25Z"
                              transform="translate(9 9)"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <path
                              id="Vector-3"
                              data-name="Vector"
                              d="M0,2.75A.75.75,0,0,1-.75,2V0A.75.75,0,0,1,0-.75.75.75,0,0,1,.75,0V2A.75.75,0,0,1,0,2.75Z"
                              transform="translate(12 2)"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <path
                              id="Vector-4"
                              data-name="Vector"
                              d="M2,.75H0A.75.75,0,0,1-.75,0,.75.75,0,0,1,0-.75H2A.75.75,0,0,1,2.75,0,.75.75,0,0,1,2,.75Z"
                              transform="translate(2 12)"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <path
                              id="Vector-5"
                              data-name="Vector"
                              d="M0,2.75A.75.75,0,0,1-.75,2V0A.75.75,0,0,1,0-.75.75.75,0,0,1,.75,0V2A.75.75,0,0,1,0,2.75Z"
                              transform="translate(12 20)"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <path
                              id="Vector-6"
                              data-name="Vector"
                              d="M2,.75H0A.75.75,0,0,1-.75,0,.75.75,0,0,1,0-.75H2A.75.75,0,0,1,2.75,0,.75.75,0,0,1,2,.75Z"
                              transform="translate(20 12)"
                              fill="#ffffff"
                              opacity="0.4"
                            />
                            <path
                              id="Vector-7"
                              data-name="Vector"
                              d="M0,0H24V24H0Z"
                              transform="translate(24 24) rotate(180)"
                              fill="none"
                              opacity="0"
                            />
                          </g>
                        </svg>
                      </button>
                      <GMapMap
                        style="width: 100%; height: 500px"
                        :center="{
                          lat: centerAddress.lat,
                          lng: centerAddress.lng,
                        }"
                        :zoom="15"
                        map-type-id="roadmap"
                        @click="updateCenter"
                        :options="{
                          zoomControl: true,
                          mapTypeControl: false,
                          scaleControl: false,
                          streetViewControl: false,
                          rotateControl: false,
                          fullscreenControl: true,
                          disableDefaultUi: false,
                        }"
                      >
                        <GMapMarker
                          :position="{
                            lat: centerAddress.lat,
                            lng: centerAddress.lng,
                          }"
                          :clickable="true"
                          :draggable="true"
                          @dragend="updateCenter"
                        />
                      </GMapMap>
                      <VBtn type="button" class="w-100" @click="saveLocation">
                        {{ $t("common.save") }}
                      </VBtn>
                    </VCardText>
                  </VCard>
                </VDialog>
              </VCol>

              <!-- 👉 Form Actions -->
              <VCol cols="12" class="d-flex flex-wrap gap-4">
                <VBtn type="submit">{{ $t("common.save") }}</VBtn>

                <VBtn
                  color="secondary"
                  variant="tonal"
                  type="reset"
                  :to="{ name: 'settings-branches' }"
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
