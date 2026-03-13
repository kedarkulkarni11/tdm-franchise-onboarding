import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PHASES } from '../data/phases';
import { Users, TrendingUp, Clock, CheckCircle, Trash2, ExternalLink, Lock, LogOut } from 'lucide-react';

const ADMIN_CREDENTIALS = { username: 'admin', password: 'tdm@2024' };

function LoginGate({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      onLogin();
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-tdm-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-tdm-red" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Admin Access</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the admin panel</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Username</label>
            <input
              type="text"
              value={username}
              onChange={e => { setUsername(e.target.value); setError(''); }}
              placeholder="Enter username"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-tdm-red text-white font-semibold rounded-xl hover:bg-red-800 transition-colors cursor-pointer"
          >
            Sign In
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-6">For internal use — Sales Team only</p>
      </div>
    </div>
  );
}

export default function Admin({ applications, deleteApplication }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('tdm_admin_auth') === 'true';
  });

  const handleLogin = () => {
    sessionStorage.setItem('tdm_admin_auth', 'true');
    setAuthenticated(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('tdm_admin_auth');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <LoginGate onLogin={handleLogin} />;
  }

  const active = applications.filter(a => a.status === 'active').length;
  const completed = applications.filter(a => a.status === 'completed').length;

  const phaseDistribution = PHASES.map(p => ({
    ...p,
    count: applications.filter(a => a.currentPhase === p.id && a.status === 'active').length,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm">Franchise Sales Pipeline Overview</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-tdm-red border border-gray-200 rounded-lg hover:border-tdm-red transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Users, label: 'Total Leads', value: applications.length, color: 'bg-blue-500' },
            { icon: TrendingUp, label: 'Active', value: active, color: 'bg-green-500' },
            { icon: CheckCircle, label: 'Completed', value: completed, color: 'bg-purple-500' },
            { icon: Clock, label: 'Avg Phase', value: applications.length ? Math.round(applications.reduce((s, a) => s + a.currentPhase, 0) / applications.length * 10) / 10 : 0, color: 'bg-orange-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mb-3`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Pipeline */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pipeline by Phase</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {phaseDistribution.map(p => (
              <div key={p.id} className="text-center p-4 rounded-xl bg-gray-50">
                <div className="text-3xl font-bold" style={{ color: p.color }}>{p.count}</div>
                <div className="text-xs font-semibold text-gray-600 mt-1">{p.shortTitle}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-900">All Applications</h3>
          </div>
          {applications.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              No applications yet. Share the application form to start receiving leads.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Applicant</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Location</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Phase</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Progress</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase px-6 py-3">Status</th>
                    <th className="text-right text-xs font-semibold text-gray-500 uppercase px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {applications.map(app => {
                    const progress = Math.round((app.completedSteps.length / 26) * 100);
                    const phase = PHASES.find(p => p.id === app.currentPhase);
                    return (
                      <tr key={app.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">{app.fullName}</div>
                          <div className="text-xs text-gray-500 font-mono">{app.id}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{app.preferredLocation || app.city}</td>
                        <td className="px-6 py-4">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full text-white" style={{ backgroundColor: phase?.color }}>
                            Phase {app.currentPhase}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                              <div className="h-full bg-tdm-red rounded-full" style={{ width: `${progress}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{progress}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                            app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {app.status === 'completed' ? 'Complete' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              to={`/dashboard/${app.id}`}
                              className="p-2 text-gray-400 hover:text-tdm-red transition-colors"
                              title="View Dashboard"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => deleteApplication(app.id)}
                              className="p-2 text-gray-400 hover:text-red-600 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
