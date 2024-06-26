import { HashRouter as Router, Routes, Route } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Nav from './components/shared/Nav';
import DailySales from './pages/DailySales';
import OrderSeedings from './pages/OrderSeedings';
import Item from './pages/Item';
import Trays from './pages/Trays';
import PlantingNoteBook from './pages/PlantingNoteBook';
import Customer from './pages/Customer';
import Supplier from './pages/Supplier';
import Login from './pages/Login';
import FixedSalary from './pages/FixedSalary';
import Employment from './pages/Employment';
import Hospitality from './pages/Hospitality';
import Water from './pages/Water';
import Electricity from './pages/Electricity';
import Gas from './pages/Gas';
import Requirements from './pages/Requirements';
import useAuth from './components/hooks/auth-hook';
import { AuthContext } from './components/context/AuthContext';
import { useEffect } from 'react';
import Fertilizer from './pages/Fertilizer';
import Loan from './pages/Loan';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {
  const { token, isAdmin, login, logout } = useAuth();

  useEffect(() => {
    const localItem = localStorage.getItem('userData');
    if (localItem) {
      const userData = JSON.parse(localItem);
      login(userData.isAdmin, userData.token);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthContext.Provider
          value={{
            isLoggedIn: !!token,
            isAdmin,
            token,
            login,
            logout,
          }}
        >
          {typeof token === 'string' ? (
            <>
              <Nav />
              <Routes>
                <Route path="/" element={<DailySales />} />
                <Route path="/order-seeds" element={<OrderSeedings />} />
                <Route path="/item" element={<Item />} />
                <Route path="/trays" element={<Trays />} />
                <Route
                  path="/planting-notebook"
                  element={<PlantingNoteBook />}
                />
                <Route path="/customers" element={<Customer />} />
                <Route path="/suppliers" element={<Supplier />} />
                <Route path="/fixed-salary" element={<FixedSalary />} />
                <Route path="/employment" element={<Employment />} />
                <Route path="/hospitality" element={<Hospitality />} />
                <Route path="/electricity" element={<Electricity />} />
                <Route path="/gas" element={<Gas />} />
                <Route path="/requirements" element={<Requirements />} />
                <Route path="/loan" element={<Loan />} />
                <Route path="/fertilizer" element={<Fertilizer />} />
                <Route path="/water" element={<Water />} />
              </Routes>
            </>
          ) : (
            <>
              <Login />
            </>
          )}
        </AuthContext.Provider>
      </Router>
    </QueryClientProvider>
  );
}
