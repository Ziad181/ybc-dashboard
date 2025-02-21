<script setup>
import { useMessagesStore } from "@/stores/message";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useMessagesStore();

const filteredData = ref({
  search: "",
  is_read: null,
  page: 1,
  per_page: 10,
});

onMounted(() => {
  store.loadMessages(filteredData);
});

const status = [
  {
    title: t("common.read"),
    id: 1,
  },
  {
    title: t("common.unread"),
    id: 0,
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
    store.loadMessages(filteredData);
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  store.loadMessages(filteredData);
};

const onper_pageChange = (data) => {
  filteredData.value.per_page = data;
  store.loadMessages(filteredData);
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.messages')">
          <!-- 👉 Filters -->
          <VCardText>
            <VRow>
              <!-- 👉 Search -->
              <VCol cols="12" sm="10">
                <VTextField
                  v-model="filteredData.search"
                  :placeholder="$t('common.search')"
                  density="compact"
                  @update:modelValue="onFilter"
                />
              </VCol>
              <VCol
                cols="12"
                sm="2"
                class="d-md-flex justify-space-between ps-0"
              >
                <VBtn
                  class="px-7 w-100"
                  variant="outlined"
                  prepend-icon="mdi-filter-plus-outline"
                  @click="isFilterOrdersVisible = !isFilterOrdersVisible"
                >
                  {{ $t("common.filter") }}
                </VBtn>
              </VCol>
              <!-- 👉 Select Status -->
              <VCol v-if="isFilterOrdersVisible" cols="12" sm="3">
                <VSelect
                  v-model="filteredData.is_read"
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
                  {{ $t("common.sender_name") }}
                </th>
                <th scope="col">
                  {{ $t("common.sender_phone") }}
                </th>
                <th scope="col">
                  {{ $t("common.service_type") }}
                </th>
                <th scope="col">
                  {{ $t("common.status") }}
                </th>
                <th scope="col">
                  {{ $t("common.created_at") }}
                </th>
                <th scope="col" />
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="(item, index) in store.getMessages"
                :key="index"
                style="height: 3.75rem"
              >
                <!-- 👉 Order -->
                <td>
                  {{ index + 1  }}
                </td>
                <td>
                  {{ item.name }}
                </td>
                <td>
                  {{ item.phone }}
                </td>
                <td>
                  {{ $t(`common.${item.service_type}`) }}
                </td>

                <td>
                  <VChip
                    label
                    :color="
                      resolveDataStatusVariant(
                        item.is_read == 1 ? 'actived' : 'stopped'
                      )
                    "
                    size="small"
                    class="text-capitalize"
                  >
                    {{
                      item.is_read == 1
                        ? $t("common.read")
                        : $t("common.unread")
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

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          :title="$t('common.view_details')"
                          :to="{
                            name: 'messages-view-id',
                            params: { id: item.id },
                          }"
                        />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!store.getMessages.length">
              <tr>
                <td colspan="7" class="text-center">
                  {{ $t("common.no_data_available") }}
                </td>
              </tr>
            </tfoot>
          </VTable>
          <VDivider />

          <VCardText
            v-if="store.getTotalMessages.currentPage"
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
              v-model="store.getTotalMessages.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalMessages.totalPages"
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
