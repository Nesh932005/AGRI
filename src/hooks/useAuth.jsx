import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const loggedInUser = await authService.login(email, password);
    setUser(loggedInUser);
    return loggedInUser;
  };

  const loginFarmer = async (codeOrPhone) => {
    const loggedInFarmer = await authService.loginFarmer(codeOrPhone);
    setUser(loggedInFarmer);
    return loggedInFarmer;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const switchRole = (role) => {
    const switched = authService.switchDemoRole(role);
    setUser({ ...switched });
  };

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff' || isAdmin;
  const isFarmer = user?.role === 'farmer';

  return (
    <AuthContext.Provider value={{ user, login, loginFarmer, logout, switchRole, isAdmin, isStaff, isFarmer, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
