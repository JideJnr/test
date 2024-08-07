import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface IMiscState {
  spinner: boolean;
}

type MiscAction = IMiscState & {
  setSpinner: (state: boolean) => void;
};

const initialState: IMiscState = {
  spinner: false,
};

const useMiscStore = create<MiscAction>()(
  devtools((set, get) => ({
    ...initialState,

    setSpinner: (state) => {
      set({ spinner: state });
    },
  }))
);

export default useMiscStore;
