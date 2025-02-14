import i18n from '@/plugins/i18n';
import router from "@/router";
import {
    useAppsStore
} from "@/stores/app";
import axios from "axios";
import {
    useCookies
} from "vue3-cookies";
const {
  cookies
} = useCookies()
const baseURL =
  import.meta.env.VITE_API_URL
const language =
  i18n.global.locale.value ?? "ar";

const axiosInstance = app => {
  let notify = app.config.globalProperties.$notificationMessage;

  app.config.globalProperties.$http = axios.create({
    baseURL: baseURL,
    headers: {
      "locale": language,
      "Content-Type": "application/json;  charset=UTF-8",
    },
  })

  let $http = app.config.globalProperties.$http;

  $http.interceptors.request.use(request => {
    // Update token axios header
    const authToken = request.headers.Authorization
    if (!authToken) {
      const loginData = cookies.get("yBCLoginData", {
        parseJSON: true,
      })

      if (loginData) {
        request.headers.Authorization = `Bearer ${loginData.token?.access_token}`
      }
    }

    return request
  })



  $http.interceptors.response.use(
    (response) => {
      const appsStore = useAppsStore();

      appsStore.setErrors({});
      return response;
    },
    (error) => {
      switch (error.response.status) {
        case 401:
          var loginData = cookies.get("yBCLoginData");
          if (loginData) {
            // todo logout
            if (i == 1) notify({
              title: app.config.globalProperties.$t('error_messages.401'),
              type: "fail"
            });
          }
          cookies.remove("yBCLoginData");
          cookies.remove("yBCLoginData", "/");
          cookies.remove("yBCLoginData", "/ar");
          cookies.remove("yBCLoginData", "/en");
          router.push({
            name: "login",
          });
          break;

        case 400:
          if (error.response.data.data && error.response.data.data.code) {
            notify({
              title: error.response.data.data.code ? app.config.globalProperties.$t('error_messages.' + error.response.data.data.code) : app.config.globalProperties.$t('error_messages.500'),
              type: "fail",
            });
            break;
          } else if (!error.response.data.data && error.response.data.message == 'Debt Amount in not equal to the provided amount') {
            notify({
              title: app.config.globalProperties.$t('error_messages.Debt Amount in not equal to the provided amount'),
              type: "fail",
            });
            break;
          }

          case 403:
          case 404:
            notify({
              title: app.config.globalProperties.$t('error_messages.404'),
              type: "fail",
            });
            break;
          case 422:
            const appsStore = useAppsStore();

            appsStore.setErrors(error.response.data.data);

            notify({
              title: app.config.globalProperties.$t('error_messages.422'),
              type: "fail",
            });
            break;
          default:
            notify({
              title: app.config.globalProperties.$t('error_messages.500'),
              type: "fail",
            });
      }
      //handel errors here
      return Promise.reject(error);
    }
  );
  return app.config.globalProperties.$http;
};
export default axiosInstance;
