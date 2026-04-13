import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SeatsPage from './pages/SeatsPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import NewPasswordPage from './pages/NewPasswordPage';
import ProfilePage from './pages/ProfilePage';

export interface Show {
  id: string;
  title: string;
  venue: string;
  time: string;
  availableSeats: number;
  category: string;
  duration: string;
}

const shows: Show[] = [
  {
    id: '1',
    title: 'Midnight Premiere',
    venue: 'Starlight Cinema',
    time: '7:30 PM - Apr 15',
    availableSeats: 56,
    category: 'Action • Sci-fi',
    duration: '2h 10m',
  },
  {
    id: '2',
    title: 'Retro Space Adventure',
    venue: 'Plaza Theater',
    time: '9:00 PM - Apr 15',
    availableSeats: 22,
    category: 'Adventure • Fantasy',
    duration: '1h 55m',
  },
  {
    id: '3',
    title: 'Indie Drama Night',
    venue: 'Downtown Hall',
    time: '6:00 PM - Apr 16',
    availableSeats: 38,
    category: 'Drama • Romance',
    duration: '2h 5m',
  },
];

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<NewPasswordPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/shows/:id/seats" element={<SeatsPage shows={shows} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
