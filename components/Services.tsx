import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Briefcase, Calendar, MapPin, CheckCircle, ArrowRight, Shield, Sparkles, BookOpen, Clock, Building2, Send } from 'lucide-react';
import { TargetDatePicker } from './TargetDatePicker';
import { LocationPicker } from './LocationPicker';

interface ServicesProps {
  onSelectContact?: (serviceName: string) => void;
}

export const Services: React.FC<ServicesProps> = ({ onSelectContact }) => {
  const [activeTab, setActiveTab] = useState<'prompting' | 'formation'>('prompting');
  const [bookingService, setBookingService] = useState<string | null>(null);
  
  // Booking Form State
  const [bookingData, setBookingData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    preferredDate: '',
    groupSize: '1-5 participants',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const scriptUrl = 'https://script.google.com/macros/s/AKfycbwcqP5oYKfswzNYsBd1qqOVTZ5oc3EUN81a_nz8rpn2WmWuVSt7gcU3VVQ_uuhnWxtk/exec';
    
    try {
      const messageBody = `[IN-PERSON SERVICE BOOKING REQUEST]
Service: ${bookingService}
Preferred Location: ${bookingData.location || 'In-Person Studio'}
Preferred Date/Time: ${bookingData.preferredDate || 'Flexible'}
Group Size: ${bookingData.groupSize}
Phone: ${bookingData.phone || 'N/A'}
Notes: ${bookingData.notes}`;

      const params = new URLSearchParams({
        name: bookingData.name,
        email: bookingData.email,
        message: messageBody,
        _t: Date.now().toString()
      });

      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      iframe.src = `${scriptUrl}?${params.toString()}`;

      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 4000);

      setIsSubmitting(false);
      setBookingSuccess(true);
    } catch (err) {
      console.error('Booking submission error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Header Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 sm:mb-16"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs font-mono font-bold uppercase tracking-widest mb-6">
          <MapPin className="w-4 h-4 text-brand-green animate-bounce" />
          <span>IN-PERSON PROFESSIONAL SERVICES</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight mb-6 leading-none">
          In-Person <span className="text-brand-green">Mastery & Business</span> Setup
        </h1>
        
        <p className="text-lg sm:text-xl text-brand-light-gray max-w-3xl mx-auto leading-relaxed">
          Accelerate your growth with face-to-face instruction and hands-on guidance. We offer private, in-person prompt engineering cohorts and comprehensive business formation services tailored for founders and tech innovators.
        </p>
      </motion.div>

      {/* Main Navigation Tabs */}
      <div className="flex justify-center mb-12">
        <div className="inline-flex p-1.5 rounded-2xl bg-brand-gray-dark border border-brand-border/80 max-w-full overflow-x-auto">
          <button
            onClick={() => { setActiveTab('prompting'); setBookingService(null); }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
              activeTab === 'prompting'
                ? 'bg-brand-green text-brand-black shadow-lg shadow-brand-green/20 font-black'
                : 'text-brand-light-gray hover:text-white'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>In-Person Prompt Classes</span>
          </button>
          
          <button
            onClick={() => { setActiveTab('formation'); setBookingService(null); }}
            className={`flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold tracking-wide uppercase transition-all duration-200 cursor-pointer ${
              activeTab === 'formation'
                ? 'bg-brand-green text-brand-black shadow-lg shadow-brand-green/20 font-black'
                : 'text-brand-light-gray hover:text-white'
            }`}
          >
            <Briefcase className="w-5 h-5" />
            <span>In-Person Business Formation</span>
          </button>
        </div>
      </div>

      {/* TAB 1: IN-PERSON PROMPT ENGINEERING CLASSES */}
      {activeTab === 'prompting' && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* Class Hero Banner */}
          <div className="tech-card rounded-3xl p-8 sm:p-12 border border-brand-border/80 bg-gradient-to-br from-brand-gray-dark via-brand-black to-brand-gray-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden lg:block">
              <BookOpen className="w-72 h-72 text-brand-green" />
            </div>

            <div className="max-w-3xl space-y-6 relative z-10">
              <span className="font-mono text-xs text-brand-green font-bold uppercase tracking-widest bg-brand-green/10 border border-brand-green/30 px-3 py-1 rounded-md">
                HIGH-IMPACT IN-PERSON WORKSHOPS
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                Master AI Prompt Engineering <span className="text-brand-green">Face-to-Face</span>
              </h2>
              <p className="text-brand-light-gray text-base sm:text-lg leading-relaxed">
                Step away from generic online tutorials. Sit down with senior prompt architects and AI researchers for an intensive, in-person learning experience. Learn advanced context window optimization, chain-of-thought architectures, multi-agent prompting, and real-time model debugging.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-black/60 border border-brand-border">
                  <MapPin className="w-5 h-5 text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs text-brand-light-gray font-mono">LOCATION</p>
                    <p className="text-sm font-bold text-white">In-Studio or On-Site</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-black/60 border border-brand-border">
                  <Users className="w-5 h-5 text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs text-brand-light-gray font-mono">FORMAT</p>
                    <p className="text-sm font-bold text-white">1-on-1 or Small Cohort</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-black/60 border border-brand-border">
                  <Clock className="w-5 h-5 text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs text-brand-light-gray font-mono">DURATION</p>
                    <p className="text-sm font-bold text-white">Half-Day or Full Bootcamps</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Options / Offerings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Offering 1 */}
            <div className="tech-card p-8 rounded-2xl flex flex-col justify-between border border-brand-border/80 hover:border-brand-green/50 transition-all group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="p-3 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/20">
                    <Sparkles className="w-6 h-6" />
                  </span>
                  <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded">
                    FOUNDATION
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                  1-on-1 Private Executive Session
                </h3>
                <p className="text-brand-light-gray text-sm leading-relaxed">
                  Tailored specifically for founders, executives, and leaders. Master prompt structuring, system instruction tuning, and generative workflows for your exact industry use cases.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>3-Hour Intensive In-Person Deep Dive</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Custom System Instruction Blueprints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Private Q&A & Workflow Audits</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingService('1-on-1 Executive Prompt Class')}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-brand-green text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book Private Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Offering 2 */}
            <div className="tech-card p-8 rounded-2xl flex flex-col justify-between border-2 border-brand-green/60 bg-brand-black/80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-brand-green text-brand-black font-mono text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="p-3 rounded-xl bg-brand-green/20 text-brand-green border border-brand-green/40">
                    <Users className="w-6 h-6" />
                  </span>
                  <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded">
                    TEAM COHORT
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                  In-Person Team & Studio Bootcamp
                </h3>
                <p className="text-brand-light-gray text-sm leading-relaxed">
                  Interactive workshop for teams (up to 12 participants). Hands-on lab exercises building structured prompts, Few-Shot frameworks, RAG grounding, and multi-agent loops.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Full-Day (6-Hour) Interactive Workshop</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Live Prompt Battle & Debugging Labs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Team Workbooks & Certificate of Completion</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingService('In-Person Team Bootcamp')}
                className="mt-8 w-full py-3.5 px-4 rounded-xl bg-brand-green text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 cursor-pointer"
              >
                <span>Request Team Cohort</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Offering 3 */}
            <div className="tech-card p-8 rounded-2xl flex flex-col justify-between border border-brand-border/80 hover:border-brand-green/50 transition-all group">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <span className="p-3 rounded-xl bg-brand-green/10 text-brand-green border border-brand-green/20">
                    <Building2 className="w-6 h-6" />
                  </span>
                  <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded">
                    ENTERPRISE
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                  Corporate In-House AI Masterclass
                </h3>
                <p className="text-brand-light-gray text-sm leading-relaxed">
                  We bring our instructors and hands-on lab directly to your company headquarters or venue. Custom tailored curriculum aligned with your enterprise AI tech stack and compliance rules.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>On-Site at Your Office Location</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Tailored to Your Proprietary Tools & Models</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Post-Class Ongoing Support & Audits</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingService('Corporate In-House AI Masterclass')}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-brand-green text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Schedule On-Site Class</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 2: IN-PERSON BUSINESS FORMATION SERVICES */}
      {activeTab === 'formation' && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-12"
        >
          {/* Business Formation Hero */}
          <div className="tech-card rounded-3xl p-8 sm:p-12 border border-brand-border/80 bg-gradient-to-br from-brand-gray-dark via-brand-black to-brand-gray-dark relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none hidden lg:block">
              <Building2 className="w-72 h-72 text-brand-green" />
            </div>

            <div className="max-w-3xl space-y-6 relative z-10">
              <span className="font-mono text-xs text-brand-green font-bold uppercase tracking-widest bg-brand-green/10 border border-brand-green/30 px-3 py-1 rounded-md">
                END-TO-END IN-PERSON CONSULTATION
              </span>
              <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                In-Person <span className="text-brand-green">Business Formation</span> & Tech Stack Setup
              </h2>
              <p className="text-brand-light-gray text-base sm:text-lg leading-relaxed">
                Launch your business entity with total confidence. Sit down with business formation specialists to structure your LLC, C-Corp, or DBA, secure your EIN, draft operating agreements, and set up an AI-integrated modern business stack.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-black/60 border border-brand-border">
                  <Shield className="w-5 h-5 text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs text-brand-light-gray font-mono">LEGAL SETUP</p>
                    <p className="text-sm font-bold text-white">LLC, C-Corp & DBA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-black/60 border border-brand-border">
                  <Briefcase className="w-5 h-5 text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs text-brand-light-gray font-mono">TAX & COMPLIANCE</p>
                    <p className="text-sm font-bold text-white">EIN & Operating Agreements</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-black/60 border border-brand-border">
                  <Sparkles className="w-5 h-5 text-brand-green shrink-0" />
                  <div>
                    <p className="text-xs text-brand-light-gray font-mono">AI TECH STACK</p>
                    <p className="text-sm font-bold text-white">Domain, Email & AI Automation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Business Formation Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Package 1 */}
            <div className="tech-card p-8 rounded-2xl flex flex-col justify-between border border-brand-border/80 hover:border-brand-green/50 transition-all group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded">
                  ESSENTIALS
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                  In-Person LLC Launchpad
                </h3>
                <p className="text-brand-light-gray text-sm leading-relaxed">
                  Complete 1-on-1 in-person session to register your LLC, apply for federal EIN, draft standard operating agreements, and set up official business banking guidance.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Articles of Organization Filing</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Federal EIN / Tax ID Acquisition</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Custom Operating Agreement Review</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingService('In-Person LLC Launchpad')}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-brand-green text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Book LLC Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Package 2 */}
            <div className="tech-card p-8 rounded-2xl flex flex-col justify-between border-2 border-brand-green/60 bg-brand-black/80 relative overflow-hidden group">
              <div className="absolute top-0 right-0 bg-brand-green text-brand-black font-mono text-[10px] font-black uppercase px-3 py-1 rounded-bl-lg">
                RECOMMENDED FOR STARTUPS
              </div>

              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded">
                  FULL SUITE
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                  AI Startup & C-Corp Incorporation
                </h3>
                <p className="text-brand-light-gray text-sm leading-relaxed">
                  Comprehensive in-person legal setup for tech startups and AI ventures seeking investor-ready Delaware or State C-Corp structure, stock issuance, and IP protection.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>C-Corp Incorporation & Bylaws</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Stock Share Structure & Founders Agreements</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>IP Assignment & Registered Agent Services</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingService('AI Startup & C-Corp Incorporation')}
                className="mt-8 w-full py-3.5 px-4 rounded-xl bg-brand-green text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-green/20 cursor-pointer"
              >
                <span>Schedule Startup Session</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Package 3 */}
            <div className="tech-card p-8 rounded-2xl flex flex-col justify-between border border-brand-border/80 hover:border-brand-green/50 transition-all group">
              <div className="space-y-4">
                <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 px-2.5 py-1 rounded">
                  TURNKEY STACK
                </span>
                <h3 className="text-2xl font-bold text-white group-hover:text-brand-green transition-colors">
                  Business Setup + AI Operational Stack
                </h3>
                <p className="text-brand-light-gray text-sm leading-relaxed">
                  Not just legal entity setup—we also configure your digital workspace in-person: business domain, custom email, payment processor integration, and automated AI bots.
                </p>
                <ul className="space-y-2.5 pt-4 text-xs font-mono text-white/90">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Complete LLC/Corp Filing + EIN</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Domain, Google Workspace & Stripe Setup</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-brand-green shrink-0" />
                    <span>Customer Email AI Bot Configuration</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => setBookingService('Business Setup + AI Operational Stack')}
                className="mt-8 w-full py-3 px-4 rounded-xl bg-brand-green text-brand-black font-extrabold text-xs uppercase tracking-wider hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Request Turnkey Package</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* MODAL: IN-PERSON BOOKING REQUEST FORM */}
      <AnimatePresence>
        {bookingService && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-brand-black border border-brand-border rounded-3xl p-6 sm:p-10 max-w-xl w-full relative shadow-2xl overflow-hidden my-auto max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => { setBookingService(null); setBookingSuccess(false); }}
                className="absolute top-6 right-6 text-gray-400 hover:text-white text-xl font-bold p-2"
              >
                ✕
              </button>

              {!bookingSuccess ? (
                <div>
                  <div className="mb-6">
                    <span className="font-mono text-xs text-brand-green font-bold uppercase bg-brand-green/10 border border-brand-green/30 px-3 py-1 rounded">
                      IN-PERSON SESSION REQUEST
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mt-3">
                      Book: <span className="text-brand-green">{bookingService}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-brand-light-gray mt-1">
                      Fill out your details below. Our team will contact you directly within 24 hours to confirm time, location, and itinerary.
                    </p>
                  </div>

                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        placeholder="e.g. Sarah Jenkins"
                        className="w-full bg-brand-gray-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={bookingData.email}
                          onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                          placeholder="sarah@example.com"
                          className="w-full bg-brand-gray-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-green"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={bookingData.phone}
                          onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                          placeholder="(555) 000-0000"
                          className="w-full bg-brand-gray-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-green"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                          Preferred Location (GPS Verified)
                        </label>
                        <LocationPicker
                          value={bookingData.location}
                          onChange={(val) => setBookingData({ ...bookingData, location: val })}
                          placeholder="Click to detect GPS or search real location..."
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                          Target Date & Time Block
                        </label>
                        <TargetDatePicker
                          value={bookingData.preferredDate}
                          onChange={(val) => setBookingData({ ...bookingData, preferredDate: val })}
                          placeholder="Click to pick date & time block..."
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                        Group / Participant Count
                      </label>
                      <select
                        value={bookingData.groupSize}
                        onChange={(e) => setBookingData({ ...bookingData, groupSize: e.target.value })}
                        className="w-full bg-brand-gray-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-green"
                      >
                        <option value="1 Participant (Solo / Executive)">1 Participant (Solo / Executive)</option>
                        <option value="2-5 Participants (Small Team)">2-5 Participants (Small Team)</option>
                        <option value="6-15 Participants (Cohort Workshop)">6-15 Participants (Cohort Workshop)</option>
                        <option value="15+ Participants (Enterprise HQ)">15+ Participants (Enterprise HQ)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-brand-light-gray mb-1">
                        Additional Notes or Specific Goals
                      </label>
                      <textarea
                        rows={3}
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        placeholder="Tell us about your company, industry focus, or specific questions..."
                        className="w-full bg-brand-gray-dark border border-brand-border rounded-xl p-3 text-sm text-white focus:outline-none focus:border-brand-green resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-4 rounded-xl bg-brand-green text-brand-black font-black text-xs uppercase tracking-widest hover:bg-brand-green-dark transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-green/20"
                    >
                      <span>{isSubmitting ? 'Transmitting Request...' : 'Confirm In-Person Booking'}</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              ) : (
                <div className="text-center py-8 space-y-6">
                  <div className="w-20 h-20 bg-brand-green/20 rounded-full flex items-center justify-center mx-auto text-brand-green">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-black text-white">Booking Transmitted!</h3>
                  <p className="text-brand-light-gray text-sm max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="text-white font-bold">{bookingData.name}</span>. Your request for <span className="text-brand-green font-bold">{bookingService}</span> has been logged. Our coordinator will reach out to <span className="text-white font-bold">{bookingData.email}</span> shortly.
                  </p>
                  <button
                    onClick={() => { setBookingService(null); setBookingSuccess(false); }}
                    className="px-8 py-3 rounded-xl bg-brand-green text-brand-black font-bold text-xs uppercase tracking-wider hover:bg-brand-green-dark cursor-pointer"
                  >
                    Close Window
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
