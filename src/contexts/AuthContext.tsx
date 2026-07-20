import { createContext, useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogle,
  logout as logoutService,
  getOrCreateUserProfile,
} from "../services/authService";
import type { AppUser } from "../types/user";

interface AuthContextValue {
  user: AppUser | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<AppUser>;
  login: (email: string, password: string) => Promise<AppUser>;
  loginGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const appUser = await getOrCreateUserProfile(firebaseUser);
      setUser(appUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email: string, password: string): Promise<AppUser> => {
    const appUser = await registerWithEmail(email, password);
    setUser(appUser);
    return appUser;
  };

  const login = async (email: string, password: string): Promise<AppUser> => {
    const appUser = await loginWithEmail(email, password);
    setUser(appUser);
    return appUser;
  };

  const loginGoogle = async () => {
    const appUser = await loginWithGoogle();
    setUser(appUser);
  };

  const logout = async () => {
    await logoutService();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, register, login, loginGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}