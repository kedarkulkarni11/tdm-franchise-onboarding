import { useParams, Link } from 'react-router-dom';
import { PHASES } from '../data/phases';
import PhaseTracker from '../components/PhaseTracker';
import StepCard from '../components/StepCard';
import AIInsightsCard from '../components/AIInsightsCard';
import { Clock, MapPin, Phone, Mail, Building, ArrowLeft, CheckCircle2, MessageSquare, Paperclip } from 'lucide-react';

export default function Dashboard({ getApplication, advanceStep, addComment, addAttachment, removeAttachment, sendStepUpdateEmail }) {
  const { id } = useParams();
  const app = getApplication(id);
  const isAdmin = sessionStorage.getItem('tdm_admin_auth') === 'true';

  if (!app) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-10 text-center max-w-md">
          <div className="text-6xl mb-4">?</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Not Found</h2>
          <p className="text-gray-500 mb-6">No application found with ID: {id}</p>
          <Link to="/apply" className="inline-flex items-center gap-2 bg-tdm-red text-white px-6 py-3 rounded-xl font-semibold no-underline hover:bg-red-800">
            Apply Now
          </Link>
        </div>
      </div>
    );
  }

  const totalSteps = 26;
  const progress = Math.round((app.completedSteps.length / totalSteps) * 100);
  const currentPhaseData = PHASES.find(p => p.id === app.currentPhase);
  const author = isAdmin ? 'admin' : 'applicant';

  const handleAdvance = (sendEmail) => {
    const completingStep = app.currentStep;
    advanceStep(app.id);
    if (sendEmail && sendStepUpdateEmail) {
      const stepTitles = {
        3: 'RSM Call — Same Day', 4: 'WhatsApp Follow-Up',
        5: 'Evaluation Form Sent', 6: 'Form Evaluated', 7: 'Video Call', 8: 'HO Visit Invitation',
        9: 'HO Tour', 10: 'Corporate Presentation', 11: 'MOU & Verification', 12: 'Site Finalization',
        13: 'Fees Closed', 14: 'Architect Work', 15: 'Legal Agreement', 16: 'Construction Started',
        17: 'PDC Submission', 18: 'Store Setup', 19: 'Machinery Procurement', 20: 'Manpower Hiring',
        21: 'Pre-Training Compliance', 22: 'Training Complete',
        23: 'Pre-Launch Marketing', 24: 'Inauguration', 25: 'Post-Launch Support', 26: 'Scale & Expansion',
      };
      sendStepUpdateEmail(app.email, app.fullName, app.id, stepTitles[completingStep] || `Step ${completingStep}`, completingStep, totalSteps);
    }
  };

  const getTimelineIcon = (entry) => {
    const type = entry.type || 'step_complete';
    if (type === 'comment') return <MessageSquare className="w-4 h-4 text-blue-500" />;
    if (type === 'attachment') return <Paperclip className="w-4 h-4 text-purple-500" />;
    return <CheckCircle2 className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Back + ID */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <Link to="/track" className="flex items-center gap-2 text-gray-500 hover:text-gray-700 no-underline text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Tracker
          </Link>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700">Admin View</span>
            )}
            <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
              app.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {app.status === 'completed' ? 'Onboarding Complete' : 'In Progress'}
            </span>
            <code className="text-sm bg-gray-100 px-3 py-1 rounded-lg text-gray-600 font-mono">{app.id}</code>
          </div>
        </div>

        {/* Applicant Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-16 h-16 bg-tdm-red rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0">
              {app.fullName?.charAt(0)?.toUpperCase() || 'F'}
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-gray-900">{app.fullName}</h1>
              <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {app.email}</span>
                <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {app.phone}</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {app.city}, {app.state}</span>
                <span className="flex items-center gap-1"><Building className="w-4 h-4" /> {app.preferredLocation}</span>
              </div>
            </div>
            <div className="text-center md:text-right shrink-0">
              <div className="text-4xl font-bold text-tdm-red">{progress}%</div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-5 h-3 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-tdm-red to-red-400 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Phase Tracker */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Onboarding Progress</h3>
          <PhaseTracker currentPhase={app.currentPhase} currentStep={app.currentStep} completedSteps={app.completedSteps} />
        </div>

        {/* Current Phase Steps + Sidebar */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentPhaseData?.color }} />
              Phase {app.currentPhase}: {currentPhaseData?.title}
            </h3>

            {PHASES.map(phase => (
              <div key={phase.id}>
                {phase.id !== app.currentPhase && (
                  <button onClick={() => {}} className="w-full text-left mb-2" />
                )}
                {(phase.id === app.currentPhase || phase.steps.some(s => app.completedSteps.includes(s.id))) && (
                  <div className={phase.id !== app.currentPhase ? 'opacity-70' : ''}>
                    {phase.id !== app.currentPhase && (
                      <h4 className="text-sm font-semibold text-gray-500 mb-2 mt-6">
                        Phase {phase.id}: {phase.title}
                      </h4>
                    )}
                    <div className="space-y-3">
                      {phase.steps.map(step => {
                        const stepComments = (app.comments || []).filter(c => c.stepId === step.id);
                        const stepAttachments = (app.attachments || []).filter(a => a.stepId === step.id);
                        return (
                          <StepCard
                            key={step.id}
                            step={step}
                            phaseColor={phase.color}
                            isCompleted={app.completedSteps.includes(step.id)}
                            isCurrent={step.id === app.currentStep}
                            isLocked={step.id > app.currentStep}
                            onAdvance={step.id === app.currentStep ? handleAdvance : null}
                            comments={stepComments}
                            attachments={stepAttachments}
                            onAddComment={(text) => addComment(app.id, step.id, author, text)}
                            onAddAttachment={(fileName, fileType, fileSize, dataUrl) => addAttachment(app.id, step.id, fileName, fileType, fileSize, dataUrl)}
                            onRemoveAttachment={(attId) => removeAttachment(app.id, attId)}
                            isAdmin={isAdmin}
                          />
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* AI Insights (admin only) */}
            {isAdmin && <AIInsightsCard application={app} />}

            {/* Activity Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-tdm-red" /> Activity Timeline
              </h3>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {[...(app.activityLog || [])].reverse().map((entry, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="mt-1">
                      {getTimelineIcon(entry)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{entry.title}</div>
                      <div className="text-xs text-gray-400">
                        {new Date(entry.completedAt).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                        })}
                      </div>
                      {entry.note && <div className="text-xs text-gray-500 mt-0.5">{entry.note}</div>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Investment</span>
                  <span className="font-semibold text-gray-900">{app.investmentCapacity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Units Planned</span>
                  <span className="font-semibold text-gray-900">{app.unitsPlanned}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Timeline</span>
                  <span className="font-semibold text-gray-900">{app.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Experience</span>
                  <span className="font-semibold text-gray-900">{app.businessExperience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
