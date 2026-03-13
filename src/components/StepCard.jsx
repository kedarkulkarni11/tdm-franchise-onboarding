import { useState, useRef } from 'react';
import { Check, Circle, Lock, ArrowRight, MessageSquare, Paperclip, X, Download, Send, Bell } from 'lucide-react';

function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  return (bytes / 1024).toFixed(1) + ' KB';
}

export default function StepCard({
  step, phaseColor, isCompleted, isCurrent, isLocked, onAdvance,
  comments = [], attachments = [], onAddComment, onAddAttachment, onRemoveAttachment, isAdmin,
}) {
  const [commentText, setCommentText] = useState('');
  const [notifyApplicant, setNotifyApplicant] = useState(true);
  const [showDetails, setShowDetails] = useState(isCurrent);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  const canInteract = isCompleted || isCurrent;

  const handleAddComment = () => {
    if (!commentText.trim() || !onAddComment) return;
    onAddComment(commentText.trim());
    setCommentText('');
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileError('');
    if (file.size > 500 * 1024) {
      setFileError('File must be under 500KB');
      e.target.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (onAddAttachment) {
        const result = onAddAttachment(file.name, file.type, file.size, reader.result);
        if (result?.error) setFileError(result.error);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div
      className={`relative rounded-xl border-2 transition-all ${
        isCompleted
          ? 'border-green-200 bg-green-50'
          : isCurrent
          ? 'border-blue-300 bg-blue-50 shadow-md'
          : 'border-gray-200 bg-gray-50 opacity-60'
      }`}
    >
      {/* Main row */}
      <div className="p-5">
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
              {canInteract && (comments.length > 0 || attachments.length > 0) && (
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1 cursor-pointer"
                >
                  {comments.length > 0 && <><MessageSquare className="w-3 h-3" />{comments.length}</>}
                  {attachments.length > 0 && <><Paperclip className="w-3 h-3 ml-1" />{attachments.length}</>}
                </button>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
            <div className="text-xs text-gray-400 mt-2">Owner: {step.owner}</div>
          </div>

          {isCurrent && onAdvance && (
            <div className="shrink-0 flex flex-col items-end gap-2">
              <button
                onClick={() => onAdvance(notifyApplicant)}
                className="flex items-center gap-1 px-4 py-2 bg-tdm-red text-white text-sm font-medium rounded-lg hover:bg-red-800 transition-colors cursor-pointer"
              >
                Complete <ArrowRight className="w-4 h-4" />
              </button>
              {isAdmin && (
                <label className="flex items-center gap-1.5 text-xs text-gray-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyApplicant}
                    onChange={e => setNotifyApplicant(e.target.checked)}
                    className="w-3.5 h-3.5 accent-tdm-red"
                  />
                  <Bell className="w-3 h-3" /> Notify applicant
                </label>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Expandable details: comments + attachments */}
      {canInteract && showDetails && (
        <div className="border-t border-gray-200 px-5 py-4 space-y-4">
          {/* Attachments */}
          {attachments.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attachments</div>
              <div className="flex flex-wrap gap-2">
                {attachments.map(att => (
                  <div key={att.id} className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs">
                    <Paperclip className="w-3 h-3 text-gray-400" />
                    <a href={att.dataUrl} download={att.fileName} className="text-blue-600 hover:underline font-medium" target="_blank" rel="noopener noreferrer">
                      {att.fileName}
                    </a>
                    <span className="text-gray-400">{formatSize(att.fileSize)}</span>
                    {onRemoveAttachment && (
                      <button onClick={() => onRemoveAttachment(att.id)} className="text-gray-400 hover:text-red-500 cursor-pointer">
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comments */}
          {comments.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Comments</div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {comments.map(c => (
                  <div key={c.id} className="bg-white border border-gray-200 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-semibold px-1.5 py-0.5 rounded ${c.author === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {c.author === 'admin' ? 'Admin' : 'Applicant'}
                      </span>
                      <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                    </div>
                    <p className="text-sm text-gray-700">{c.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add comment + attach */}
          <div className="flex gap-2">
            <input
              type="text"
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddComment()}
              placeholder="Add a comment..."
              className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-tdm-red/20 focus:border-tdm-red"
            />
            <button
              onClick={handleAddComment}
              disabled={!commentText.trim()}
              className="px-3 py-2 bg-tdm-red text-white rounded-lg text-sm hover:bg-red-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-2 border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-100 cursor-pointer"
              title="Attach file (max 500KB)"
            >
              <Paperclip className="w-4 h-4" />
            </button>
          </div>
          {fileError && <p className="text-xs text-red-500">{fileError}</p>}
        </div>
      )}

      {/* Toggle details button for completed steps */}
      {canInteract && !isCurrent && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full text-xs text-gray-400 hover:text-gray-600 py-2 border-t border-gray-200 cursor-pointer"
        >
          {showDetails ? 'Hide details' : 'Show details'}
        </button>
      )}
    </div>
  );
}
