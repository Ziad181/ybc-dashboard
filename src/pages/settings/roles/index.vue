<!-- eslint-disable semi -->
<script setup>
import { onMounted, ref } from "vue";
import { useRoleStore } from "@/stores/role";
import { avatarText } from "@core/utils/formatters";
import { useI18n } from "vue-i18n";
import i18n from "@/plugins/i18n";

const { t } = useI18n(); //
const store = useRoleStore();

const filteredData = ref({
  search: "",
  page: 1,
  perPage: 10,
});

onMounted(() => {
  store.loadRoles(filteredData);
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
const isdeleteRoleModalVisible = ref(false);
const isDataModalVisible = ref("");

const onFilter = () => {
  setTimeout(() => {
    store.loadRoles(filteredData);
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  store.loadRoles(filteredData);
};

const onPerPageChange = (data) => {
  filteredData.value.perPage = data;
  store.loadRoles(filteredData);
};

const deleteRole = (id) => {
  let data = {
    id: id,
  };
  store.deleteRoles(data).then(() => {
    isdeleteRoleModalVisible.value = false;
    store.loadRoles(filteredData);
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
              {{ $t("common.roles") }}
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
                <VBtn class="px-5 w-100" :to="{ name: 'settings-roles-add' }">
                  {{ $t("common.add_role") }}
                </VBtn>
              </VCol>
            </VRow>
          </VCardText>

          <VTable class="text-no-wrap">
            <!-- 👉 table head -->
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">
                  {{ $t("common.name") }}
                </th>
                <th scope="col">
                  {{ $t("common.permissions_count") }}
                </th>
                <th scope="col" />
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="(item, index) in store.getRoles"
                :key="index"
                style="height: 3.75rem"
              >
                <td>
                 {{ index + 1  }}
                </td>
                <td>
                  {{ item.name }}
                </td>
                <td>
                  {{ item.permissions?.length }}
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
                            name: 'settings-roles-edit-id',
                            params: { id: item.id },
                          }"
                        />
                        <VListItem
                          :title="$t('common.delete')"
                          @click="
                            isdeleteRoleModalVisible =
                              !isdeleteRoleModalVisible;
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
            <tfoot v-show="!store.getRoles.length">
              <tr>
                <td colspan="7" class="text-center">
                  {{ $t("common.no_data_available") }}
                </td>
              </tr>
            </tfoot>
          </VTable>
          <!-- Dialog -->
          <VDialog v-model="isdeleteRoleModalVisible" class="v-dialog-sm">
            <!-- Dialog close btn -->
            <VBtn
              icon
              class="v-dialog-close-btn"
              @click="isdeleteRoleModalVisible = !isdeleteRoleModalVisible"
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
                  @click="isdeleteRoleModalVisible = false"
                >
                  {{ $t("common.cancel") }}
                </VBtn>
                <VBtn @click="deleteRole(isDataModalVisible.id)" color="error">
                  {{ $t("common.delete") }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
          <VDivider />

          <VCardText
            v-if="store.getTotalRoles.currentPage"
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
              v-model="store.getTotalRoles.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalRoles.totalPages"
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
