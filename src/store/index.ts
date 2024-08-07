import useLocationStore from "@/store/states/location";
import useUserStore from "@/store/states/user";
import useAuthStore from "@/store/states/auth";
import useModuleStore from "@/store/states/module";
import useCustomerStore from "@/store/states/customer";
import useLoanStore from "@/store/states/loan";
import useMiscStore from "@/store/states/misc";
import usePostingStore from "@/store/states/posting";

const useStore = () => {
  const userStore = useUserStore();
  const moduleStore = useModuleStore();
  const authStore = useAuthStore();
  const locationStore = useLocationStore();
  const customerStore = useCustomerStore();
  const loanStore = useLoanStore();
  const miscStore = useMiscStore();
  const postingStore = usePostingStore();

  return {
    userStore,
    moduleStore,
    authStore,
    postingStore,
    locationStore,
    customerStore,
    loanStore,
    miscStore,
  };
};

export default useStore;
