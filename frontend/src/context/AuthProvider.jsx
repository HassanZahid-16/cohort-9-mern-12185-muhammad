import { useEffect, useMemo, useState } from "react";
import AuthContext from "./AuthContext";
import {getCurrentUser,logoutUser,} from "../services/authService";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to restore authentication session:", error);
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

  const login = (authData) => {
    setUser(authData.user);
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      logout,
    }),
    [user, isLoading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;