import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useArticlesStore = defineStore({
  id: "articles",
  state: () => ({
    articles: [],
    totalArticles: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    articleDetails: null,
  }),
  getters: {
    getArticles: state => state.articles,
    getTotalArticles: state => state.totalArticles,
    getArticleDetails: state => state.articleDetails,
  },
  actions: {
    async loadArticles(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/articles?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.articles = response.data.data.data;
            this.totalArticles.currentPage = response.data.data.current_page;
            this.totalArticles.totalItems = response.data.data.total;
            this.totalArticles.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadArticleDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/articles/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.articleDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeArticle(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/articles/create`, data, {
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
    async updateArticle(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/articles/update/${data.id}`, data, {
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
    async articleChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/articles/toggle/${data.id}`, data)
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
    async deleteArticle(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/articles/delete/${data.id}`)
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
