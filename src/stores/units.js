import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useUnitsStore = defineStore({
  id: "units",
  state: () => ({
    units: [],
    totalUnits: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    unitDetails: null,
  }),
  getters: {
    getUnits: state => state.units,
    getTotalUnits: state => state.totalUnits,
    getUnitDetails: state => state.unitDetails,
  },
  actions: {
    async loadUnits(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/units?page=${data.value.page}&per_page=${data.value.per_page}&status=${data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.units = response.data.data.data;
            this.totalUnits.currentPage = response.data.data.current_page;
            this.totalUnits.totalItems = response.data.data.total;
            this.totalUnits.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadUnitDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/units/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.unitDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeUnit(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/units/create`, data, {
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
    async updateUnit(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/units/update/${data.id}`, data, {
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
    async unitChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/units/toggle/${data.id}`, data)
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
    async deleteUnit(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/units/delete/${data.id}`)
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
