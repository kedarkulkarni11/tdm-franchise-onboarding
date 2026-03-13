import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/api';

const MAX_FILE_SIZE = 500 * 1024; // 500KB per file

function generateId() {
  return 'TDM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function useApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = useCallback(async () => {
    try {
      const data = await api.getApplications();
      setApplications(data);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const submitApplication = async (formData) => {
    const app = {
      id: generateId(),
      ...formData,
      currentPhase: 1,
      currentStep: 3,
      completedSteps: [1, 2],
      status: 'active',
      submittedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: [],
      activityLog: [
        { step: 1, title: 'Campaign Live', completedAt: new Date(Date.now() - 86400000).toISOString(), note: 'Lead generated via ad campaign', type: 'step_complete' },
        { step: 2, title: 'Lead Captured', completedAt: new Date().toISOString(), note: 'Application form submitted successfully', type: 'step_complete' },
      ],
    };
    try {
      await api.createApplication(app);
      setApplications(prev => [...prev, app]);
      return app.id;
    } catch (err) {
      console.error('Failed to submit application:', err);
      return null;
    }
  };

  const getApplication = (id) => {
    return applications.find(a => a.id === id);
  };

  const advanceStep = async (id) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    const completingStep = app.currentStep;
    const nextStep = completingStep + 1;

    let nextPhase = app.currentPhase;
    if (nextStep <= 26) {
      const phaseStepRanges = [[1,4],[5,8],[9,12],[13,16],[17,22],[23,26]];
      for (let i = 0; i < phaseStepRanges.length; i++) {
        if (nextStep >= phaseStepRanges[i][0] && nextStep <= phaseStepRanges[i][1]) {
          nextPhase = i + 1;
          break;
        }
      }
    }

    const stepTitles = {
      3: 'RSM Call — Same Day', 4: 'WhatsApp Follow-Up',
      5: 'Evaluation Form Sent', 6: 'Form Evaluated', 7: 'Video Call', 8: 'HO Visit Invitation',
      9: 'HO Tour', 10: 'Corporate Presentation', 11: 'MOU & Verification', 12: 'Site Finalization',
      13: 'Fees Closed', 14: 'Architect Work', 15: 'Legal Agreement', 16: 'Construction Started',
      17: 'PDC Submission', 18: 'Store Setup', 19: 'Machinery Procurement', 20: 'Manpower Hiring',
      21: 'Pre-Training Compliance', 22: 'Training Complete',
      23: 'Pre-Launch Marketing', 24: 'Inauguration', 25: 'Post-Launch Support', 26: 'Scale & Expansion',
    };

    const patch = {
      currentPhase: nextPhase,
      currentStep: nextStep > 26 ? 26 : nextStep,
      completedSteps: [...app.completedSteps, completingStep],
      updatedAt: new Date().toISOString(),
      status: completingStep >= 26 ? 'completed' : 'active',
      activityLog: [
        ...app.activityLog,
        { step: completingStep, title: stepTitles[completingStep] || `Step ${completingStep}`, completedAt: new Date().toISOString(), note: 'Marked complete', type: 'step_complete' },
      ],
    };

    try {
      await api.updateApplication(id, patch);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    } catch (err) {
      console.error('Failed to advance step:', err);
    }
  };

  const rejectApplication = async (id, reason) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;

    const patch = {
      status: 'rejected',
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
      activityLog: [
        ...(app.activityLog || []),
        { step: app.currentStep, title: 'Application Rejected', completedAt: new Date().toISOString(), note: reason, type: 'rejection' },
      ],
    };

    try {
      await api.updateApplication(id, patch);
      setApplications(prev => prev.map(a => a.id === id ? { ...a, ...patch } : a));
    } catch (err) {
      console.error('Failed to reject application:', err);
    }
  };

  const addComment = async (appId, stepId, author, text, visibility = 'shared') => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const comment = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      stepId,
      author,
      text,
      visibility,
      createdAt: new Date().toISOString(),
    };
    const logTitle = author === 'admin'
      ? (visibility === 'internal' ? 'Internal Note by Admin' : 'Comment by Admin')
      : 'Comment by Applicant';

    const patch = {
      updatedAt: new Date().toISOString(),
      comments: [...(app.comments || []), comment],
      activityLog: [
        ...(app.activityLog || []),
        { step: stepId, title: logTitle, completedAt: new Date().toISOString(), note: text, type: 'comment', author, visibility },
      ],
    };

    try {
      await api.updateApplication(appId, patch);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...patch } : a));
    } catch (err) {
      console.error('Failed to add comment:', err);
    }
  };

  const addAttachment = async (appId, stepId, fileName, fileType, fileSize, dataUrl) => {
    if (fileSize > MAX_FILE_SIZE) {
      return { error: `File exceeds ${MAX_FILE_SIZE / 1024}KB limit` };
    }

    const app = applications.find(a => a.id === appId);
    if (!app) return { error: 'Application not found' };

    const attachment = {
      id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
      stepId,
      fileName,
      fileType,
      fileSize,
      dataUrl,
      uploadedAt: new Date().toISOString(),
    };

    const patch = {
      updatedAt: new Date().toISOString(),
      attachments: [...(app.attachments || []), attachment],
      activityLog: [
        ...(app.activityLog || []),
        { step: stepId, title: 'File Attached', completedAt: new Date().toISOString(), note: fileName, type: 'attachment' },
      ],
    };

    try {
      await api.updateApplication(appId, patch);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...patch } : a));
      return { success: true };
    } catch (err) {
      console.error('Failed to add attachment:', err);
      return { error: 'Failed to save attachment' };
    }
  };

  const removeAttachment = async (appId, attachmentId) => {
    const app = applications.find(a => a.id === appId);
    if (!app) return;

    const patch = {
      updatedAt: new Date().toISOString(),
      attachments: (app.attachments || []).filter(a => a.id !== attachmentId),
    };

    try {
      await api.updateApplication(appId, patch);
      setApplications(prev => prev.map(a => a.id === appId ? { ...a, ...patch } : a));
    } catch (err) {
      console.error('Failed to remove attachment:', err);
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api.deleteApplication(id);
      setApplications(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      console.error('Failed to delete application:', err);
    }
  };

  return { applications, loading, submitApplication, getApplication, advanceStep, rejectApplication, deleteApplication, addComment, addAttachment, removeAttachment };
}
