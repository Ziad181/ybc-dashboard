<script setup>
import { usePageContentStore } from "@/stores/pageContent";
import { avatarText } from "@core/utils/formatters";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = usePageContentStore();
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
  store.loadPageContent({
    page_slug: "business_support_center",
    section_type: ''
  });
});
</script>

<template>
  <section>
    <VRow>
      <VCol cols="12">
        <VCard :title="$t('nav.business_support_center')">
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
                 {{ index + 1  }}
                </td>
                <td>
                  {{ item.section_name }}
                </td>
                <td class="pt-2 pb-3">
                  <div v-html="item.description.substring(0, 50) + '...'"></div>
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
                            name: 'about-us-business-support-center-edit-id',
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
            <tfoot v-show="!store.getPageContent.length">
              <tr>
                <td colspan="7" class="text-center">
                  {{ $t("common.no_data_available") }}
                </td>
              </tr>
            </tfoot>
          </VTable>
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
