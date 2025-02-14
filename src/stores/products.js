import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useProductsStore = defineStore({
  id: "products",
  state: () => ({
    products: [],
    totalProducts: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    productDetails: null,
  }),
  getters: {
    getProducts: state => state.products,
    getTotalProducts: state => state.totalProducts,
    getProductDetails: state => state.productDetails,
  },
  actions: {
    async loadProducts(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/products?page=${data.value.page}&per_page=${data.value.per_page}&is_feature=${data.value.is_feature}&status=${data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}&section=${data.value.section}&partnership_id=${data.value.partnership_id ?? ''}
          &category_id=${data.value.category ? data.value.category?.id : ''}
          &sub_category_id=${data.value.sub_category_id ?? ''}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.products = response.data.data.data;
            this.totalProducts.currentPage = response.data.data.current_page;
            this.totalProducts.totalItems = response.data.data.total;
            this.totalProducts.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadProductDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/products/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.productDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeProduct(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/products/create`, data, {
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
    async updateProduct(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/products/update/${data.id}`, data, {
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
    async productChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/products/toggle/${data.id}`, data)
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
    async deleteProduct(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/products/delete/${data.id}`)
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
