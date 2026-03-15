import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { classNames } from '../../utils/helpers';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md'
}: ModalProps) {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-3xl',
    full: 'max-w-full m-4'
  };
  return (
    <AnimatePresence>
      {isOpen &&
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-genos">
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm" />
        
          <motion.div
          initial={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }}
          exit={{
            opacity: 0,
            scale: 0.95,
            y: 20
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 300
          }}
          className={classNames(
            'relative w-full bg-[#111118] border border-red-500/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]',
            sizes[size]
          )}>
          
            {title &&
          <div className="px-6 py-4 border-b border-red-500/10 flex items-center justify-between bg-[#0A0A0F]/50">
                <h3 className="text-xl font-bold text-white">{title}</h3>
                <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-full transition-colors"
              aria-label="Close modal">
              
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
          }

            {!title &&
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-full transition-colors z-10"
            aria-label="Close modal">
            
                <XIcon className="w-5 h-5" />
              </button>
          }

            <div className="p-6 overflow-y-auto flex-1">{children}</div>

            {footer &&
          <div className="px-6 py-4 border-t border-red-500/10 bg-[#0A0A0F]/50 flex justify-end space-x-3">
                {footer}
              </div>
          }
          </motion.div>
        </div>
      }
    </AnimatePresence>);

}