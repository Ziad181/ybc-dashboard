<script setup>
import { useNewsStore } from "@/stores/news";
import { useUtilityStore } from "@/stores/utility";
import CardStatisticsVertical from "@core/components/CardStatisticsVertical.vue";
import { avatarText } from "@core/utils/formatters";
import { storeToRefs } from "pinia";
import { onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { getAssetUploadedFilesPath } from "@/helpers/assets";

const { t } = useI18n(); //
const store = useNewsStore();
const storeUtility = useUtilityStore();
const statisticsVertical = ref([
  {
    title: t("common.total_member"),
    color: "#303778",
    icon: "tabler-users",
    stats: "0",
    height: 90,
    series: [
      {
        data: [200, 60, 300, 140, 230, 120, 400],
      },
    ],
    chartOptions: {
      chart: {
        height: 90,
        type: "area",
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      tooltip: { enabled: false },
      markers: {
        colors: "transparent",
        strokeColors: "transparent",
      },
      grid: { show: false },
      colors: ["#303778"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.6,
          opacityTo: 0.1,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      xaxis: {
        show: true,
        lines: { show: false },
        labels: { show: false },
        stroke: { width: 0 },
        axisBorder: { show: false },
      },
      yaxis: {
        stroke: { width: 0 },
        show: false,
      },
    },
  },
  {
    title: t("common.total_conferences"),
    color: "#303778",
    icon: "tabler-brand-office",
    stats: "0",
    height: 90,
    series: [
      {
        data: [300, 350, 330, 380, 340, 400, 380],
      },
    ],
    chartOptions: {
      chart: {
        height: 90,
        type: "area",
        parentHeightOffset: 0,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      tooltip: { enabled: false },
      markers: {
        colors: "transparent",
        strokeColors: "transparent",
      },
      grid: { show: false },
      colors: ["#303778"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.6,
          opacityTo: 0.1,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      xaxis: {
        show: true,
        lines: { show: false },
        labels: { show: false },
        stroke: { width: 0 },
        axisBorder: { show: false },
      },
      yaxis: {
        stroke: { width: 0 },
        show: false,
      },
    },
  },
  {
    title: t("common.total_seminar"),
    color: "#303778",
    icon: "tabler-article",
    stats: "0",
    height: 90,
    series: [
      {
        data: [300, 350, 330, 380, 340, 400, 380],
      },
    ],
    chartOptions: {
      chart: {
        height: 90,
        type: "area",
        parentHeightOffset: 0,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      tooltip: { enabled: false },
      markers: {
        colors: "transparent",
        strokeColors: "transparent",
      },
      grid: { show: false },
      colors: ["#303778"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.6,
          opacityTo: 0.1,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      xaxis: {
        show: true,
        lines: { show: false },
        labels: { show: false },
        stroke: { width: 0 },
        axisBorder: { show: false },
      },
      yaxis: {
        stroke: { width: 0 },
        show: false,
      },
    },
  },
  {
    title: t("common.total_workshops"),
    color: "#303778",
    icon: "tabler-settings-check",
    stats: "0",
    height: 90,
    series: [
      {
        data: [300, 350, 330, 380, 340, 400, 380],
      },
    ],
    chartOptions: {
      chart: {
        height: 90,
        type: "area",
        parentHeightOffset: 0,
        toolbar: { show: false },
        sparkline: { enabled: true },
      },
      tooltip: { enabled: false },
      markers: {
        colors: "transparent",
        strokeColors: "transparent",
      },
      grid: { show: false },
      colors: ["#303778"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0.8,
          opacityFrom: 0.6,
          opacityTo: 0.1,
        },
      },
      dataLabels: { enabled: false },
      stroke: {
        width: 2,
        curve: "smooth",
      },
      xaxis: {
        show: true,
        lines: { show: false },
        labels: { show: false },
        stroke: { width: 0 },
        axisBorder: { show: false },
      },
      yaxis: {
        stroke: { width: 0 },
        show: false,
      },
    },
  },
]);

const resolveDataStatusVariant = (stat) => {
  if (stat === "pending") return "warning";
  if (stat === "complete") return "success";
  if (stat === "actived") return "success";
  if (stat === "stopped") return "warning";
  if (stat === "processed") return "primary";
  if (stat === "canceled") return "error";
  return "primary";
};

const filteredData = ref({
  search: "",
  status: null,
  page: 1,
  per_page: 6,
});
const { getDashboard } = storeToRefs(storeUtility);

watch(getDashboard, () => {
  statisticsVertical.value[0].stats = getDashboard.value?.total_member;
  statisticsVertical.value[1].stats = getDashboard.value?.total_conferences;
  statisticsVertical.value[2].stats = getDashboard.value?.total_seminar;
  statisticsVertical.value[3].stats = getDashboard.value?.total_workshops;
});

onMounted(() => {
  store.loadNews(filteredData);
  storeUtility.loadDashboard().then((res) => {
    if (res) {
      statisticsVertical.value[0].stats = getDashboard.value?.total_member;
      statisticsVertical.value[1].stats = getDashboard.value?.total_conferences;
      statisticsVertical.value[2].stats = getDashboard.value?.total_seminar;
      statisticsVertical.value[3].stats = getDashboard.value?.total_workshops;
    }
  });
});
</script>

<template>
  <VRow>
    <VCol
      v-for="(statistics, index) in statisticsVertical"
      :key="index"
      cols="12"
      sm="6"
      md="4"
      lg="3"
    >
      <CardStatisticsVertical v-bind="statistics" />
    </VCol>
    <VCol cols="12">
      <VCard :title="$t('common.last_news')">
        <VTable class="text-no-wrap">
          <!-- 👉 table head -->
          <thead>
            <tr>
              <th scope="col">#</th>
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
          <tbody>
            <tr
              v-for="(item, index) in store.getNews"
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
                    <span v-else>{{ avatarText(item.title) }}</span>
                  </VAvatar>
                  {{ item.title }}
                </div>
              </td>

              <td class="pt-2 pb-3">
                <div v-html="item.content.substring(0, 100) + '...'"></div>
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
                          name: 'news-edit-id',
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
          <tfoot v-show="!store.getNews.length">
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
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
