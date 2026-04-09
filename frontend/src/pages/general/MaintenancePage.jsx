import React from 'react';
import { Link } from 'react-router-dom';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-['Plus_Jakarta_Sans'] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#FF5E00]/10 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] opacity-30"></div>

      <div className="relative z-10 max-w-2xl w-full text-center space-y-12 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src="/logo.png" alt="Vindu" className="h-16 w-auto grayscale opacity-50" />
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#FF5E00] text-xs font-bold uppercase tracking-[0.2em]">
            <span className="w-2 h-2 rounded-full bg-[#FF5E00] animate-pulse"></span>
            Under Development
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
            Building the <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF5E00] to-amber-500">Future of Food.</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl font-medium max-w-lg mx-auto leading-relaxed">
            We're currently refining the Vindu experience. Our digital kitchen is almost ready to serve something extraordinary.
          </p>
        </div>

        {/* Interaction */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Link 
            to="/landing" 
            className="w-full sm:w-auto px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            Explore Landing Page
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          
          <div className="w-full sm:w-auto flex items-center bg-[#111] border border-white/5 rounded-2xl px-4 py-3 group focus-within:border-[#FF5E00]/50 transition-all">
            <input 
              type="email" 
              placeholder="Enter email for early access" 
              className="bg-transparent border-none outline-none text-sm font-medium text-gray-200 placeholder:text-gray-600 w-full sm:w-48"
            />
            <button className="text-[#FF5E00] font-bold text-sm px-2 hover:translate-x-1 transition-transform">Notify</button>
          </div>
        </div>

        {/* Socials Placeholder */}
        <div className="pt-12 flex items-center justify-center gap-8 text-gray-500">
          <span className="text-xs font-bold uppercase tracking-widest">Follow our journey</span>
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center hover:text-white hover:border-white/20 border border-transparent transition-all cursor-pointer">IG</div>
            <div className="w-10 h-10 rounded-xl bg-[#111] flex items-center justify-center hover:text-white hover:border-white/20 border border-transparent transition-all cursor-pointer">X</div>
          </div>
        </div>
      </div>

      {/* Footer Text */}
      <div className="absolute bottom-10 left-0 right-0 text-center text-[10px] text-gray-700 font-bold uppercase tracking-[0.3em]">
        &copy; 2026 Vindu Technologies &bull; Bengaluru, India
      </div>
    </div>
  );
};

export default MaintenancePage;
