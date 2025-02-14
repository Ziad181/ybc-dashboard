import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useCategoriesStore = defineStore({
  id: "categories",
  state: () => ({
    categories: [],
    totalCategories: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    categoryDetails: null,
  }),
  getters: {
    getCategories: state => state.categories,
    getTotalCategories: state => state.totalCategories,
    getCategoryDetails: state => state.categoryDetails,
  },
  actions: {
    async loadCategories(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/categories?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}&section=${data.value.section}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.categories = response.data.data.data;
            this.totalCategories.currentPage = response.data.data.current_page;
            this.totalCategories.totalItems = response.data.data.total;
            this.totalCategories.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadCategoryDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/categories/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.categoryDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeCategory(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/categories/create`, data, {
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
    async updateCategory(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/categories/update/${data.id}`, data, {
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
    async categoryChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/categories/toggle/${data.id}`, data)
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
    async deleteCategory(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/categories/delete/${data.id}`)
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
