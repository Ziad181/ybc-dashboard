import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useClientsStore = defineStore({
  id: "clients",
  state: () => ({
    clients: [],
    totalClients: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    clientDetails: null,
  }),
  getters: {
    getClients: state => state.clients,
    getTotalClients: state => state.totalClients,
    getClientDetails: state => state.clientDetails,
  },
  actions: {
    async loadClients(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/clients?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.clients = response.data.data.data;
            this.totalClients.currentPage = response.data.data.current_page;
            this.totalClients.totalItems = response.data.data.total;
            this.totalClients.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadClientDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/clients/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.clientDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeClient(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/clients/create`, data, {
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
    async updateClient(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/clients/update/${data.id}`, data, {
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
    async clientChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/clients/toggle/${data.id}`, data)
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
    async deleteClient(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/clients/delete/${data.id}`)
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
