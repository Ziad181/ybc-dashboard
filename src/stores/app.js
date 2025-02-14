import { defineStore } from "pinia"

export const useAppsStore = defineStore({
  id: "apps",
  state: () => ({
    errors: {},
    loading: false,
  }),
  getters: {
    getErrors: state => state.errors,
    getloading: state => state.loading,
  },
  actions: {
    async setErrors(errors) {
      this.errors = errors
    },
    async loadingStart () {
      this.loading = true
    },
    async loadingFinish() {
      this.loading = false
    },
    
  },
})
