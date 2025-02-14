<script setup>
import { usePageContentStore } from "@/stores/pageContent";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = usePageContentStore();
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
const deleteItem = (id) => {
  let data = {
    id: id,
  };
  store.deleteContent(data);
  isDeleteModalVisible.value = false;
  setTimeout(() => {
    store.loadPageContent({
      page_slug: "solar-energy",
      section_type: "services",
    });
  }, 1000);
};

onMounted(() => {
  store.loadPageContent({
    page_slug: "solar-energy",
    section_type: "services",
  });
});
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.services')">
          <VCardText>
            <VRow>
              <!-- 👉 Search -->
              <VCol
                cols="12"
                sm="3"
                class="d-md-flex justify-space-between ps-0 ms-auto"
              >
                <VBtn
                  class="px-7 ms-auto"
                  :to="{ name: 'solar-energy-services-add' }"
                >
                  {{ $t("common.add") }}
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
                  {{ $t("common.section_name") }}
                </th>
                <th scope="col">
                  {{ $t("common.description") }}
                </th>

                <th scope="col" />
              </tr>
            </thead>
            <!-- 👉 table body -->
            <tbody>
              <tr
                v-for="(item, index) in store.getPageContent"
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
                        v-if="item.image && item.image.length"
                        :src="getAssetUploadedFilesPath(item.image[0])"
                      />
                      <span v-else>{{ avatarText(item.section_name) }}</span>
                    </VAvatar>
                    {{ item.section_name }}
                  </div>
                </td>
                <td class="pt-2 pb-3">
                  <div v-html="item.description.substring(0, 30) + '...'"></div>
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
                            name: 'solar-energy-services-edit-id',
                            params: { id: item.id },
                          }"
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
            <tfoot v-show="!store.getPageContent.length">
              <tr>
                <td colspan="7" class="text-center">
                  {{ $t("common.no_data_available") }}
                </td>
              </tr>
            </tfoot>
          </VTable>
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
                <VBtn color="error" @click="deleteItem(isDataModalVisible.id)">
                  {{ $t("common.delete") }}
                </VBtn>
              </VCardText>
            </VCard>
          </VDialog>
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
