<script setup>
import { useActivityStore } from "@/stores/activity";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useActivityStore();

const filteredData = ref({
  search: "",
  status: null,
  type: null,
  page: 1,
  per_page: 10,
});

onMounted(() => {
  store.loadActivities(filteredData);
});

const status = [
  {
    title: t("common.actived"),
    id: 1,
  },
  {
    title: t("common.stopped"),
    id: 0,
  },
];
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

const isFilterOrdersVisible = ref(false);
const isChangeStatusModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isDataModalVisible = ref("");

const resolveDataStatusVariant = (stat) => {
  if (stat === "pending") return "warning";
  if (stat === "complete") return "success";
  if (stat === "actived") return "success";
  if (stat === "stopped") return "warning";
  if (stat === "processed") return "primary";
  if (stat === "canceled") return "error";
  return "primary";
};

const onFilter = () => {
  setTimeout(() => {
    store.loadActivities(filteredData);
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  store.loadActivities(filteredData);
};

const onper_pageChange = (data) => {
  filteredData.value.per_page = data;
  store.loadActivities(filteredData);
};

const changeStatus = (id, status) => {
  let data = {
    id: id,
    status: status == 0 ? 1 : 0,
  };
  store.activitiesChangeStatus(data);
  isChangeStatusModalVisible.value = false;
  setTimeout(() => {
    store.loadActivities(filteredData);
  }, 1000);
};

const deleteActivitiesFun = (id, status) => {
  let data = {
    id: id,
  };
  store.deleteActivities(data);
  isDeleteModalVisible.value = false;
  setTimeout(() => {
    store.loadActivities(filteredData);
  }, 1000);
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.activities')">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Search -->
              <VCol cols="12" sm="9">
                <VTextField
                  v-model="filteredData.search"
                  :placeholder="$t('common.search')"
                  density="compact"
                  @update:modelValue="onFilter"
                />
              </VCol>
              <VCol
                cols="12"
                sm="3"
                class="d-md-flex justify-space-between ps-0"
              >
                <VBtn
                  class="px-7"
                  variant="outlined"
                  prepend-icon="mdi-filter-plus-outline"
                  @click="isFilterOrdersVisible = !isFilterOrdersVisible"
                >
                  {{ $t("common.filter") }}
                </VBtn>
                <VBtn class="px-7" :to="{ name: 'activities-add' }">
                  {{ $t("common.add_activity") }}
                </VBtn>
              </VCol>
              <VCol v-if="isFilterOrdersVisible" cols="12" sm="3">
                <VSelect
                  v-model="filteredData.type"
                  :placeholder="$t('common.select_type')"
                  :items="types"
                  item-text="title"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                  @update:modelValue="onFilter"
                />
              </VCol>
              <!-- 👉 Select Status -->
              <VCol v-if="isFilterOrdersVisible" cols="12" sm="3">
                <VSelect
                  v-model="filteredData.status"
                  :placeholder="$t('common.select_status')"
                  :items="status"
                  item-text="title"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                  @update:modelValue="onFilter"
                />
              </VCol>
            </VRow>
          </VCardText>

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">
                  {{ $t("common.title") }}
                </th>
                <th scope="col">
                  {{ $t("common.type") }}
                </th>
                <th scope="col">
                  {{ $t("common.Activity date") }}
                </th>
                <th scope="col">
                  {{ $t("common.available") }}
                </th>
                <th scope="col">
                  {{ $t("common.created_at") }}
                </th>
                <th scope="col">
                  {{ $t("common.status") }}
                </th>
                <th scope="col" />
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="(item, index) in store.getActivities"
                :key="index"
                style="height: 3.75rem"
              >
                <!-- 👉 Order -->
                <td>
                  {{ index + 1 }}
                </td>
                <td>
                  <div class="d-flex align-center">
                    <VAvatar
                      variant="tonal"
                      :color="resolveDataStatusVariant('actived').color"
                      class="me-3"
                      size="38"
                    >
                      <VImg
                        v-if="item.images && item.images.length > 0"
                        :src="getAssetUploadedFilesPath(item.images[0])"
                      />
                      <span v-else>{{ avatarText(item.title) }}</span>
                    </VAvatar>
                    {{ item.title }}
                  </div>
                </td>

                <td class="pt-2 pb-3">
                  {{ $t(`common.` + item.type) }}
                </td>
                <td class="pt-2 pb-3">
                  {{
                    $filters.moment(item.date, "YYYY-MM-DD, h:mm:ss A") ||
                    "unknown"
                  }}
                </td>
                <td class="pt-2 pb-3">
                  <VChip
                    label
                    :color="
                      resolveDataStatusVariant(
                        item.is_available == 1 ? 'actived' : 'stopped'
                      )
                    "
                    size="small"
                    class="text-capitalize"
                  >
                    {{
                      item.is_available == 1
                        ? $t("common.available")
                        : $t("common.Not available")
                    }}
                  </VChip>
                </td>
                <td class="pt-2 pb-3">
                  {{
                    $filters.moment(item.created_at, "YYYY-MM-DD, h:mm:ss A") ||
                    "unknown"
                  }}
                </td>

                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="
                      resolveDataStatusVariant(
                        item.is_active == 1 ? 'actived' : 'stopped'
                      )
                    "
                    size="small"
                    class="text-capitalize"
                  >
                    {{
                      item.is_active == 1
                        ? $t("common.actived")
                        : $t("common.stopped")
                    }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          :title="$t('common.edit')"
                          :to="{
                            name: 'activities-edit-id',
                            params: { id: item.id },
                          }"
                        />
                        <VListItem
                          v-if="item.is_active == 0"
                          :title="$t('common.activation')"
                          @click="
                            isChangeStatusModalVisible =
                              !isChangeStatusModalVisible;
                            isDataModalVisible = item;
                          "
                        />
                        <VListItem
                          v-else
                          :title="$t('common.suspended')"
                          @click="
                            isChangeStatusModalVisible =
                              !isChangeStatusModalVisible;
                            isDataModalVisible = item;
                          "
                        />

                        <VListItem
                          :title="$t('common.delete')"
                          @click="
                            isDeleteModalVisible = !isDeleteModalVisible;
                            isDataModalVisible = item;
                          "
                        />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!store.getActivities.length">
              <tr>
                <td colspan="7" class="text-center">
                  {{ $t("common.no_data_available") }}
                </td>
              </tr>
            </tfoot>
          </VTable>
          <!-- Dialog -->
          <VDialog v-model="isChangeStatusModalVisible" class="v-dialog-sm">
            <!-- Dialog close btn -->
            <VBtn
              icon
              class="v-dialog-close-btn"
              @click="isChangeStatusModalVisible = !isChangeStatusModalVisible"
            >
              <VIcon icon="tabler-x" />
            </VBtn>

            <VCard
              :title="
                isDataModalVisible.is_active == 0
                  ? $t('common.Activation confirmation')
                  : $t('common.Suspend confirmation')
              "
            >
              <VCardText>
                {{
                  isDataModalVisible.is_active == 0
                    ? $t("common.Are you sure about the activation process?")
                    : $t("common.Are you sure about the suspension process?")
                }}
              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="isChangeStatusModalVisible = false"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
                <VBtn
                  @click="
                    changeStatus(
                      isDataModalVisible.id,
                      isDataModalVisible.is_active
                    )
                  "
                >
                  {{
                    isDataModalVisible.is_active == 0
                      ? $t("common.activation")
                      : $t("common.suspended")
                  }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>

          <!-- Dialog -->
          <VDialog v-model="isDeleteModalVisible" class="v-dialog-sm">
            <!-- Dialog close btn -->
            <VBtn
              icon
              class="v-dialog-close-btn"
              @click="isDeleteModalVisible = !isDeleteModalVisible"
            >
              <VIcon icon="tabler-x" />
            </VBtn>

            <VCard :title="$t('common.Delete confirmation')">
              <VCardText>
                {{ $t("common.Are you sure about the delete process?") }}
              </VCardText>

              <VCardText class="d-flex justify-end flex-wrap gap-3">
                <VBtn
                  variant="tonal"
                  color="secondary"
                  @click="isDeleteModalVisible = false"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
                <VBtn
                  color="error"
                  @click="
                    deleteActivitiesFun(
                      isDataModalVisible.id,
                      isDataModalVisible.is_active
                    )
                  "
                >
                  {{ $t("common.delete") }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
          <VDivider />

          <VCardText
            v-if="store.getTotalActivities.currentPage"
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
            <div class="d-flex align-center flex-wrap justify-space-between">
              <VSelect
                v-model="filteredData.per_page"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
                @update:modelValue="onper_pageChange"
              />
            </div>

            <VPagination
              v-model="store.getTotalActivities.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalActivities.totalPages"
              @update:modelValue="onPageChange"
            />
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </section>
</template>

<style lang="scss">
.app-user-search-filter {
  inline-size: 31.6rem;
}

.text-capitalize {
  text-transform: capitalize;
}

.user-list-name:not(:hover) {
  color: rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity));
}
</style>
