import { PHASES } from '../data/phases';
import { Check, Circle, Lock } from 'lucide-react';

export default function PhaseTracker({ currentPhase, currentStep, completedSteps = [] }) {
  return (
    <div className="w-full overflow-x-auto">
      <div className="flex items-center min-w-[700px] px-4">
        {PHASES.map((phase, idx) => {
          const phaseSteps = phase.steps.map(s => s.id);
          const completedInPhase = phaseSteps.filter(s => completedSteps.includes(s)).length;
          const allComplete = completedInPhase === phaseSteps.length;
          const isCurrent = phase.id === currentPhase;
          const isLocked = phase.id > currentPhase;

          return (
            <div key={phase.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm transition-all ${
                    allComplete
                      ? 'bg-green-500 shadow-lg shadow-green-500/30'
                      : isCurrent
                      ? 'ring-4 ring-offset-2 ring-offset-gray-50'
                      : 'bg-gray-300'
                  }`}
                  style={isCurrent && !allComplete ? { backgroundColor: phase.color, ringColor: phase.color } : allComplete ? {} : {}}
                >
                  {allComplete ? <Check className="w-6 h-6" /> : isLocked ? <Lock className="w-4 h-4" /> : <span>{phase.id}</span>}
                </div>
                <div className={`mt-2 text-xs font-semibold text-center ${isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
                  {phase.shortTitle}
                </div>
                {isCurrent && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {completedInPhase}/{phaseSteps.length} steps
                  </div>
                )}
              </div>
              {idx < PHASES.length - 1 && (
                <div className={`h-0.5 w-full min-w-[20px] mx-1 ${allComplete ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
