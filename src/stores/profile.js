import {
  defineStore
} from "pinia"
import {
  useAppsStore
} from './app'

export const useProfileStore = defineStore({
  id: "profile",
  state: () => ({
    userInfo: null,
    userPermissions: [],
  }),
  getters: {
    getUserInfo: state => state.userInfo,
    getUserPermissions: state => state.userPermissions,
  },
  actions: {
    async loadUserInfo() {
      const userApp = useAppsStore()

      userApp.loadingStart()
      await this.$http.get(`admin/profile`).then(response => {
        userApp.loadingFinish()
        if (response.status === 200) {
          this.userInfo = response.data.data;
          this.userPermissions = response.data.data.permissions;
        }


      }).catch(error => {
        userApp.loadingFinish()
        throw error
      })
    },
    async updateProfile(data) {
      const userApp = useAppsStore()

      userApp.loadingStart()

      return await this.$http.post(`admin/profile/update`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }).then(response => {
        userApp.loadingFinish()
        this.$notificationMessage({
          title: this.$t('success_messages.update_profile_successfully'),
          type: "success",
        });
        return true
      }).catch(error => {
        userApp.loadingFinish()
        throw error
      })
    },
    async changePassword(data) {
      const userApp = useAppsStore()

      userApp.loadingStart()

      return await this.$http.post(`admin/profile/change-password`, data).then(response => {
        userApp.loadingFinish()
        this.$notificationMessage({
          title: this.$t('success_messages.change_password_successfully'),
          type: "success",
        });
        return true
      }).catch(error => {
        userApp.loadingFinish()
        throw error
      })
    },
  },
})
