import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useBannersStore = defineStore({
  id: "banners",
  state: () => ({
    banners: [],
    totalBanners: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    bannerDetails: null,
  }),
  getters: {
    getBanners: state => state.banners,
    getTotalBanners: state => state.totalBanners,
    getBannerDetails: state => state.bannerDetails,
  },
  actions: {
    async loadBanners(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/banners?page=${data.value.page}&per_page=${data.value.per_page}&status=${data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}&section=${data.value.section != null ? data.value.section : ""}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.banners = response.data.data.data;
            this.totalBanners.currentPage = response.data.data.current_page;
            this.totalBanners.totalItems = response.data.data.total;
            this.totalBanners.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadBannerDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/banners/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.bannerDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeBanner(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/banners/create`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.$notificationMessage({
              title: this.$t("success_messages.saved_successfully"),
              type: "success",
            });
            return true;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async updateBanner(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/banners/update/${data.id}`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.$notificationMessage({
              title: this.$t("success_messages.edit_successfully"),
              type: "success",
            });
            return true;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async bannerChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/banners/toggle/${data.id}`, data)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.$notificationMessage({
              title: this.$t("success_messages.change_status_successfully"),
              type: "success",
            });
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async deleteBanner(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/banners/delete/${data.id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.$notificationMessage({
              title: this.$t("success_messages.delete_successfully"),
              type: "success",
            });
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
  },
});
