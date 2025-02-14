import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useBooksStore = defineStore({
  id: "books",
  state: () => ({
    books: [],
    totalBooks: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    bookDetails: null,
  }),
  getters: {
    getBooks: state => state.books,
    getTotalBooks: state => state.totalBooks,
    getBookDetails: state => state.bookDetails,
  },
  actions: {
    async loadBooks(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/books?page=${data.value.page}&per_page=${data.value.per_page}&status=${
            data.value.status != null ? data.value.status : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.books = response.data.data.data;
            this.totalBooks.currentPage = response.data.data.current_page;
            this.totalBooks.totalItems = response.data.data.total;
            this.totalBooks.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadBookDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/books/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.bookDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async storeBook(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/books/create`, data, {
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
    async updateBook(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/books/update/${data.id}`, data, {
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
    async bookChangeStatus(data) {
      store.loadingStart();
      await this.$http
        .post(`/admin/books/toggle/${data.id}`, data)
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
    async deleteBook(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/books/delete/${data.id}`)
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
