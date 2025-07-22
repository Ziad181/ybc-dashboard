<script setup>
import { useArticlesStore } from "@/stores/articles";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";
import { VueDraggableNext } from "vue-draggable-next";

const { t } = useI18n(); //
const store = useArticlesStore();

const tableData = ref([]);
const filteredData = ref({
  search: "",
  status: null,
  page: 1,
  per_page: 10,
});
const loadArticlesFun = () => {
  store.loadArticles(filteredData).then((response) => {
    tableData.value = store.getArticles;
  });
};

onMounted(() => {
  loadArticlesFun();
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
    loadArticlesFun();
  }, 500);
};

const onPageChange = (data) => {
  filteredData.value.page = data;
  loadArticlesFun();
};

const onper_pageChange = (data) => {
  filteredData.value.per_page = data;
  loadArticlesFun();
};

const changeStatus = (id, status) => {
  let data = {
    id: id,
    status: status == 0 ? 1 : 0,
  };
  store.articleChangeStatus(data);
  isChangeStatusModalVisible.value = false;
  setTimeout(() => {
    loadArticlesFun();
  }, 1000);
};

const deleteArticleFun = (id, status) => {
  let data = {
    id: id,
  };
  store.deleteArticle(data);
  isDeleteModalVisible.value = false;
  setTimeout(() => {
    loadArticlesFun();
  }, 1000);
};

const onDragEnd = (event) => {
  let newIndex = event.newIndex;
  let oldIndex = event.oldIndex;

  let item = tableData.value[newIndex];

  let _data = {
    id: item.id,
    old_order: oldIndex + 1,
    new_order: newIndex + 1,
    page: filteredData.value.page,
    per_page: filteredData.value.per_page,
  };

  store.updateDataOrder(_data);
};
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.articles')">
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
                <VBtn class="px-7" :to="{ name: 'blog-articles-add' }">
                  {{ $t("common.add_article") }}
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
                <th scope="col"></th>
                <th scope="col">#</th>
                <th scope="col">
                  {{ $t("common.The name of the author of the article") }}
                </th>
                <th scope="col">
                  {{ $t("common.title") }}
                </th>
                <th scope="col">
                  {{ $t("common.content") }}
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
            <!-- <tbody> -->
            <VueDraggableNext
              tag="tbody"
              :list="store.getArticles"
              @end="onDragEnd"
            >
              <template v-for="(item, index) in store.getArticles" :key="index">
                <tr style="height: 3.75rem">
                  <!-- 👉 Order -->
                  <td style="cursor: pointer">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M10 5C10 3.9 9.1 3 8 3C6.9 3 6 3.9 6 5C6 6.1 6.9 7 8 7C9.1 7 10 6.1 10 5Z"
                        fill="#7D89B0"
                      />
                      <path
                        d="M10 19C10 17.9 9.1 17 8 17C6.9 17 6 17.9 6 19C6 20.1 6.9 21 8 21C9.1 21 10 20.1 10 19Z"
                        fill="#7D89B0"
                      />
                      <path
                        d="M10 12C10 10.9 9.1 10 8 10C6.9 10 6 10.9 6 12C6 13.1 6.9 14 8 14C9.1 14 10 13.1 10 12Z"
                        fill="#7D89B0"
                      />
                      <path
                        d="M18 5C18 3.9 17.1 3 16 3C14.9 3 14 3.9 14 5C14 6.1 14.9 7 16 7C17.1 7 18 6.1 18 5Z"
                        fill="#7D89B0"
                      />
                      <path
                        d="M18 19C18 17.9 17.1 17 16 17C14.9 17 14 17.9 14 19C14 20.1 14.9 21 16 21C17.1 21 18 20.1 18 19Z"
                        fill="#7D89B0"
                      />
                      <path
                        d="M18 12C18 10.9 17.1 10 16 10C14.9 10 14 10.9 14 12C14 13.1 14.9 14 16 14C17.1 14 18 13.1 18 12Z"
                        fill="#7D89B0"
                      />
                    </svg>
                  </td>
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
                      {{ item.name }}
                    </div>
                  </td>
                  <td class="pt-2 pb-3">
                    <div v-html="item.title"></div>
                  </td>
                  <td class="pt-2 pb-3">
                    <div v-html="item.content.substring(0, 50) + '...'"></div>
                  </td>
                  <td class="pt-2 pb-3">
                    {{
                      $filters.moment(
                        item.created_at,
                        "YYYY-MM-DD, h:mm:ss A"
                      ) || "unknown"
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
                              name: 'blog-articles-edit-id',
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
              </template>
            </VueDraggableNext>
            <!-- </tbody>-->

            <!-- 👉 table footer  -->
            <tfoot v-show="!store.getArticles.length">
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
                    deleteArticleFun(
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
            v-if="store.getTotalArticles.currentPage"
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
              v-model="store.getTotalArticles.currentPage"
              size="small"
              :total-visible="5"
              :length="store.getTotalArticles.totalPages"
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
