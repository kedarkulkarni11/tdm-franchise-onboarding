import { useState } from 'react';
import { FORM_FIELDS } from '../data/phases';
import { COUNTRIES, INDIA_STATES } from '../data/locations';
import { sendApplicationConfirmationEmail } from '../utils/emailService';
import { ChevronRight, ChevronLeft, Send, User, Briefcase, Target, CheckCircle, Copy, ExternalLink, Mail } from 'lucide-react';

const sections = [
  { key: 'personal', title: 'Personal Details', icon: User, fields: FORM_FIELDS.personal },
  { key: 'business', title: 'Business Background', icon: Briefcase, fields: FORM_FIELDS.business },
  { key: 'intent', title: 'Franchise Intent', icon: Target, fields: FORM_FIELDS.intent },
];

function SuccessScreen({ appId, email, fullName, emailSent }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 max-w-md w-full text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 mb-6">
          Thank you, {fullName}. Your franchise application has been received. Use the tracking ID below to check your application status.
        </p>

        {emailSent && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 mb-4 text-sm text-green-700">
            <Mail className="w-4 h-4 shrink-0" />
            <span>A confirmation email has been sent to <strong>{email}</strong></span>
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Your Application ID</div>
          <div className="flex items-center justify-center gap-2">
            <code className="text-xl font-bold text-tdm-red font-mono">{appId}</code>
            <button onClick={handleCopy} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer" title="Copy ID">
              {copied ? <CheckCircle className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
            </button>
          </div>
          <div className="text-xs text-gray-400 mt-2">Save this ID to track your application progress</div>
        </div>

        <a
          href={`#/dashboard/${appId}`}
          className="inline-flex items-center justify-center gap-2 w-full py-3 bg-tdm-red text-white font-semibold rounded-xl hover:bg-red-800 transition-colors no-underline mb-3"
        >
          View Your Dashboard <ExternalLink className="w-4 h-4" />
        </a>
        <a
          href="#/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 text-gray-600 font-medium rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors no-underline"
        >
          Back to Home
        </a>
      </div>
    </div>
  );
}

export default function Apply({ onSubmit }) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ country: 'IN', phoneCode: '+91' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);

  const current = sections[step];
  const isIndia = formData.country === 'IN';
  const states = isIndia ? Object.keys(INDIA_STATES).sort() : [];
  const cities = isIndia && formData.state ? (INDIA_STATES[formData.state] || []) : [];

  const handleChange = (name, value) => {
    const updates = { [name]: value };

    if (name === 'country') {
      const country = COUNTRIES.find(c => c.code === value);
      updates.phoneCode = country?.phoneCode || '';
      updates.state = '';
      updates.city = '';
    }
    if (name === 'state') {
      updates.city = '';
    }

    setFormData(prev => ({ ...prev, ...updates }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    current.fields.forEach(f => {
      if (f.required) {
        const val = formData[f.name]?.toString().trim();
        if (!val) {
          newErrors[f.name] = 'This field is required';
        }
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validate()) return;
    if (step < sections.length - 1) {
      setStep(step + 1);
    } else {
      const fullPhone = `${formData.phoneCode} ${formData.phone}`;
      const countryName = COUNTRIES.find(c => c.code === formData.country)?.name || formData.country;
      const submission = { ...formData, phone: fullPhone, countryName };
      delete submission.phoneCode;
      const appId = await onSubmit(submission);

      // Send confirmation email (non-blocking — don't hold up the success screen)
      let emailSent = false;
      try {
        const emailResult = await sendApplicationConfirmationEmail({
          fullName: formData.fullName,
          email: formData.email,
          appId,
          city: formData.city,
          state: formData.state,
        });
        emailSent = emailResult.success;
      } catch (e) {
        console.warn('Email send failed:', e);
      }

      setSubmitted({ appId, email: formData.email, fullName: formData.fullName, emailSent });
    }
  };

  if (submitted) {
    return <SuccessScreen appId={submitted.appId} email={submitted.email} fullName={submitted.fullName} emailSent={submitted.emailSent} />;
  }

  const renderField = (field) => {
    const hasError = errors[field.name];
    const baseClass = `w-full px-4 py-3 border-2 rounded-xl text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red transition-colors ${hasError ? 'border-red-400' : 'border-gray-200'}`;

    if (field.type === 'country') {
      return (
        <select value={formData.country || ''} onChange={e => handleChange('country', e.target.value)} className={baseClass}>
          <option value="">Select country</option>
          {COUNTRIES.map(c => (
            <option key={c.code} value={c.code}>{c.name} ({c.phoneCode})</option>
          ))}
        </select>
      );
    }

    if (field.type === 'phone') {
      return (
        <div className="flex gap-2">
          <div className="w-24 shrink-0">
            <input
              type="text"
              value={formData.phoneCode || ''}
              readOnly
              className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl text-gray-900 bg-gray-50 text-center font-semibold"
            />
          </div>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
            placeholder={field.placeholder}
            className={`flex-1 ${baseClass}`}
          />
        </div>
      );
    }

    if (field.type === 'state') {
      if (isIndia) {
        return (
          <select value={formData.state || ''} onChange={e => handleChange('state', e.target.value)} className={baseClass}>
            <option value="">Select state</option>
            {states.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        );
      }
      return (
        <input type="text" value={formData.state || ''} onChange={e => handleChange('state', e.target.value)} placeholder="Enter your state/region" className={baseClass} />
      );
    }

    if (field.type === 'city') {
      if (isIndia && cities.length > 0) {
        return (
          <select value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} className={baseClass}>
            <option value="">Select city</option>
            {cities.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="__other">Other (not listed)</option>
          </select>
        );
      }
      return (
        <input type="text" value={formData.city || ''} onChange={e => handleChange('city', e.target.value)} placeholder="Enter your city" className={baseClass} />
      );
    }

    if (field.type === 'select') {
      return (
        <select value={formData[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} className={baseClass}>
          <option value="">Select an option</option>
          {field.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      );
    }

    if (field.type === 'textarea') {
      return (
        <textarea value={formData[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} placeholder={field.placeholder} rows={3} className={`${baseClass} resize-none`} />
      );
    }

    return (
      <input type={field.type} value={formData[field.name] || ''} onChange={e => handleChange(field.name, e.target.value)} placeholder={field.placeholder} className={baseClass} />
    );
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
                  i < step ? 'bg-green-500 text-white' : i === step ? 'bg-tdm-red text-white ring-4 ring-red-100' : 'bg-gray-200 text-gray-500'
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
                {renderField(field)}
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
