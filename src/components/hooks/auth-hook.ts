import { useState, useCallback, useEffect } from 'react';

let logoutTimer: any;

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenExpirationDate, setTokenExpirationDate] = useState<
    Date | null | undefined
  >();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const login = useCallback(
    (isAdmin: boolean, token: string, expirationDate?: Date) => {
      setToken(token);
      setIsAdmin(isAdmin);
      const tokenExpirationDate =
        expirationDate || new Date(new Date().getTime() + 1000 * 60 * 180);
      setTokenExpirationDate(tokenExpirationDate);
      localStorage.setItem(
        'userData',
        JSON.stringify({
          isAdmin,
          token,
          expirationDate,
        })
      );
    },
    []
  );

  const logout = useCallback(() => {
    setToken(null);
    setIsAdmin(false);
    localStorage.removeItem('userData');
    setTokenExpirationDate(null);
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData') as any);
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expirationDate) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expirationDate)
      );
    }
  }, [login]);

  useEffect(() => {
    if (token && tokenExpirationDate) {
      const remainingTime =
        tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenExpirationDate]);

  return { token, isAdmin, login, logout };
};

export default useAuth;
