import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useBoardCommitteesStore = defineStore({
  id: "BoardCommittees",
  state: () => ({
    committees: [],
    totalCommittees: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    committeeDetails: null,
  }),
  getters: {
    getCommittees: state => state.committees,
    getTotalCommittees: state => state.totalCommittees,
    getCommitteeDetails: state => state.committeeDetails,
  },
  actions: {
    async loadCommittees(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/board-committees?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.committees = response.data.data.data;
            this.totalCommittees.currentPage = response.data.data.current_page;
            this.totalCommittees.totalItems = response.data.data.total;
            this.totalCommittees.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadCommitteeDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/board-committees/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.committeeDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storCommittee(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/board-committees/create`, data, {
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
    async updateCommittee(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/board-committees/update/${data.id}`, data, {
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
    async committeeChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/board-committees/toggle/${data.id}`, data)
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
    async deleteCommittee(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/board-committees/delete/${data.id}`)
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
