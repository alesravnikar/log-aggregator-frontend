import { useState } from 'react';
import './App.css';
import { Route, Routes, useNavigate } from 'react-router-dom';
import LoginView from './Pages/Login';
import NavigationBar from './Components/NavigationBar';
import { Token } from './Interfaces/Token';
import ProjectOverview from './Pages/ProjectOverview';
import AdminPanel from './Pages/AdminPanel';
import LogViewer from './Pages/LogViewer';

interface Forecast {
  date: Date;
  temperatureC: number;
}

function App() {
  const [token, setToken] = useState<Token | null>(null);

  const navigate = useNavigate();

  const logout = () => {
    setToken(null);
    navigate("/Login");
  };

  const login = (token: Token) => {
    setToken(token);
    navigate("/Projects");
  }

  const isAdmin = true;
  const isLoggedIn = token != null;

  return (
    <div style={{ height: "100%" }}>
      <NavigationBar isLoggedIn={isLoggedIn} isAdmin={isAdmin} logout={logout} />
      <Routes>
        <Route path="Admin" element={<AdminPanel token={token!} />} />
        <Route path="Projects" element={<ProjectOverview token={token!} />} />
        <Route path="Logs/:id" element={<LogViewer token={token!} />} />
        <Route path='*' element={<LoginView login={login} />} />
      </Routes>
    </div>
  );
}

export default App;
