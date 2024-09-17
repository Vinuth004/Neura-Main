import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Cookies from 'js-cookie';

import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { ThemeProvider } from "@/components/theme-provider";
import { Login } from './components/login';
import { Registration } from './components/registration';
import Dashboard from './components/dash';
import { Character } from './components/character';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ForgotForm } from './components/forgot';
import PrivateRoute from './components/PrivateRoute'; // Import PrivateRoute

function App() {
  const [count, setCount] = useState(0);

  return (

    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Registration />} />
          <Route
            path="/"
            element={
              
                <Dashboard />

            }
          />
          <Route path="/forgot" element={<ForgotForm />} />
        </Routes>
      </Router>
    </ThemeProvider>

  );
}

export default App;
