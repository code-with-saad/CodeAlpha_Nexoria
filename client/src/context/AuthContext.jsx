import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('nexoria_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('nexoria_token') || null;
  });

  const [loading, setLoading] = useState(true);

  // Synchronize auth state and verify token validity on initial mount
  useEffect(() => {
    const hydrateAuth = async () => {
      const storedToken = localStorage.getItem('nexoria_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/profile');
          if (res.data?.data) {
            setUser(res.data.data);
            localStorage.setItem('nexoria_user', JSON.stringify(res.data.data));
          }
        } catch (err) {
          // Token is expired or invalid
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    hydrateAuth();

    // Listen for custom logout events from axios interceptor
    const handleLogoutEvent = () => logout();
    window.addEventListener('nexoria-logout', handleLogoutEvent);
    return () => window.removeEventListener('nexoria-logout', handleLogoutEvent);
  }, []);

  // Register user
  const register = async (name, email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', {
        name,
        email,
        password
      });

      const userData = response.data?.data;
      if (!userData || !userData.token) {
        throw new Error('Registration failed: no token received');
      }

      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('nexoria_token', userData.token);
      localStorage.setItem('nexoria_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', {
        email,
        password
      });

      const userData = response.data?.data;
      if (!userData || !userData.token) {
        throw new Error('Login failed: no token received');
      }

      setUser(userData);
      setToken(userData.token);
      localStorage.setItem('nexoria_token', userData.token);
      localStorage.setItem('nexoria_user', JSON.stringify(userData));

      return { success: true, user: userData };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data?.data;
      if (updatedUser) {
        const mergedUser = { ...user, ...updatedUser };
        setUser(mergedUser);
        localStorage.setItem('nexoria_user', JSON.stringify(mergedUser));
      }
      return { success: true, user: updatedUser, message: response.data?.message };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('nexoria_token');
    localStorage.removeItem('nexoria_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(user && token),
    isAdmin: user?.role === 'admin',
    login,
    register,
    updateProfile,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
