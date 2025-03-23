<!-- eslint-disable semi -->
<script setup>
import { onMounted, ref } from "vue";
import { useMemberStore } from "@/stores/member";
import { avatarText } from "@core/utils/formatters";
import { useI18n } from "vue-i18n";
import i18n from "@/plugins/i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useMemberStore();
const isdeleteUserModalVisible = ref(false);
const filteredData = ref({
  search: "",
  type: 2,
  status: null,
  page: 1,
  perPage: 10,
});

onMounted(() => {
  store.loadMembers(filteredData);
});

const status = [
  {
    title: t("common.approved"),
    id: "approved",
  },
  {
    title: t("common.rejected"),
    id: "rejected",
  },
  {
    title: t("common.pending"),
    id: "pending",
  },
];

const resolveDataStatusVariant = (stat) => {
  if (stat === "pending") return "warning";
  if (stat === "complete") return "success";
  if (stat === "actived") return "success";
  if (stat === "stopped") return "warning";
  if (stat === "processed") return "primary";
  if (stat === "canceled") return "error";

  return "primary";
};

const isFilterOrdersVisible = ref(false);
const isChangeStatusModalVisible = ref(false);
const newStatus = ref("");
const isDataModalVisible = ref("");

const onFilter = () => {
  setTimeout(() => {
    store.loadMembers(filteredData);
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  store.loadMembers(filteredData);
};

const onPerPageChange = (data) => {
  filteredData.value.perPage = data;
  store.loadMembers(filteredData);
};

const changeStatus = (id, status) => {
  store
    .changeStatus({
      id: id,
      status: status,
    })
    .then(() => {
      store.loadMembers(filteredData);
      isChangeStatusModalVisible.value = false;
      i18n.global.$toast.success(t("common.status_changed_successfully"), {
        timeout: 2000,
      });
    })
    .catch((error) => {
      i18n.global.$toast.error(error.response.data.message);
    });
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard>
          <div class="d-flex align-center pt-5 px-6">
            <h4 class="text-h6 font-weight-bold">
              {{ $t("nav.Members") }}
            </h4>
          </div>
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
                  {{ $t("common.user") }}
                </th>
                <th scope="col">
                  {{ $t("common.email") }}
                </th>
                <th scope="col">
                  {{ $t("common.phone_number") }}
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
                v-for="(item, index) in store.getMembers"
                :key="index"
                style="height: 3.75rem"
              >
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
                        v-if="item.image"
                        :src="getAssetUploadedFilesPath(item.image)"
                      />
                      <span v-else>{{ avatarText(item.name) }}</span>
                    </VAvatar>
                    <div class="d-flex flex-column">
                      {{ item.name }}
                    </div>
                  </div>
                </td>
                <td>{{ item.email }}</td>
                <td>
                  <p dir="ltr" class="mb-0 text-end">
                    {{ item.phone ?? "-----" }}
                  </p>
                </td>
                <!-- 👉 Status -->
                <td>
                  <VChip
                    label
                    :color="
                      resolveDataStatusVariant(
                        item.status == 'approved'
                          ? 'actived'
                          : item.status == 'rejected'
                          ? 'canceled'
                          : 'stopped'
                      )
                    "
                    size="small"
                    class="text-capitalize"
                  >
                    {{ $t(`common.${item.status}`) }}
                  </VChip>
                </td>

                <!-- 👉 Actions -->
                <td class="text-center" style="width: 5rem">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          v-if="item.status == 'pending'"
                          :title="$t('common.rejection')"
                          @click="
                            isChangeStatusModalVisible =
                              !isChangeStatusModalVisible;
                            isDataModalVisible = item;
                            newStatus = 'rejected';
                          "
                        />
                        <VListItem
                          v-if="item.status == 'pending'"
                          :title="$t('common.accept')"
                          @click="
                            isChangeStatusModalVisible =
                              !isChangeStatusModalVisible;
                            isDataModalVisible = item;
                            newStatus = 'approved';
                          "
                        />
                      </VList>
                    </VMenu>
                  </VBtn>
                </td>
              </tr>
            </tbody>

            <!-- 👉 table footer  -->
            <tfoot v-show="!store.getMembers.length">
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
                newStatus == 'rejected'
                  ? $t('common.Rejection confirmation')
                  : $t('common.Accept confirmation')
              "
            >
              <VCardText>
                {{
                  newStatus == "rejected"
                    ? $t("common.rejection_confirmation_text")
                    : $t("common.accept_confirmation_text")
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
                <VBtn @click="changeStatus(isDataModalVisible.id, newStatus)"
        
                :color="newStatus == 'rejected' ? 'error' : 'success'"
                >
                  {{
                    newStatus == "rejected"
                      ? $t("common.rejection")
                      : $t("common.accept")
                  }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
          <VDivider />

          <VCardText
            v-if="store.getTotalMembers.currentPage"
            class="d-flex align-center flex-wrap justify-space-between gap-4 py-3 px-5"
          >
            <div class="d-flex align-center flex-wrap justify-space-between">
              <VSelect
                v-model="filteredData.perPage"
                density="compact"
                variant="outlined"
                :items="[10, 20, 30, 50]"
                @update:modelValue="onPerPageChange"
              />
            </div>

            <VPagination
              v-model="store.getTotalMembers.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalMembers.totalPages"
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
