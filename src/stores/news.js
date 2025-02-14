import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useNewsStore = defineStore({
  id: "news",
  state: () => ({
    news: [],
    totalNews: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    newsDetails: null,
  }),
  getters: {
    getNews: state => state.news,
    getTotalNews: state => state.totalNews,
    getNewsDetails: state => state.newsDetails,
  },
  actions: {
    async loadNews(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/news?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.news = response.data.data.data;
            this.totalNews.currentPage = response.data.data.current_page;
            this.totalNews.totalItems = response.data.data.total;
            this.totalNews.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadNewsDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/news/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.newsDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeNews(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/news/create`, data, {
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
    async updateNews(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/news/update/${data.id}`, data, {
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
    async newsChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/news/toggle/${data.id}`, data)
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
    async deleteNews(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/news/delete/${data.id}`)
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
