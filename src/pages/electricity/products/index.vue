<script setup>
import { useProductsStore } from "@/stores/products";
import { usePartnershipsStore } from "@/stores/partnerships";
import { useCategoriesStore } from "@/stores/categories";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useProductsStore();
const partnershipsStore = usePartnershipsStore();
const categoriesStore = useCategoriesStore();
const filterData = ref({
  section: "electricity",
  search: "",
  status: null,
  page: 1,
  per_page: 1000,
});

const filteredData = ref({
  section: "electricity",
  partnership_id: null,
  category: null,
  sub_category_id: null,
  search: "",
  status: null,
  page: 1,
  per_page: 10,
  is_feature: "0",
});

onMounted(() => {
  partnershipsStore.loadPartnerships(filterData);
  categoriesStore.loadCategories(filterData);
  store.loadProducts(filteredData);
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

const isFilterOrdersVisible = ref(false);
const isChangeStatusModalVisible = ref(false);
const isDeleteModalVisible = ref(false);
const isDataModalVisible = ref("");

const resolveDataStatusVariant = (stat) => {
  if (stat === "pending") return "secondary";
  if (stat === "complete") return "success";
  if (stat === "actived") return "success";
  if (stat === "stopped") return "warning";
  if (stat === "processed") return "primary";
  if (stat === "canceled") return "error";
  return "primary";
};

const onFilter = () => {
  setTimeout(() => {
    store.loadProducts(filteredData);
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  store.loadProducts(filteredData);
};

const onper_pageChange = (data) => {
  filteredData.value.per_page = data;
  store.loadProducts(filteredData);
};

const changeStatus = (id, status) => {
  let data = {
    id: id,
    status: status == 0 ? 1 : 0,
  };
  store.productChangeStatus(data);
  isChangeStatusModalVisible.value = false;
  setTimeout(() => {
    store.loadProducts(filteredData);
  }, 1000);
};

const deleteProductFun = (id, status) => {
  let data = {
    id: id,
  };
  store.deleteProduct(data);
  isDeleteModalVisible.value = false;
  setTimeout(() => {
    store.loadProducts(filteredData);
  }, 1000);
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.products')">
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
                <VBtn class="px-7" :to="{ name: 'electricity-products-add' }">
                  {{ $t("common.add_product") }}
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
              <VCol v-if="isFilterOrdersVisible" cols="12" sm="3">
                <VSelect
                  v-model="filteredData.partnership_id"
                  :placeholder="$t('common.Agents')"
                  :items="partnershipsStore.getPartnerships"
                  item-title="title"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                  :disabled="partnershipsStore.getPartnerships.length === 0"
                  @update:modelValue="onFilter"
                />
              </VCol>
              <VCol v-if="isFilterOrdersVisible" cols="12" sm="3">
                <VSelect
                  v-model="filteredData.category"
                  :placeholder="$t('common.category')"
                  :items="categoriesStore.getCategories"
                  item-title="name"
                  clearable
                  return-object
                  clear-icon="tabler-x"
                  :disabled="categoriesStore.getCategories.length === 0"
                  @update:modelValue="onFilter"
                />
              </VCol>
              <VCol v-if="isFilterOrdersVisible" cols="12" sm="3">
                <VSelect
                  v-model="filteredData.sub_category_id"
                  :placeholder="$t('common.sub_categories')"
                  :items="filteredData.category?.sub_categories"
                  item-title="name"
                  item-value="id"
                  clearable
                  clear-icon="tabler-x"
                  :disabled="
                    categoriesStore.getCategories.length === 0 ||
                    !filteredData.category ||
                    filteredData.category === null ||
                    !filteredData.category?.sub_categories ||
                    filteredData.category?.sub_categories.length === 0
                  "
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
                  {{ $t("common.name") }}
                </th>
                <th scope="col">
                  {{ $t("common.Agents") }}
                </th>
                <th scope="col">
                  {{ $t("common.category") }}
                </th>
                <th scope="col">
                  {{ $t("common.sub_categories") }}
                </th>
                <th scope="col">
                  {{ $t("common.added_by") }}
                </th>
                <th scope="col">
                  {{ $t("common.created_at") }}
                </th>
                <th scope="col">
                  {{ $t("common.updated_at") }}
                </th>
                <th scope="col">
                  {{ $t("common.updated_by") }}
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
                v-for="(item, index) in store.getProducts"
                :key="index"
                style="height: 3.75rem"
              >
                <!-- 👉 Order -->
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
                        v-if="item.images && item.images.length > 0"
                        :src="getAssetUploadedFilesPath(item.images[0])"
                      />
                      <span v-else>{{ avatarText(item.name) }}</span>
                    </VAvatar>
                    {{ item.name }}
                  </div>
                </td>
                <td>
                  {{ item.partnership }}
                </td>
                <td>
                  {{ item.category }}
                </td>
                <td>
                  {{ item.sub_category }}
                </td>

                <td class="pt-2 pb-3">
                  {{ item.added_by ? item.added_by.name : "--------" }}
                </td>
                <td class="pt-2 pb-3">
                  {{
                    $filters.moment(item.created_at, "YYYY-MM-DD, h:mm:ss A") ||
                    ""
                  }}
                </td>
                <td class="pt-2 pb-3">
                  {{ item.updated_by ? item.updated_by.name : "--------" }}
                </td>
                <td class="pt-2 pb-3">
                  {{
                    $filters.moment(item.updated_at, "YYYY-MM-DD, h:mm:ss A") ||
                    ""
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
                            name: 'electricity-products-edit-id',
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
            <tfoot v-show="!store.getProducts.length">
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
                    deleteProductFun(
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
            v-if="store.getTotalProducts.currentPage"
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
              v-model="store.getTotalProducts.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalProducts.totalPages"
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
