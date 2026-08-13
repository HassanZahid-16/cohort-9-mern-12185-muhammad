import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";
import {getCurrentUser,logoutUser,} from "../services/authService";

const USER_KEY = "notes_app_user";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const validatedUser = await getCurrentUser();
        if (!isMounted) {
          return;
        }
        if (validatedUser) {
          setUser(validatedUser);
        } else {
          localStorage.removeItem(USER_KEY);
          setUser(null);
        }
        setAuthError(null);
      } catch (error) {
        if (isMounted) {
          setAuthError(error.message);
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
    setAuthError(null);
  };

  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      setAuthError(null);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    authError,
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