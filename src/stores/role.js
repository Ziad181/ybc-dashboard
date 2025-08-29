import {
  useAppsStore
} from "@/stores/app"
import {
  defineStore
} from "pinia"

const store = useAppsStore()
export const useRoleStore = defineStore({
  id: "Roles",
  state: () => ({
    roles: [],
    permissions: [],
    totalRoles: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    rolesDetails: null,
  }),
  getters: {
    getRoles: state => state.roles,
    getPermissions: state => state.permissions,
    getTotalRoles: state => state.totalRoles,
    getRolesDetails: state => state.rolesDetails,
  },
  actions: {
    async loadRoles(data) {
      store.loadingStart()
      await this.$http.get(`/admin/system-roles?page=${data.value.page}&per_page=${data.value.per_page}&search=${data.value.search}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.roles = response.data.data.data
          this.totalRoles.currentPage = response.data.data.current_page
          this.totalRoles.totalItems = response.data.data.total
          this.totalRoles.totalPages = response.data.data.last_page
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
    async loadPermissions(data) {
      store.loadingStart()
      await this.$http.get(`/admin/system-roles/permissions`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.permissions = response.data.data
        }
      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
    async loadRoleDetails(id) {
      store.loadingStart()
      await this.$http.get(`/admin/system-roles/detail/${id}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.rolesDetails = response.data.data
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
    async storeRoles(data) {
      store.loadingStart()

      return await this.$http.post(`/admin/system-roles/create`, data).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.$notificationMessage({
            title: this.$t('success_messages.saved_successfully'),
            type: "success",
          });
          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
    async updateRoles(data) {
      store.loadingStart()

      return await this.$http.put(`/admin/system-roles/update/${data.id}`, data).then(response => {
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
    async deleteRoles(data) {
      store.loadingStart()
     return await this.$http.delete(`/admin/system-roles/delete/${data.id}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.$notificationMessage({
            title: this.$t('success_messages.delete_successfully'),
            type: "success",
          });
          return true;
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
  },
})
