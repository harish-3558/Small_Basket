import { create } from "zustand";

const getStoredUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
};

const initialUser = getStoredUser();
const initialToken = localStorage.getItem("userToken");

const useAuthStore = create((set, get) => ({
  user: initialToken ? initialUser : null,
  isLoggedIn: Boolean(initialToken && initialUser),
  role: initialToken && initialUser ? localStorage.getItem("userRole") || "customer" : null,
  cartCount: 0,

  //  Login
  login: (userData, token, role = "customer") => {
    localStorage.setItem("userToken", token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userRole", role);

    set({
      user: userData,
      isLoggedIn: true,
      role,
    });
  },

  //  Increase cart count
  incrementCart: (count) => {
    const currentCount = get().cartCount;
    set({ cartCount: currentCount + count });
  },

  setCartCount: (count) => {
    set({ cartCount: count });
  },

  //  Logout
logout: () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");
    set({
      user: null,
      isLoggedIn: false,
      role: null,
      cartCount: 0,
    });
},


  //  Restore login after refresh
  initializeAuth: () => {
    const token = localStorage.getItem("userToken");
    const storedUser = localStorage.getItem("user");
    const role = localStorage.getItem("userRole");

    if (token && storedUser) {
      set({
        isLoggedIn: true,
        user: JSON.parse(storedUser),
        role: role || "customer",
      });
    }
  },
}));

export default useAuthStore;
