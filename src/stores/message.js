import { useAppsStore } from "@/stores/app";
import { defineStore } from "pinia";

const store = useAppsStore();
export const useMessagesStore = defineStore({
  id: "messages",
  state: () => ({
    messages: [],
    totalMessages: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    messageDetails: null,
  }),
  getters: {
    getMessages: state => state.messages,
    getTotalMessages: state => state.totalMessages,
    getMessageDetails: state => state.messageDetails,
  },
  actions: {
    async loadMessages(data) {
      store.loadingStart();
      await this.$http
        .get(
          `/admin/email-messages?page=${data.value.page}&per_page=${data.value.per_page}&is_read=${data.value.is_read != null ? data.value.is_read : ""
          }&search=${data.value.search}`
        )
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.messages = response.data.data.data;
            this.totalMessages.currentPage = response.data.data.current_page;
            this.totalMessages.totalItems = response.data.data.total;
            this.totalMessages.totalPages = response.data.data.last_page;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
    async loadMessageDetails(id) {
      store.loadingStart();
      await this.$http
        .get(`/admin/email-messages/detail/${id}`)
        .then(response => {
          store.loadingFinish();
          if (response.status === 200) {
            this.messageDetails = response.data.data;
          }
        })
        .catch(error => {
          store.loadingFinish();
          throw error;
        });
    },
  },
});
