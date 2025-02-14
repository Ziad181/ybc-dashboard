import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const usePageContentStore = defineStore({
  id: "pageContent",
  state: () => ({
    pageContent: [],
    pageContentDetails: null,
  }),
  getters: {
    getPageContent: state => state.pageContent,
    getPageContentDetails: state => state.pageContentDetails,
  },
  actions: {
    async loadPageContent(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/page-content`,
          {
            params: data,
          }
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.pageContent = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadPageContentDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/page-content/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.pageContentDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
   
    async addPageContent(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/page-content/create`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.$notificationMessage({
              title: this.$t("success_messages.save_successfully"),
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
    async updatePageContent(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/page-content/update/${data.id}`, data, {
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

    async deleteContent(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/page-content/delete/${data.id}`)
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
