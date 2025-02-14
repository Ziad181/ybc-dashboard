import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useCategoryDescriptionsStore = defineStore({
  id: "CategoryDescriptions",
  state: () => ({
    categoryDescriptions: [],
    categoryDescriptionsDetails: null,
  }),
  getters: {
    getCategoryDescriptions: state => state.categoryDescriptions,
    getCategoryDescriptionsDetails: state => state.categoryDescriptionsDetails,
  },
  actions: {
    async loadCategoryDescriptions(slug) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/category-descriptions/${slug}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.categoryDescriptions = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadCategoryDescriptionsDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/category-descriptions/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.categoryDescriptionsDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },

    async updateCategoryDescriptions(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/category-descriptions/update/${data.id}`, data, {
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
  },
});
