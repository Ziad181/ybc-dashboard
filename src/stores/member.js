import {
  defineStore
} from "pinia"
import {
  useAppsStore
} from "@/stores/app"

const store = useAppsStore()
export const useMemberStore = defineStore({
  id: "members",
  state: () => ({
    members: [],
    totalMembers: {
      currentPage: null,
      totalItems: null,
      totalPages: null,
    },
    memberDetails: null,
  }),
  getters: {
    getMembers: state => state.members,
    getTotalMembers: state => state.totalMembers,
    getMemberDetails: state => state.memberDetails,
  },
  actions: {
    async loadMembers(data) {
      store.loadingStart()
      await this.$http.get(`/admin/members?page=${data.value.page}&perPage=${data.value.perPage}&status=${data.value.status != null ? data.value.status : ''}&type=${data.value.type != null ? data.value.type : ''}&search=${data.value.search}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.members = response.data.data.data;
          this.totalMembers.currentPage = response.data.data.current_page;
          this.totalMembers.totalItems = response.data.data.total;
          this.totalMembers.totalPages = response.data.data.last_page;
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

    async loadMemberDetails(id) {
      store.loadingStart()

      return await this.$http.get(`/admin/members/detail/${id}`).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.memberDetails = response.data.data

          return true
        }

      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

     async storMember(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/members/create`, data, {
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
    async updateMember(data) {
      store.loadingStart();

      return await this.$http
        .post(`/admin/members/update/${data.id}`, data, {
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

    // change/status
    async changeStatus(data) {
      store.loadingStart()
      return await this.$http.post(`/admin/members/change/status`, data).then(response => {
        store.loadingFinish()
        if (response.status === 200) {
          this.$notificationMessage({
            title: this.$t("success_messages.change_status_successfully"),
            type: "success",
          });
          return true
        }
      }).catch(error => {
        store.loadingFinish()
        throw error
      })
    },

    async deleteMembers(data) {
      store.loadingStart();
      await this.$http
        .delete(`/admin/members/delete/${data.id}`)
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
})
