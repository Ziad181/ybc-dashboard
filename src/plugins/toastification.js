import Toast, {
  useToast
} from "vue-toastification";
import ToastificationContent from "@/layouts/components/Toastification.vue";

const toastification = (app) => {
  const toast = useToast();
  app.use(Toast, {
    hideProgressBar: true,
    closeOnClick: true,
    closeButton: false,
    icon: false,
    timeout: 3000,
    transition: "Vue-Toastification__fade",
  });
  return (app.config.globalProperties.$notificationMessage = (data) =>
    toast({
      component: ToastificationContent,
      props: {
        title: data.title,
      },
    }, {
      toastClassName: data.type + "-class",
      position: "bottom-left",
    }));
};
export default toastification;
