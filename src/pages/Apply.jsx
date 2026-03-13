import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FORM_FIELDS } from '../data/phases';
import { ChevronRight, ChevronLeft, Send, User, Briefcase, Target } from 'lucide-react';

const sections = [
  { key: 'personal', title: 'Personal Details', icon: User, fields: FORM_FIELDS.personal },
  { key: 'business', title: 'Business Background', icon: Briefcase, fields: FORM_FIELDS.business },
  { key: 'intent', title: 'Franchise Intent', icon: Target, fields: FORM_FIELDS.intent },
];

export default function Apply({ onSubmit }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});

  const current = sections[step];

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    current.fields.forEach(f => {
      if (f.required && !formData[f.name]?.trim()) {
        newErrors[f.name] = 'This field is required';
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;
    if (step < sections.length - 1) {
      setStep(step + 1);
    } else {
      const appId = onSubmit(formData);
      navigate(`/dashboard/${appId}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {sections.map((s, i) => (
            <div key={s.key} className="flex items-center gap-2">
              <button
                onClick={() => i < step && setStep(i)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all cursor-pointer ${
                  i < step
                    ? 'bg-green-500 text-white'
                    : i === step
                    ? 'bg-tdm-red text-white ring-4 ring-red-100'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {i < step ? '✓' : i + 1}
              </button>
              {i < sections.length - 1 && (
                <div className={`w-16 sm:w-24 h-1 rounded ${i < step ? 'bg-green-500' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-tdm-red/10 rounded-xl flex items-center justify-center">
              <current.icon className="w-6 h-6 text-tdm-red" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{current.title}</h2>
              <p className="text-sm text-gray-500">Step {step + 1} of {sections.length}</p>
            </div>
          </div>

          <div className="space-y-5">
            {current.fields.map(field => (
              <div key={field.name}>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  {field.label}
                  {field.required && <span className="text-tdm-red ml-1">*</span>}
                </label>
                {field.type === 'select' ? (
                  <select
                    value={formData[field.name] || ''}
                    onChange={e => handleChange(field.name, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors ${
                      errors[field.name] ? 'border-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select an option</option>
                    {field.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={formData[field.name] || ''}
                    onChange={e => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={3}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors resize-none ${
                      errors[field.name] ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                ) : (
                  <input
                    type={field.type}
                    value={formData[field.name] || ''}
                    onChange={e => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={`w-full px-4 py-3 border-2 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors ${
                      errors[field.name] ? 'border-red-400' : 'border-gray-200'
                    }`}
                  />
                )}
                {errors[field.name] && (
                  <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 bg-tdm-red text-white font-semibold rounded-xl hover:bg-red-800 transition-colors cursor-pointer"
            >
              {step === sections.length - 1 ? (
                <>Submit Application <Send className="w-4 h-4" /></>
              ) : (
                <>Next <ChevronRight className="w-4 h-4" /></>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
