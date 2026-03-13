import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Apply from './pages/Apply';
import Track from './pages/Track';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import { useApplications } from './hooks/useApplications';
import { buildNotificationEmail, buildStepUpdateEmail } from './utils/sendEmail';
import './index.css';

function App() {
  const { applications, submitApplication, getApplication, advanceStep, deleteApplication, addComment, addAttachment, removeAttachment } = useApplications();

  const sendNotificationEmail = async (email, fullName, appId) => {
    const { subject, textBody } = buildNotificationEmail(email, fullName, appId);
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  const sendStepUpdateEmail = (email, fullName, appId, stepTitle, stepNum, totalSteps) => {
    const { subject, textBody } = buildStepUpdateEmail(email, fullName, appId, stepTitle, stepNum, totalSteps);
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(textBody)}`;
    window.open(mailtoUrl, '_blank');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/apply" element={<Apply onSubmit={submitApplication} sendNotificationEmail={sendNotificationEmail} />} />
          <Route path="/track" element={<Track applications={applications} />} />
          <Route path="/dashboard/:id" element={
            <Dashboard
              getApplication={getApplication}
              advanceStep={advanceStep}
              addComment={addComment}
              addAttachment={addAttachment}
              removeAttachment={removeAttachment}
              sendStepUpdateEmail={sendStepUpdateEmail}
            />
          } />
          <Route path="/admin" element={<Admin applications={applications} deleteApplication={deleteApplication} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
