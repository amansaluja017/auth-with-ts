import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeatsPage from './pages/SeatsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import ProfilePage from './pages/ProfilePage';
import VerificationPage from './pages/VerificationPage';



function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/verification/:token" element={<VerificationPage />} />
        <Route path="/reset-password/:token" element={<NewPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/shows/:showId" element={<SeatsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
