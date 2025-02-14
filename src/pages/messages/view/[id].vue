<script setup>
import { ref, onMounted, watch } from "vue";
import { useMessagesStore } from "@/stores/message";
import { useRouter, useRoute } from "vue-router";
import i18n from "@/plugins/i18n";

const store = useMessagesStore();
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
  store.loadMessageDetails(route.params.id);
});
</script>

<template>
  <VRow v-if="store.getMessageDetails">
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
            {{ $t("common.message_details") }}
          </h4>
        </div>
        <VCardText>
          <VRow>
            <VCol cols="6" md="3">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.sender_name") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMessageDetails.name
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.sender_phone") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMessageDetails.phone
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.service_type") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    $t(`common.${item.service_type}`)
                  }}</span>
                </div>
              </div>
            </VCol>
            <VCol cols="6" md="3">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.created_at") }}
                  </span>
                  <span class="text-h6 font-weight-medium">
                    {{
                      $filters.moment(
                        store.getMessageDetails.created_at,
                        "YYYY-MM-DD, h:mm:ss A"
                      ) || "unknown"
                    }}</span
                  >
                </div>
              </div>
            </VCol>
            <VCol cols="12">
              <div class="d-flex">
                <div class="d-flex flex-column">
                  <span class="text-caption">
                    {{ $t("common.message") }}
                  </span>
                  <span class="text-h6 font-weight-medium">{{
                    store.getMessageDetails.message
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
