import router from "@/router"
import { useAppsStore } from "@/stores/app"
import { defineStore } from "pinia"
import { useCookies } from "vue3-cookies"

const { cookies } = useCookies()
const store = useAppsStore()


export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({}),
  getters: {},
  actions: {
    async login(data) {
      store.loadingStart()
      await this.$http.post("/auth/login", data).then(response => {
        if (response.status === 200) {

          const responseData = {
            ...response.data.data,
          }

          this.$http.defaults.headers.common.Authorization = `Bearer ${responseData.token?.access_token}`
          cookies.set("yBCLoginData",JSON.stringify(responseData))
          let userAbilities = [
            {
              action: 'manage',
              subject: 'all',
            },
          ]
          cookies.set('yBCAbilities', JSON.stringify(userAbilities))
          setTimeout(() => {
            window.location.reload()
          }, 200)

          store.loadingFinish()
            
          return response.data
        }
      })
        .catch(error => {
          store.loadingFinish()
          throw error
        })
    },
    async logout({ commit }) {
      
      store.loadingStart()
      cookies.remove("yBCLoginData")
      cookies.remove("yBCAbilities")
      cookies.remove("yBCLoginData");
      cookies.remove("yBCLoginData", "/");
      cookies.remove("yBCLoginData", "/ar");
      cookies.remove("yBCLoginData", "/en");
      const loginData = cookies.get("yBCLoginData", {
        parseJSON: true,
      })

      if (!loginData) {        
        // this.$http.defaults.headers.common.Authorization = undefined
        router.push({
          name: "login",
        })
        setTimeout(() => {
          window.location.reload()
        }, 200)
      }
    },
  },
})
