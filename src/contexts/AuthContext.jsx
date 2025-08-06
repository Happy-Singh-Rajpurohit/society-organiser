import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    
    if (storedUser && storedRole) {
      setUser({
        email: storedUser,
        role: storedRole
      });
    }
    
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    // Simple authentication logic - in a real app, this would validate against a backend
    const validCredentials = {
      'admin@society.com': { password: 'admin123', role: 'eb-ec' },
      'core@society.com': { password: 'core123', role: 'core' },
      'member@society.com': { password: 'member123', role: 'member' }
    };

    const userCredentials = validCredentials[email];
    
    if (userCredentials && userCredentials.password === password && userCredentials.role === role) {
      const userData = { email, role };
      setUser(userData);
      localStorage.setItem('user', email);
      localStorage.setItem('role', role);
      return { success: true };
    } else {
      return { success: false, error: 'Invalid credentials' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};