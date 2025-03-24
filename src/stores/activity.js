import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useActivityStore = defineStore({
  id: "activities",
  state: () => ({
    activities: [],
    totalActivities: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    activityDetails: null,
  }),
  getters: {
    getActivities: state => state.activities,
    getTotalActivities: state => state.totalActivities,
    getActivityDetails: state => state.activityDetails,
  },
  actions: {
    async loadActivities(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/activities?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}&type=${
            data.value.type != null ? data.value.type : ""
          }`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.activities = response.data.data.data;
            this.totalActivities.currentPage = response.data.data.current_page;
            this.totalActivities.totalItems = response.data.data.total;
            this.totalActivities.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadActivityDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/activities/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.activityDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeActivity(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/activities/create`, data, {
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
    async updateActivity(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/activities/update/${data.id}`, data, {
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
    async activitiesChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/activities/toggle/${data.id}`, data)
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
    async deleteActivities(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/activities/delete/${data.id}`)
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
