import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ArrowRight, FileSearch, AlertCircle } from 'lucide-react';

export default function Track({ applications }) {
  const navigate = useNavigate();
  const [searchId, setSearchId] = useState('');
  const [error, setError] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    const id = searchId.trim();
    if (!id) {
      setError('Please enter your application ID.');
      return;
    }
    const found = applications.find(a => a.id === id);
    if (found) {
      navigate(`/dashboard/${id}`);
    } else {
      setError('No application found with this ID. Please check and try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-tdm-red/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileSearch className="w-8 h-8 text-tdm-red" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Application</h1>
          <p className="text-gray-500">Enter the application ID you received after submitting your franchise inquiry.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Application ID</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchId}
                  onChange={e => { setSearchId(e.target.value); setError(''); }}
                  placeholder="e.g., TDM-XXXXX-XXXX"
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors ${
                    error ? 'border-red-400' : 'border-gray-200'
                  }`}
                  autoFocus
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-tdm-red text-white font-semibold rounded-xl hover:bg-red-800 transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              Track Application <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 mb-3">Don't have an application yet?</p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 text-tdm-red font-semibold hover:underline no-underline"
          >
            Apply for a Franchise <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
