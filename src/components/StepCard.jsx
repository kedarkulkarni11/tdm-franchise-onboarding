import { Check, Circle, Lock, ArrowRight } from 'lucide-react';

export default function StepCard({ step, phaseColor, isCompleted, isCurrent, isLocked, onAdvance }) {
  return (
    <div
      className={`relative p-5 rounded-xl border-2 transition-all ${
        isCompleted
          ? 'border-green-200 bg-green-50'
          : isCurrent
          ? 'border-blue-300 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      <div className="flex items-start gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
            isCompleted
              ? 'bg-green-500 text-white'
              : isCurrent
              ? 'text-white'
              : 'bg-gray-300 text-white'
          }`}
          style={isCurrent ? { backgroundColor: phaseColor } : {}}
        >
          {isCompleted ? (
            <Check className="w-5 h-5" />
          ) : isLocked ? (
            <Lock className="w-4 h-4" />
          ) : (
            <span className="text-sm font-bold">{step.id}</span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className={`font-semibold ${isCompleted ? 'text-green-800' : isCurrent ? 'text-gray-900' : 'text-gray-500'}`}>
              {step.title}
            </h4>
            {isCompleted && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Complete</span>
            )}
            {isCurrent && (
              <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ backgroundColor: phaseColor }}>
                In Progress
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
          <div className="text-xs text-gray-400 mt-2">Owner: {step.owner}</div>
        </div>

        {isCurrent && onAdvance && (
          <button
            onClick={() => onAdvance()}
            className="shrink-0 flex items-center gap-1 px-4 py-2 bg-tdm-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
          >
            Complete <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
