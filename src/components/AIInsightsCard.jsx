import { Sparkles, TrendingUp, AlertTriangle, CheckCircle, Clock, Target } from 'lucide-react';

const METRO_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Bengaluru', 'Chennai', 'Hyderabad', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh', 'Gurgaon', 'Gurugram', 'Noida'];

function generateInsights(app) {
  const insights = [];
  const daysSinceSubmission = Math.floor((Date.now() - new Date(app.submittedAt).getTime()) / 86400000);
  const isMetro = METRO_CITIES.some(c => (app.city || '').toLowerCase().includes(c.toLowerCase()) || (app.preferredLocation || '').toLowerCase().includes(c.toLowerCase()));

  // Investment vs location
  const lowInvestment = app.investmentCapacity === 'Below 25 Lakhs' || app.investmentCapacity === '25-50 Lakhs';
  if (isMetro && lowInvestment) {
    insights.push({ type: 'warning', icon: AlertTriangle, text: `Investment capacity (${app.investmentCapacity}) may be below metro city requirements. Discuss tier-2 locations or higher investment options.` });
  } else if (!isMetro && !lowInvestment) {
    insights.push({ type: 'positive', icon: CheckCircle, text: `Strong investment capacity for a non-metro location. High potential for profitability with lower operating costs.` });
  } else if (isMetro && !lowInvestment) {
    insights.push({ type: 'positive', icon: CheckCircle, text: `Investment capacity aligns well with metro city requirements. Good positioning for high-traffic location.` });
  }

  // Experience assessment
  if (app.businessExperience === 'No prior experience') {
    insights.push({ type: 'warning', icon: AlertTriangle, text: `First-time business owner. Recommend extended training program and closer post-launch mentoring.` });
  } else if (app.businessExperience === '10+ years' || app.businessExperience === '5-10 years') {
    insights.push({ type: 'positive', icon: CheckCircle, text: `Seasoned business professional (${app.businessExperience}). Likely to ramp up operations quickly.` });
  }

  // Timeline urgency
  if (app.timeline === 'Immediately (1-2 months)' && app.currentStep < 9) {
    insights.push({ type: 'info', icon: Clock, text: `High urgency — applicant wants immediate launch but is in early stages. Prioritize RSM outreach and fast-track evaluation.` });
  } else if (app.timeline === 'Just exploring') {
    insights.push({ type: 'warning', icon: AlertTriangle, text: `Exploratory lead — lower conversion probability. Maintain engagement with periodic check-ins.` });
  }

  // Progress velocity
  if (daysSinceSubmission > 0) {
    const stepsPerDay = app.completedSteps.length / daysSinceSubmission;
    if (stepsPerDay < 0.1 && app.completedSteps.length > 2) {
      insights.push({ type: 'warning', icon: Clock, text: `Slow progress — ${app.completedSteps.length} steps in ${daysSinceSubmission} days. Risk of lead going cold. Schedule follow-up.` });
    } else if (stepsPerDay > 0.5) {
      insights.push({ type: 'positive', icon: TrendingUp, text: `Fast-moving lead — progressing rapidly through the pipeline. Ensure all verification steps are thorough.` });
    }
  }

  // Multi-unit potential
  if (app.unitsPlanned !== 'Single unit') {
    insights.push({ type: 'positive', icon: Target, text: `Multi-unit interest (${app.unitsPlanned}). High-value lead — consider priority handling and territory reservation.` });
  }

  // Property readiness
  if (app.ownedProperty === 'Yes - ready to use') {
    insights.push({ type: 'positive', icon: CheckCircle, text: `Property already available. Can potentially reduce setup timeline by 60-90 days.` });
  } else if (app.ownedProperty === 'Exploring options') {
    insights.push({ type: 'info', icon: Clock, text: `No property secured yet. RSM should assist with site scouting to avoid delays.` });
  }

  // Risk score
  let riskScore = 'Medium';
  const positives = insights.filter(i => i.type === 'positive').length;
  const warnings = insights.filter(i => i.type === 'warning').length;
  if (positives >= 3 && warnings === 0) riskScore = 'Low';
  else if (warnings >= 2) riskScore = 'High';

  return { insights, riskScore };
}

const riskColors = {
  Low: 'bg-green-100 text-green-700',
  Medium: 'bg-yellow-100 text-yellow-700',
  High: 'bg-red-100 text-red-700',
};

const typeColors = {
  positive: 'text-green-600',
  warning: 'text-amber-500',
  info: 'text-blue-500',
};

export default function AIInsightsCard({ application }) {
  const { insights, riskScore } = generateInsights(application);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" /> AI Insights
        </h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${riskColors[riskScore]}`}>
          {riskScore} Risk
        </span>
      </div>

      <div className="space-y-3">
        {insights.map((insight, i) => (
          <div key={i} className="flex gap-3">
            <insight.icon className={`w-4 h-4 mt-0.5 shrink-0 ${typeColors[insight.type]}`} />
            <p className="text-sm text-gray-700 leading-relaxed">{insight.text}</p>
          </div>
        ))}
        {insights.length === 0 && (
          <p className="text-sm text-gray-500">Insufficient data for analysis. More data points needed as the application progresses.</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-400">Analysis based on application data, location, and progress patterns.</p>
      </div>
    </div>
  );
}
