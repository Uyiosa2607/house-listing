import { create } from "zustand";
import { createClient } from "./supabase/client";

type User = {
  name: string;
  email: string;
  id: string;
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
  loading: false,

  fetchUser: async () => {
    const supabase = createClient();

    set({ loading: true });

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Session error:", sessionError);
        set({ loading: false });
        return;
      }

      if (session?.user) {
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (error) {
          console.error("Error fetching user from DB:", error.message);
          set({ loading: false, auth: false, userInfo: null });
        } else if (data) {
          set({ userInfo: data, auth: true, loading: false });
          console.log("User data set:", data);
        } else {
          console.warn("No user data returned from the database");
          set({ loading: false, auth: false, userInfo: null });
        }
      } else {
        console.warn("No session found, user is not logged in.");
        set({ userInfo: null, auth: false, loading: false });
      }
    } catch (error) {
      console.error("Error in fetchUser:", error);
      set({ loading: false });
    }
  },
}));

export { useStore };
