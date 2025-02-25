import { create } from "zustand";

const useUserStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("userjson")) || { 
    id: null, fullname: "", username: "", password: "", avatar: "", usertype: "", user_assigned_subject: [] 
  },

  setUser: (userData) => {
    localStorage.setItem("userjson", JSON.stringify(userData));
    set({ user: userData });
  },

  updateAvatar: (avatarUrl) =>
    set((state) => ({
      user: { ...state.user, avatar: avatarUrl },
    })), // Update only avatar
  clearUser: () =>
    set({
      user: {
        id: null,
        fullname: "",
        username: "",
        password: "",
        avatar: "",
        usertype: "",
        user_assigned_subject: [],
      },
    }),
}));

export default useUserStore;
