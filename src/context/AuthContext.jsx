import React, { createContext, useState, useContext, useEffect } from "react";
import { signin } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  
 const login = async (username, password) => {
  try {
     const response = await signin(username, password);
     if(response.data){
       localStorage.setItem("token", response.data.access_token);
       localStorage.setItem("user", response.data.username);
     }
     setUser(response.data.username);
     return response;

  } catch (error) {
    console.log("error to login");
    throw error;
  }
 }

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}
