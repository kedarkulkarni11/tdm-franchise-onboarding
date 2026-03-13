import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tdm_franchise_applications';
const MAX_FILE_SIZE = 500 * 1024; // 500KB per file

function generateId() {
  return 'TDM-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
}

export function useApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApplications(JSON.parse(stored));
    }
  }, []);

  const save = (apps) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
    setApplications(apps);
  };

  const submitApplication = (formData) => {
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
    const updated = [...applications, app];
    save(updated);
    return app.id;
  };

  const getApplication = (id) => {
    return applications.find(a => a.id === id);
  };

  const advanceStep = (id) => {
    const updated = applications.map(app => {
      if (app.id !== id) return app;
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

      return {
        ...app,
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
    });
    save(updated);
  };

  const addComment = (appId, stepId, author, text) => {
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      const comment = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        stepId,
        author,
        text,
        createdAt: new Date().toISOString(),
      };
      return {
        ...app,
        updatedAt: new Date().toISOString(),
        comments: [...(app.comments || []), comment],
        activityLog: [
          ...(app.activityLog || []),
          { step: stepId, title: `Comment by ${author === 'admin' ? 'Admin' : 'Applicant'}`, completedAt: new Date().toISOString(), note: text, type: 'comment', author },
        ],
      };
    });
    save(updated);
  };

  const addAttachment = (appId, stepId, fileName, fileType, fileSize, dataUrl) => {
    if (fileSize > MAX_FILE_SIZE) {
      return { error: `File exceeds ${MAX_FILE_SIZE / 1024}KB limit` };
    }
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      const attachment = {
        id: Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
        stepId,
        fileName,
        fileType,
        fileSize,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };
      return {
        ...app,
        updatedAt: new Date().toISOString(),
        attachments: [...(app.attachments || []), attachment],
        activityLog: [
          ...(app.activityLog || []),
          { step: stepId, title: 'File Attached', completedAt: new Date().toISOString(), note: fileName, type: 'attachment' },
        ],
      };
    });
    save(updated);
    return { success: true };
  };

  const removeAttachment = (appId, attachmentId) => {
    const updated = applications.map(app => {
      if (app.id !== appId) return app;
      return {
        ...app,
        updatedAt: new Date().toISOString(),
        attachments: (app.attachments || []).filter(a => a.id !== attachmentId),
      };
    });
    save(updated);
  };

  const deleteApplication = (id) => {
    save(applications.filter(a => a.id !== id));
  };

  return { applications, submitApplication, getApplication, advanceStep, deleteApplication, addComment, addAttachment, removeAttachment };
}
