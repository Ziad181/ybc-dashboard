import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const usePartnershipsStore = defineStore({
  id: "partnerships",
  state: () => ({
    partnerships: [],
    totalPartnerships: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    partnershipDetails: null,
  }),
  getters: {
    getPartnerships: state => state.partnerships,
    getTotalPartnerships: state => state.totalPartnerships,
    getPartnershipDetails: state => state.partnershipDetails,
  },
  actions: {
    async loadPartnerships(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/partnerships?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.partnerships = response.data.data.data;
            this.totalPartnerships.currentPage = response.data.data.current_page;
            this.totalPartnerships.totalItems = response.data.data.total;
            this.totalPartnerships.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadPartnershipDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/partnerships/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.partnershipDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storePartnership(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/partnerships/create`, data, {
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
    async updatePartnership(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/partnerships/update/${data.id}`, data, {
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
    async partnershipChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/partnerships/toggle/${data.id}`, data)
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
    async deletePartnership(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/partnerships/delete/${data.id}`)
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
