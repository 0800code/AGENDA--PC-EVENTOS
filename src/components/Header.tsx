import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Calendar as CalendarIcon,
  SlidersHorizontal,
} from 'lucide-react';
import { CalendarView } from '../types/calendar';
import { MONTH_NAMES_ES } from '../utils/dateUtils';
import { PCLogo } from './PCLogo';

interface HeaderProps {
  currentDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onSelectMonthYear: (year: number, month: number) => void;
  currentView: CalendarView;
  onViewChange: (view: CalendarView) => void;
  onOpenNewEventModal: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalEventsCount: number;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDate,
  onPrevMonth,
  onNextMonth,
  onToday,
  onSelectMonthYear,
  currentView,
  onViewChange,
  onOpenNewEventModal,
  searchQuery,
  onSearchChange,
  totalEventsCount,
  onToggleSidebar,
}) => {
  const [showDatePickerDropdown, setShowDatePickerDropdown] = useState(false);
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Range of years for quick selection
  const years = Array.from({ length: 8 }, (_, i) => currentYear - 2 + i);

  return (
    <header className="sticky top-0 z-30 bg-[#09090b] border-b-2 border-white/20 px-3 sm:px-6 py-3 transition-colors text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Left section: Brand with Official PC EVENTOS Logo & Navigation */}
        <div className="flex items-center justify-between lg:justify-start gap-3 sm:gap-6 flex-wrap">
          {/* Mobile sidebar toggle button */}
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg border border-white/30 text-white hover:bg-neutral-800 transition-colors"
              title="Abrir panel lateral"
              aria-label="Abrir panel lateral"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
          )}

          {/* Brand Lockup with Official PC EVENTOS Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <PCLogo size={40} className="text-white" showGlow />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white tracking-tight uppercase">
                  PC EVENTOS
                </span>
                <span className="text-[10px] font-black bg-[#00ff66] text-black px-1.5 py-0.5 rounded border border-white/40">
                  DJ PRO
                </span>
              </div>
              <p className="text-[11px] font-bold text-neutral-400 tracking-wider uppercase -mt-0.5">
                Anotador Oficial de Fechas
              </p>
            </div>
          </div>

          <div className="h-6 w-[2px] bg-white/20 hidden sm:block" />

          {/* Month / Year Navigator */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={onToday}
              className="px-3 py-1.5 text-xs sm:text-sm font-black text-white bg-[#18181b] border border-white/30 rounded-lg hover:bg-white hover:text-black active:scale-95 transition-all shadow-sm cursor-pointer"
              title="Ir a la fecha actual"
            >
              Hoy
            </button>

            <div className="flex items-center border border-white/30 rounded-lg overflow-hidden bg-[#18181b] shadow-sm">
              <button
                onClick={onPrevMonth}
                className="p-1.5 hover:bg-neutral-800 text-white active:bg-neutral-700 transition-colors cursor-pointer"
                title="Mes anterior"
                aria-label="Mes anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-[1px] h-5 bg-white/20" />
              <button
                onClick={onNextMonth}
                className="p-1.5 hover:bg-neutral-800 text-white active:bg-neutral-700 transition-colors cursor-pointer"
                title="Mes siguiente"
                aria-label="Mes siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Clickable Month/Year Title - Pure White Text */}
            <div className="relative">
              <button
                onClick={() => setShowDatePickerDropdown(!showDatePickerDropdown)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-neutral-800 transition-colors group cursor-pointer"
                title="Seleccionar cualquier mes y año"
              >
                <span className="text-lg sm:text-2xl font-black text-white tracking-tight capitalize group-hover:text-[#00ff66]">
                  {MONTH_NAMES_ES[currentMonth]} {currentYear}
                </span>
                <CalendarIcon className="w-4 h-4 text-white group-hover:text-[#00ff66]" />
              </button>

              {/* Quick Jump Popover */}
              {showDatePickerDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDatePickerDropdown(false)}
                  />
                  <div className="absolute left-0 top-full mt-2 w-72 bg-[#121214] border-2 border-white/30 rounded-xl p-3 shadow-2xl z-50 text-white">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/20">
                      <span className="text-xs font-black text-white uppercase tracking-wider">
                        Saltar a cualquier fecha
                      </span>
                      <select
                        value={currentYear}
                        onChange={(e) => {
                          onSelectMonthYear(Number(e.target.value), currentMonth);
                        }}
                        className="text-xs font-bold text-white border border-white/30 rounded px-1.5 py-0.5 bg-[#18181b] cursor-pointer"
                      >
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5">
                      {MONTH_NAMES_ES.map((monthName, idx) => {
                        const isSelected = idx === currentMonth;
                        return (
                          <button
                            key={monthName}
                            onClick={() => {
                              onSelectMonthYear(currentYear, idx);
                              setShowDatePickerDropdown(false);
                            }}
                            className={`py-1.5 px-1 text-xs font-black rounded border transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#00ff66] text-black border-[#00ff66] font-extrabold shadow-sm'
                                : 'bg-[#18181b] text-white border-white/20 hover:border-white hover:bg-neutral-800'
                            }`}
                          >
                            {monthName.slice(0, 3)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right section: Search, View Switcher & Action */}
        <div className="flex items-center justify-between lg:justify-end gap-2 sm:gap-3 flex-wrap">
          {/* Quick Search */}
          <div className="relative flex-1 sm:w-56 lg:w-60">
            <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Buscar evento o salón..."
              className="w-full pl-8 pr-3 py-1.5 text-xs sm:text-sm font-bold text-white placeholder:text-neutral-500 bg-[#18181b] border border-white/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>

          {/* View Switcher: Mes | Semana | Agenda */}
          <div className="flex items-center p-0.5 bg-[#18181b] border border-white/30 rounded-lg shrink-0">
            <button
              onClick={() => onViewChange('month')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-black rounded-md transition-all cursor-pointer ${
                currentView === 'month'
                  ? 'bg-[#00ff66] text-black shadow-sm'
                  : 'text-white hover:bg-neutral-800'
              }`}
            >
              Mes
            </button>
            <button
              onClick={() => onViewChange('week')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-black rounded-md transition-all cursor-pointer ${
                currentView === 'week'
                  ? 'bg-[#00ff66] text-black shadow-sm'
                  : 'text-white hover:bg-neutral-800'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => onViewChange('agenda')}
              className={`px-2.5 sm:px-3 py-1 text-xs font-black rounded-md transition-all cursor-pointer ${
                currentView === 'agenda'
                  ? 'bg-[#00ff66] text-black shadow-sm'
                  : 'text-white hover:bg-neutral-800'
              }`}
            >
              Agenda ({totalEventsCount})
            </button>
          </div>

          {/* Primary Action Button: + Anotar Fecha */}
          <button
            onClick={onOpenNewEventModal}
            className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 text-xs sm:text-sm font-black text-black bg-[#00ff66] hover:bg-[#10f543] active:scale-95 border-2 border-white rounded-lg shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Anotar Fecha</span>
          </button>
        </div>
      </div>
    </header>
  );
};
