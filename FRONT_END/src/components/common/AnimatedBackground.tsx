import React from 'react';
export const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0F] via-[#111118] to-[#0A0A0F]" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(239, 68, 68, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(239, 68, 68, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
      

      {/* Gradient orbs */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-red-500/10 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-red-600/10 rounded-full blur-[150px] animate-pulse" />

      {/* Floating particles */}
      {[...Array(30)].map((_, i) =>
      <div
        key={i}
        className="absolute w-1 h-1 bg-red-500/40 rounded-full animate-float"
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${5 + Math.random() * 10}s`
        }} />

      )}
    </div>);

};