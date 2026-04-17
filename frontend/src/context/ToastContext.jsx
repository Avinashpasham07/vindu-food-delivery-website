import React, { createContext, useContext, useState, useCallback } from 'react';
import { 
    CheckCircle2, 
    AlertCircle, 
    Info, 
    X 
} from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const showToast = useCallback((message, type = 'success') => { // type: 'success' | 'error' | 'info'
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);

        // Auto remove after 6 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(toast => toast.id !== id));
        }, 6000);
    }, []);

    const removeToast = (id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast Container */}
            <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[9999] w-[85vw] md:w-full md:max-w-sm px-0 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            pointer-events-auto transform transition-all duration-300 animate-slide-up
                            flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border backdrop-blur-md
                            ${toast.type === 'success' ? 'bg-[#1a1a1a]/90 border-emerald-500/20 text-emerald-400' : ''}
                            ${toast.type === 'error' ? 'bg-[#1a1a1a]/90 border-red-500/20 text-red-400' : ''}
                            ${toast.type === 'info' ? 'bg-[#1a1a1a]/90 border-blue-500/20 text-blue-400' : ''}
                        `}
                    >
                        {/* Icon */}
                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}

                        <p className="text-sm font-bold text-white flex-1">{toast.message}</p>

                        <button onClick={() => removeToast(toast.id)} className="opacity-50 hover:opacity-100 transition-opacity p-1 hover:bg-white/5 rounded-full">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
