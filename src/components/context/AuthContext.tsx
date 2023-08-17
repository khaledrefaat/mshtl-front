import { createContext } from 'react';

interface AuthContextInterface {
  isLoggedIn: boolean;
  isAdmin: boolean;
  token: string | null;
  login: (isAdmin: boolean, token: string, expirationDate?: Date) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextInterface>({
  isLoggedIn: false,
  isAdmin: false,
  token: null,
  login: () => {},
  logout: () => {},
});
