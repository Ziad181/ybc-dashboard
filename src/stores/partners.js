import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const usePartnersStore = defineStore({
  id: "partners",
  state: () => ({
    partners: [],
    totalPartners: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    partnerDetails: null,
  }),
  getters: {
    getPartners: state => state.partners,
    getTotalPartners: state => state.totalPartners,
    getPartnerDetails: state => state.partnerDetails,
  },
  actions: {
    async loadPartners(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/partners?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.partners = response.data.data.data;
            this.totalPartners.currentPage = response.data.data.current_page;
            this.totalPartners.totalItems = response.data.data.total;
            this.totalPartners.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadPartnerDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/partners/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.partnerDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storePartner(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/partners/create`, data, {
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
    async updatePartner(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/partners/update/${data.id}`, data, {
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
    async partnerChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/partners/toggle/${data.id}`, data)
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
    async deletePartner(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/partners/delete/${data.id}`)
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
