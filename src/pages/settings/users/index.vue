<!-- eslint-disable semi -->
<script setup>
import { onMounted, ref } from "vue";
import { useUserStore } from "@/stores/user";
import { useRoleStore } from "@/stores/role";
import { avatarText } from "@core/utils/formatters";
import { useI18n } from "vue-i18n";
import i18n from "@/plugins/i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useUserStore();
const roleStore = useRoleStore();
const isdeleteUserModalVisible = ref(false);
const filteredData = ref({
  search: "",
  role: null,
  status: null,
  page: 1,
  perPage: 10,
});

onMounted(() => {
  store.loadUsers(filteredData);
  const roleData = ref({
    search: "",
    page: 1,
    perPage: 10000,
  });
  roleStore.loadRoles(roleData);
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
const isDataModalVisible = ref("");

const onFilter = () => {
  setTimeout(() => {
    store.loadUsers(filteredData);
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  store.loadUsers(filteredData);
};

const onPerPageChange = (data) => {
  filteredData.value.perPage = data;
  store.loadUsers(filteredData);
};

const changeStatus = (id, status) => {
  let data = {
    id: id,
    status: status == 0 ? 1 : 0,
  };
  store.userChangeStatus(data);
  isChangeStatusModalVisible.value = false;
  setTimeout(() => {
    store.loadUsers(filteredData);
  }, 1000);
};

const deleteUser = (id) => {
  let data = {
    id: id,
  };
  store.deleteUser(data).then(() => {
    isdeleteUserModalVisible.value = false;
    store.loadUsers(filteredData);
  });
};
</script>

<template>
  <section>
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
              {{ $t("common.users") }}
            </h4>
          </div>
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
                <VBtn class="px-5" :to="{ name: 'settings-users-add' }">
                  {{ $t("common.add_user") }}
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
                v-for="(item, index) in store.getUsers"
                :key="index"
                style="height: 3.75rem"
              >
                <td>
                 {{ item.id }}
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
                      <span class="text-sm text-disabled">
                        {{ item.role_name ?? "-----" }}</span
                      >
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
                <td class="text-center" style="width: 5rem" v-if="item.id != 1">
                  <VBtn icon size="x-small" color="default" variant="text">
                    <VIcon size="22" icon="tabler-dots-vertical" />

                    <VMenu activator="parent">
                      <VList>
                        <VListItem
                          :title="$t('common.edit')"
                          :to="{
                            name: 'settings-users-edit-id',
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
                            isdeleteUserModalVisible =
                              !isdeleteUserModalVisible;
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
            <tfoot v-show="!store.getUsers.length">
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
                isDataModalVisible.status == 0
                  ? $t('common.Activation confirmation')
                  : $t('common.Suspend confirmation')
              "
            >
              <VCardText>
                {{
                  isDataModalVisible.status == 0
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
                      isDataModalVisible.status
                    )
                  "
                >
                  {{
                    isDataModalVisible.status == 0
                      ? $t("common.activation")
                      : $t("common.suspended")
                  }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
          <VDialog v-model="isdeleteUserModalVisible" class="v-dialog-sm">
            <!-- Dialog close btn -->
            <VBtn
              icon
              class="v-dialog-close-btn"
              @click="isdeleteUserModalVisible = !isdeleteUserModalVisible"
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
                  @click="isdeleteUserModalVisible = false"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
                <VBtn @click="deleteUser(isDataModalVisible.id)" color="error">
                  {{ $t("common.delete") }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
          <VDivider />

          <VCardText
            v-if="store.getTotalUsers.currentPage"
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
              v-model="store.getTotalUsers.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalUsers.totalPages"
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
