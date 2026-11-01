import { createContext, useState, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('jwt_token') || '');

  const login = (newToken) => {
    setToken(newToken);
    localStorage.setItem('jwt_token', newToken);
  };

  const logout = () => {
    setToken('');
    localStorage.removeItem('jwt_token');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

