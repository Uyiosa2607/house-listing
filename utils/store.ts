import { create } from "zustand";
import { createClient } from "./supabase/client";

type User = {
  name: string;
  email: string;
  id: string;
  img: string | null;
  role: string;
};

interface useStore {
  userInfo: User | null;
  auth: boolean;
  loading: boolean;
  fetchUser: () => Promise<void>;
}

const useStore = create<useStore>((set) => ({
  userInfo: null,
  auth: false,
  loading: true,

  fetchUser: async () => {
    const supabase = createClient();

    set({ loading: true });

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("Session error:", error);
        set({ loading: false });
        return;
      }

      if (user?.id) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", user?.id)
          .single();

        if (error) {
          console.error("Error fetching user from DB:", error.message);
          set({ loading: false, auth: false, userInfo: null });
        } else if (data) {
          set({ userInfo: data, auth: true, loading: false });
        } else {
          set({ loading: false, auth: false, userInfo: null });
        }
      } else {
        set({ userInfo: null, auth: false, loading: false });
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
      set({ loading: false });
    }
  },
}));

export { useStore };
