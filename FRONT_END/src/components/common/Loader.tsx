import React from 'react';
import { motion } from 'framer-motion';
import { LinkIcon } from 'lucide-react';
interface LoaderProps {
  fullScreen?: boolean;
  text?: string;
}
export function Loader({
  fullScreen = false,
  text = 'Loading...'
}: LoaderProps) {
  const content =
  <div className="flex flex-col items-center justify-center space-y-4 font-genos">
      <div className="relative">
        <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear'
        }}
        className="absolute inset-0 rounded-full border-t-2 border-red-500 opacity-20 w-16 h-16 -m-2" />
      
        <motion.div
        animate={{
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="bg-red-500/20 p-3 rounded-xl text-red-400">
        
          <LinkIcon className="w-6 h-6" />
        </motion.div>
      </div>
      {text &&
    <p className="text-gray-400 font-medium animate-pulse">{text}</p>
    }
    </div>;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-[#0A0A0F]/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>);

  }
  return <div className="py-8 flex justify-center">{content}</div>;
}