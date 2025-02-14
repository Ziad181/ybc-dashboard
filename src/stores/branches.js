import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useBranchesStore = defineStore({
  id: "branches",
  state: () => ({
    branches: [],
    totalBranches: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    branchDetails: null,
  }),
  getters: {
    getBranches: state => state.branches,
    getTotalBranches: state => state.totalBranches,
    getBranchDetails: state => state.branchDetails,
  },
  actions: {
    async loadBranches(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/branches?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.branches = response.data.data.data;
            this.totalBranches.currentPage = response.data.data.current_page;
            this.totalBranches.totalItems = response.data.data.total;
            this.totalBranches.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadBranchDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/branches/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.branchDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeBranch(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/branches/create`, data, {
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
    async updateBranch(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/branches/update/${data.id}`, data, {
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
    async branchChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/branches/toggle/${data.id}`, data)
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
    async deleteBranch(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/branches/delete/${data.id}`)
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
