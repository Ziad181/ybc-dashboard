import {
  defineStore
} from "pinia"
import {
  useAppsStore
} from "@/stores/app"

const store = useAppsStore()
export const useUserStore = defineStore({
  id: "users",
  state: () => ({
    users: [],
    roles: [],
    permissions: [],
    totalUsers: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    userDetails: null,
  }),
  getters: {
    getUsers: state => state.users,
    getRoles: state => state.roles,
    getPermissions: state => state.permissions,
    getTotalUsers: state => state.totalUsers,
    getUserDetails: state => state.userDetails,
  },
  actions: {
    async loadUsers(data) {
      store.loadingStart()
      await this.$http.get(`/admin/admins?page=${data.value.page}&perPage=${data.value.perPage}&status=${data.value.status != null ? data.value.status : ''}&user_role=${data.value.role != null ? data.value.role : ''}&search=${data.value.search}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.users = response.data.data.data;
          this.totalUsers.currentPage = response.data.data.current_page;
          this.totalUsers.totalItems = response.data.data.total;
          this.totalUsers.totalPages = response.data.data.last_page;
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

    async loadUserDetails(id) {
      store.loadingStart()

      return await this.$http.get(`/admin/admins/detail/${id}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.userDetails = response.data.data

          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
    async storeUser(data) {
      store.loadingStart()

      return await this.$http.post(`/admin/admins/create`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(response => {
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
    async updateUser(data) {
      store.loadingStart()

      return await this.$http.post(`/admin/admins/update/${data.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(response => {
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
    async userChangeStatus(data) {
      store.loadingStart()
      await this.$http.post(`/admin/admins/toggle/${data.id}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.$notificationMessage({
            title: this.$t('success_messages.change_status_successfully'),
            type: "success",
          });
          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },
    async deleteUser(data) {
      store.loadingStart()
     return await this.$http.delete(`/admin/admins/delete/${data.id}`).then(response => {
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
