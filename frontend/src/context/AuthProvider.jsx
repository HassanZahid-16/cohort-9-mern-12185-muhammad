import { useEffect, useState } from "react";
import AuthContext from "./AuthContext";

const TOKEN_KEY = "notes_app_token";
const USER_KEY = "notes_app_user";

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    return localStorage.getItem(TOKEN_KEY);
  });

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem(USER_KEY);
    if (!storedUser) {
      return null;
    }
    try {
      return JSON.parse(storedUser);
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  }, [user]);

  const login = (authData) => {
    setToken(authData.token);
    setUser(authData.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  const value = {token,user,isAuthenticated: Boolean(token),login,logout,};

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;