import { create } from "zustand";

const useAuthStore = create((set) => ({
  userId: localStorage.getItem("userid") || null, // Persist on reload
  setUserId: (id) => {
    localStorage.setItem("userid", id); // Save to localStorage
    set({ userId: id });
  },
  logout: () => {
    localStorage.removeItem("userid");
    set({ userId: null });
  },
}));

export default useAuthStore;
