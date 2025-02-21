import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useManagementStore = defineStore({
  id: "management",
  state: () => ({
    employees: [],
    totalEmployees: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    employeeDetails: null,
  }),
  getters: {
    getEmployees: state => state.employees,
    getTotalEmployees: state => state.totalEmployees,
    getEmployeeDetails: state => state.employeeDetails,
  },
  actions: {
    async loadEmployees(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/management?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}&type=${data.value.type}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.employees = response.data.data.data;
            this.totalEmployees.currentPage = response.data.data.current_page;
            this.totalEmployees.totalItems = response.data.data.total;
            this.totalEmployees.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadEmployeeDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/management/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.employeeDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storEmployee(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/management/create`, data, {
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
    async updateEmployee(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/management/update/${data.id}`, data, {
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
    async employeeChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/management/toggle/${data.id}`, data)
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
    async deleteEmployee(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/management/delete/${data.id}`)
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
