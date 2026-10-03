import React from 'react';
import { X, Bell, CheckCircle, AlertCircle, Award } from 'lucide-react';
import { NewsNotification } from '../../types/events';
import { useI18n } from '../../locales/i18n';

interface NotificationToastProps {
  notifications: NewsNotification[];
  onDismiss: (id: string) => void;
  onClearAll: () => void;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  onClose,
}) => {
  const { language } = useI18n();

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
      <div className="w-full max-w-sm bg-navy-900 border border-slate-700 rounded-3xl p-4 shadow-2xl flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-saffron" />
            <h3 className="text-sm font-bold text-white">
              {language === 'hi' ? 'सूचनाएं व बुलेटिन' : 'Notifications & Bulletins'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              {language === 'hi' ? 'कोई नई सूचना नहीं है।' : 'No new notifications.'}
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-2.5 rounded-xl bg-navy-950/80 border border-slate-800 flex items-start gap-2.5 relative group"
              >
                <div className="mt-0.5">
                  {n.type === 'ELECTION' && <Award size={16} className="text-amber-400" />}
                  {n.type === 'CRISIS' && <AlertCircle size={16} className="text-rose-400" />}
                  {n.type === 'OPPOSITION' && <AlertCircle size={16} className="text-purple-400" />}
                  {n.type === 'MEDIA' && <CheckCircle size={16} className="text-sky-400" />}
                  {n.type === 'POLL' && <CheckCircle size={16} className="text-emerald-400" />}
                  {n.type === 'ACHIEVEMENT' && <Award size={16} className="text-yellow-400" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-200 font-medium leading-snug">
                    {language === 'hi' ? n.titleHi : n.titleEn}
                  </p>
                  <span className="text-[10px] text-slate-500">{n.timestamp}</span>
                </div>

                <button
                  onClick={() => onDismiss(n.id)}
                  className="text-slate-500 hover:text-slate-300 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))
          )}
        </div>

        {notifications.length > 0 && (
          <div className="pt-2 border-t border-slate-800 flex justify-end">
            <button
              onClick={onClearAll}
              className="text-[11px] text-slate-400 hover:text-saffron font-medium"
            >
              {language === 'hi' ? 'सभी हटाएं' : 'Clear All'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
