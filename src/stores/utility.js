import {
  defineStore
} from "pinia"
import {
  useAppsStore
} from "@/stores/app"

const store = useAppsStore()
export const useUtilityStore = defineStore({
  id: "utilities",
  state: () => ({
    contactDetails : null,
    dashboard: null,
  }),
  getters: {
    getContactDetails: state => state.contactDetails,
    getDashboard: state => state.dashboard,
  },
  actions: {
    async loadContactDetails() {
      store.loadingStart()

      return await this.$http.get(`/admin/contact-details`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.contactDetails = response.data.data
          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

    async updateContactDetails(data) {
      store.loadingStart()

      return await this.$http.post(`/admin/contact-details/update`, data).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.$notificationMessage({
            title: this.$t('success_messages.edit_successfully'),
            type: "success",
          });
          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

    async updateStatistics(data) {
      store.loadingStart()

      return await this.$http.post(`/admin/contact-details/statistics/update`, data).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.$notificationMessage({
            title: this.$t('success_messages.edit_successfully'),
            type: "success",
          });
          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

    async loadDashboard() {
      store.loadingStart()
      return await this.$http.get(`/admin/dashboard`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.dashboard = response.data.data;
          return true;
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

  },
})
