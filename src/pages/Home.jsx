import { Link } from 'react-router-dom';
import { ArrowRight, Car, Shield, Clock, Users, TrendingUp, Award } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: '26', label: 'Process Steps' },
  { icon: Shield, value: '2', label: 'Verification Layers' },
  { icon: Clock, value: '10 Days', label: 'Training Program' },
  { icon: Users, value: '60-90', label: 'Days to Launch' },
];

const phases = [
  { num: '01', title: 'Lead Capture', desc: 'Submit your franchise inquiry and get contacted by our Regional Sales Manager within the same day.', color: '#3B82F6' },
  { num: '02', title: 'Qualification', desc: 'Complete the evaluation form, attend a video call with our GM, and get invited to our Head Office.', color: '#8B5CF6' },
  { num: '03', title: 'Due Diligence', desc: 'Tour our Experience Centre, review the franchise model, and finalize your store location.', color: '#F59E0B' },
  { num: '04', title: 'Agreement', desc: 'Sign the legal franchise agreement, close fees, and kick off store design and construction.', color: '#EF4444' },
  { num: '05', title: 'Onboarding', desc: 'Complete compliance, hire staff, procure machinery, and undergo our intensive 10-day training.', color: '#10B981' },
  { num: '06', title: 'Launch', desc: 'Pre-launch marketing, grand inauguration, post-launch support, and path to scaling.', color: '#EC4899' },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-tdm-dark text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-tdm-red/20 border border-tdm-red/40 rounded-full px-4 py-1.5 text-sm text-red-300 mb-6">
              <Award className="w-4 h-4" /> Franchise Division
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              Own a <span className="text-tdm-red">Detailing Mafia</span> Franchise
            </h1>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              From first inquiry to grand opening — a structured, transparent journey to becoming a franchise partner. Every step, every milestone, every time.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/apply"
                className="inline-flex items-center gap-2 bg-tdm-red text-white px-8 py-3.5 rounded-xl font-semibold text-lg hover:bg-red-800 transition-colors no-underline"
              >
                Apply for Franchise <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/track"
                className="inline-flex items-center gap-2 border-2 border-gray-600 text-gray-300 px-8 py-3.5 rounded-xl font-semibold text-lg hover:border-gray-400 hover:text-white transition-colors no-underline"
              >
                Track Application
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <s.icon className="w-8 h-8 mx-auto text-tdm-red mb-3" />
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Phases */}
      <section className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">The Franchise Journey</h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              A proven 6-phase process that takes you from aspiring entrepreneur to franchise owner.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {phases.map((p) => (
              <div key={p.num} className="bg-white rounded-2xl p-6 border border-gray-200 hover:shadow-lg transition-shadow">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg mb-4"
                  style={{ backgroundColor: p.color }}
                >
                  {p.num}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-tdm-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-lg text-gray-400 mb-8">
            Every lead is a person with dreams. We give you a system to build your future.
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 bg-tdm-red text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-red-800 transition-colors no-underline"
          >
            Apply Now <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
          The Detailing Mafia Franchise Division. Built on Excellence. Scaled on Systems.
        </div>
      </footer>
    </div>
  );
}
