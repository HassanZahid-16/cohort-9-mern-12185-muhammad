import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {getCurrentUser,logoutUser,} from "../services/authService";

const USER_KEY = "notes_app_user";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedUser = localStorage.getItem(USER_KEY);
      if (!storedUser) {
        if (isMounted) {
          setIsLoading(false);
        }
        return;
      }
      try {
        const validatedUser = await getCurrentUser();
        if (!isMounted) {
          return;
        }
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          localStorage.removeItem(USER_KEY);
        }
      } catch {
        if (isMounted) {
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else if (!isLoading) {
      localStorage.removeItem(USER_KEY);
    }
  }, [user, isLoading]);

  const login = (authData) => {
    setUser(authData.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;