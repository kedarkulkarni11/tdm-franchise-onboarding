import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, FileText } from 'lucide-react';

export default function Track({ applications }) {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      navigate(`/dashboard/${searchId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Application</h1>
          <p className="text-gray-500">Enter your application ID or select from recent applications below.</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              placeholder="Enter Application ID (e.g., TDM-XXXXX)"
              className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-tdm-red transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3.5 bg-tdm-red text-white font-semibold rounded-xl hover:bg-red-800 transition-colors cursor-pointer"
          >
            Track
          </button>
        </form>

        {/* Recent Applications */}
        {applications.length > 0 ? (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Recent Applications</h3>
            <div className="space-y-3">
              {applications.map(app => {
                const progress = Math.round((app.completedSteps.length / 26) * 100);
                return (
                  <Link
                    key={app.id}
                    to={`/dashboard/${app.id}`}
                    className="flex items-center gap-4 bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow no-underline group"
                  >
                    <div className="w-12 h-12 bg-tdm-red/10 rounded-xl flex items-center justify-center shrink-0">
                      <FileText className="w-6 h-6 text-tdm-red" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900">{app.fullName}</span>
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-500 font-mono">{app.id}</code>
                      </div>
                      <div className="text-sm text-gray-500 mt-0.5">
                        {app.city} | Phase {app.currentPhase} | {progress}% complete
                      </div>
                      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-tdm-red rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-tdm-red transition-colors shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-1">No Applications Yet</h3>
            <p className="text-gray-500 mb-4">Submit a franchise inquiry to get started.</p>
            <Link to="/apply" className="inline-flex items-center gap-2 bg-tdm-red text-white px-6 py-2.5 rounded-xl font-semibold no-underline hover:bg-red-800">
              Apply Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
