import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Check, X, ArrowLeft } from 'lucide-react';
import { sciFiAudio } from './SoundEffects';

interface TargetDatePickerProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const TIME_BLOCKS_1HR = [
  '08:00 AM - 09:00 AM',
  '09:00 AM - 10:00 AM',
  '10:00 AM - 11:00 AM',
  '11:00 AM - 12:00 PM',
  '12:00 PM - 01:00 PM',
  '01:00 PM - 02:00 PM',
  '02:00 PM - 03:00 PM',
  '03:00 PM - 04:00 PM',
  '04:00 PM - 05:00 PM',
  '05:00 PM - 06:00 PM',
  '06:00 PM - 07:00 PM',
  '07:00 PM - 08:00 PM'
];

export const TargetDatePicker: React.FC<TargetDatePickerProps> = ({
  value,
  onChange,
  placeholder = 'Select target date & time...',
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'date' | 'time'>('date');
  const [currentViewDate, setCurrentViewDate] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeBlock, setSelectedTimeBlock] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Calendar calculations
  const year = currentViewDate.getFullYear();
  const month = currentViewDate.getMonth();

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    sciFiAudio.playClick();
    setCurrentViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    sciFiAudio.playClick();
    setCurrentViewDate(new Date(year, month + 1, 1));
  };

  const handleDateClick = (dayNum: number) => {
    sciFiAudio.playClick();
    const newSelected = new Date(year, month, dayNum);
    setSelectedDate(newSelected);
    setStep('time'); // Automatically transition to time selection step
  };

  const handleTimeBlockSelect = (timeSlot: string) => {
    sciFiAudio.playSuccess();
    setSelectedTimeBlock(timeSlot);

    if (selectedDate) {
      const dateStr = selectedDate.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
      const formattedResult = `${dateStr} @ ${timeSlot}`;
      onChange(formattedResult);
    } else {
      onChange(timeSlot);
    }

    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    sciFiAudio.playClick();
    setSelectedDate(null);
    setSelectedTimeBlock(null);
    onChange('');
    setStep('date');
  };

  const today = new Date();
  const isToday = (dayNum: number) => {
    return (
      today.getDate() === dayNum &&
      today.getMonth() === month &&
      today.getFullYear() === year
    );
  };

  const isSelectedDay = (dayNum: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === dayNum &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Target Date Input Field Trigger */}
      <div className="relative">
        <input
          type="text"
          readOnly
          required={required}
          value={value}
          onClick={() => {
            sciFiAudio.playClick();
            setIsOpen(!isOpen);
            if (!selectedDate) setStep('date');
          }}
          placeholder={placeholder}
          className="w-full bg-brand-gray-dark border border-brand-border hover:border-brand-green/60 rounded-xl p-3 pr-20 text-sm text-white focus:outline-none focus:border-brand-green cursor-pointer transition-all shadow-inner"
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none text-brand-green">
          <CalendarIcon className="w-4 h-4" />
          <Clock className="w-3.5 h-3.5 text-brand-light-gray" />
        </div>

        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            title="Clear date"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Calendar & Time Picker Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-[10010] mt-2 left-0 right-0 sm:left-auto sm:right-0 w-full sm:w-[360px] bg-[#0d121d] border border-brand-border/90 rounded-2xl p-4 shadow-2xl backdrop-blur-xl text-white font-mono space-y-4"
          >
            {/* Step Header */}
            <div className="flex items-center justify-between border-b border-brand-border/60 pb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-green">
                  {step === 'date' ? 'Step 1: Select Date' : 'Step 2: Select 1-Hour Time Block'}
                </span>
              </div>

              {step === 'time' && (
                <button
                  type="button"
                  onClick={() => {
                    sciFiAudio.playClick();
                    setStep('date');
                  }}
                  className="text-[10px] text-brand-light-gray hover:text-white flex items-center gap-1 bg-brand-gray-dark border border-brand-border px-2 py-1 rounded-lg transition-all hover:border-brand-green"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Back to Calendar</span>
                </button>
              )}
            </div>

            {/* STEP 1: CALENDAR VIEW */}
            {step === 'date' && (
              <div className="space-y-3">
                {/* Month/Year Navigation */}
                <div className="flex items-center justify-between text-xs font-bold">
                  <button
                    type="button"
                    onClick={handlePrevMonth}
                    className="p-1.5 rounded-lg bg-brand-gray-dark border border-brand-border text-brand-light-gray hover:text-white hover:border-brand-green transition-all"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <span className="text-sm font-black text-white tracking-wide">
                    {MONTH_NAMES[month]} {year}
                  </span>

                  <button
                    type="button"
                    onClick={handleNextMonth}
                    className="p-1.5 rounded-lg bg-brand-gray-dark border border-brand-border text-brand-light-gray hover:text-white hover:border-brand-green transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Days of Week Header */}
                <div className="grid grid-cols-7 text-center text-[10px] text-brand-light-gray uppercase font-bold py-1 border-b border-brand-border/40">
                  {DAYS_OF_WEEK.map((day) => (
                    <div key={day}>{day}</div>
                  ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {/* Empty cells before month start */}
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} className="p-2" />
                  ))}

                  {/* Days 1 to totalDaysInMonth */}
                  {Array.from({ length: totalDaysInMonth }).map((_, i) => {
                    const dayNum = i + 1;
                    const selected = isSelectedDay(dayNum);
                    const currentDay = isToday(dayNum);

                    return (
                      <button
                        key={`day-${dayNum}`}
                        type="button"
                        onClick={() => handleDateClick(dayNum)}
                        className={`p-2 rounded-xl text-xs font-bold transition-all relative cursor-pointer ${
                          selected
                            ? 'bg-brand-green text-brand-black shadow-lg shadow-brand-green/30 scale-105'
                            : currentDay
                            ? 'bg-brand-green/20 text-brand-green border border-brand-green/50 hover:bg-brand-green/30'
                            : 'hover:bg-brand-gray-dark text-slate-200 hover:text-white'
                        }`}
                      >
                        {dayNum}
                        {currentDay && !selected && (
                          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-brand-green" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 2: TIME SLOT SELECTOR (1-HOUR BLOCKS) */}
            {step === 'time' && (
              <div className="space-y-3">
                {selectedDate && (
                  <div className="bg-brand-gray-dark p-2.5 rounded-xl border border-brand-border flex items-center justify-between text-xs">
                    <span className="text-brand-light-gray">Selected Date:</span>
                    <strong className="text-brand-green">
                      {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </strong>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] text-brand-light-gray uppercase font-bold block">
                    Pick 1-Hour Session Block:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
                    {TIME_BLOCKS_1HR.map((timeSlot) => {
                      const isSelectedSlot = selectedTimeBlock === timeSlot;
                      return (
                        <button
                          key={timeSlot}
                          type="button"
                          onClick={() => handleTimeBlockSelect(timeSlot)}
                          className={`p-2 rounded-xl text-[11px] font-bold border transition-all flex items-center justify-between cursor-pointer ${
                            isSelectedSlot
                              ? 'bg-brand-green text-brand-black border-brand-green shadow-md shadow-brand-green/20'
                              : 'bg-brand-gray-dark border-brand-border/80 text-slate-200 hover:border-brand-green hover:text-white hover:bg-brand-green/10'
                          }`}
                        >
                          <span>{timeSlot}</span>
                          {isSelectedSlot && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Modal Footer Note */}
            <div className="pt-2 border-t border-brand-border/40 text-[10px] text-brand-light-gray flex items-center justify-between">
              <span>⏰ 1-Hour Dedicated Blocks</span>
              <span>In-Person or Virtual</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
