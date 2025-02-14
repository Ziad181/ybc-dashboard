/* eslint-disable import/order */
import {
  createApp,
  markRaw
} from 'vue'
import {
  createPinia
} from "pinia"
import '@/@iconify/icons-bundle'
import VueCookies from 'vue3-cookies'
import VueMoment from 'vue-moment-v3'
import App from '@/App.vue'
import ability from '@/plugins/casl/ability'
import i18n from '@/plugins/i18n'
import layoutsPlugin from '@/plugins/layouts'
import toastification from "@/plugins/toastification";
import axiosInstance from "@/plugins/axios"
import vuetify from '@/plugins/vuetify'
import {
  loadFonts
} from '@/plugins/webfontloader'
import router from '@/router'
import {
  abilitiesPlugin
} from '@casl/vue'
import '@core/scss/template/index.scss'
import '@styles/styles.scss'
import "vue-toastification/dist/index.css";
import VueGoogleMaps from '@fawmi/vue-google-maps'
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import permission from '@/helpers/permissions';

loadFonts()


// Create vue app
const app = createApp(App)
const pinia = createPinia()


pinia.use(({
  store
}) => {
  store.$http = markRaw(app.config.globalProperties.$http)
  store.$notificationMessage = markRaw(app.config.globalProperties.$notificationMessage)
  store.$t = markRaw(app.config.globalProperties.$t)
  store.$filters = markRaw(app.config.globalProperties.$filters)
})

toastification(app);
axiosInstance(app)
app.provide("http", app.config.globalProperties.$http)

app.directive("permission", permission);
// Use plugins
app.use(pinia).use(VueCookies, {
  expireTimes: "30d",
  path: "/",
  // domain: "localhost",
  domain: "dashboard.albakri.com",
  secure: true,
  sameSite: "None",
}).use(VueGoogleMaps, {
  load: {
      key: 'AIzaSyBz-jO2cHx_PTk5Y5pdPY7uKqJig78LceU',
      language: 'ar'
  },
}).use(vuetify).use(VueMoment).use(router).use(layoutsPlugin).use(i18n).use(abilitiesPlugin, ability, {
  useGlobalProperties: true,
}).component('QuillEditor', QuillEditor);
// Mount vue app
app.mount('#app');
