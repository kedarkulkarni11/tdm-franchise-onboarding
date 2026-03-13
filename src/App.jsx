import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Track from './pages/Track';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { useApplications } from './hooks/useApplications';
import './index.css';

function App() {
  const { applications, submitApplication, getApplication, advanceStep, deleteApplication } = useApplications();

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply onSubmit={submitApplication} />} />
          <Route path="/track" element={<Track applications={applications} />} />
          <Route path="/dashboard/:id" element={<Dashboard getApplication={getApplication} advanceStep={advanceStep} />} />
          <Route path="/admin" element={<Admin applications={applications} deleteApplication={deleteApplication} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
