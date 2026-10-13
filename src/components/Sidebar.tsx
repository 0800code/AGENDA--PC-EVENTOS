import React from 'react';
import {
  Plus,
  Filter,
  CheckCircle2,
  CalendarDays,
  X,
} from 'lucide-react';
import { DJEvent, EventStatus } from '../types/calendar';
import {
  MONTH_NAMES_ES,
  DAY_NAMES_SHORT_ES,
  getMonthMatrix,
  formatDateToKey,
} from '../utils/dateUtils';
import { PCLogo } from './PCLogo';

interface SidebarProps {
  currentDate: Date;
  onSelectDate: (date: Date) => void;
  onOpenNewEventModal: () => void;
  selectedStatusFilter: EventStatus | 'all';
  onStatusFilterChange: (status: EventStatus | 'all') => void;
  events: DJEvent[];
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDate,
  onSelectDate,
  onOpenNewEventModal,
  selectedStatusFilter,
  onStatusFilterChange,
  events,
  isOpenMobile,
  onCloseMobile,
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Mini calendar matrix
  const miniCalendarDays = getMonthMatrix(currentYear, currentMonth);

  // Dates with events in the current month
  const bookedDatesSet = new Set(events.map((e) => e.date));

  // Stats for the currently viewed month
  const eventsInCurrentMonth = events.filter((e) => {
    const [y, m] = e.date.split('-').map(Number);
    return y === currentYear && m === currentMonth + 1;
  });

  const confirmedCount = eventsInCurrentMonth.filter((e) => e.status === 'confirmado').length;
  const senadosCount = eventsInCurrentMonth.filter((e) => e.status === 'senado').length;
  const presupuestoCount = eventsInCurrentMonth.filter((e) => e.status === 'presupuesto').length;

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 bottom-0 z-50 lg:z-auto w-72 sm:w-80 bg-[#09090b] border-r-2 border-white/20 flex flex-col shrink-0 overflow-y-auto transition-transform duration-200 ease-in-out text-white ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/20 lg:hidden">
          <div className="flex items-center gap-2">
            <PCLogo size={28} className="text-white" />
            <span className="text-base font-black text-white uppercase">
              PC EVENTOS
            </span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg border border-white/30 hover:bg-neutral-800"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-4 space-y-5">
          {/* Main Action Button in Verde Fluo */}
          <button
            onClick={() => {
              onOpenNewEventModal();
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#00ff66] hover:bg-[#10f543] active:scale-[0.98] border-2 border-white rounded-xl text-black font-black text-sm tracking-wide shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>+ ANOTAR FECHA DJ</span>
          </button>

          {/* Mini Calendar - Inverted Dark Theme */}
          <div className="p-3 bg-[#121214] rounded-xl border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-black text-white uppercase tracking-wider">
                {MONTH_NAMES_ES[currentMonth]} {currentYear}
              </span>
              <span className="text-[10px] font-black text-black bg-[#00ff66] px-1.5 py-0.5 rounded border border-white/30">
                {eventsInCurrentMonth.length} Fechas
              </span>
            </div>

            {/* Week days - Pure White */}
            <div className="grid grid-cols-7 gap-1 text-center mb-1">
              {DAY_NAMES_SHORT_ES.map((d) => (
                <span
                  key={d}
                  className="text-[10px] font-black text-white"
                >
                  {d[0]}
                </span>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1">
              {miniCalendarDays.map((cell, idx) => {
                const hasEvent = bookedDatesSet.has(cell.dateKey);
                const isSelectedDay =
                  formatDateToKey(currentDate) === cell.dateKey;

                return (
                  <button
                    key={`${cell.dateKey}-${idx}`}
                    onClick={() => {
                      onSelectDate(cell.date);
                      if (onCloseMobile) onCloseMobile();
                    }}
                    className={`h-7 w-full rounded flex flex-col items-center justify-center text-xs font-bold transition-all relative cursor-pointer ${
                      hasEvent
                        ? 'bg-[#00ff66] text-black font-black border border-white shadow-xs'
                        : isSelectedDay
                        ? 'bg-white text-black font-black'
                        : cell.isCurrentMonth
                        ? 'text-white hover:bg-neutral-800'
                        : 'text-neutral-600 hover:bg-neutral-900'
                    }`}
                    title={
                      hasEvent
                        ? `${cell.dayNumber}: Tiene eventos anotados`
                        : `${cell.dayNumber} ${MONTH_NAMES_ES[cell.date.getMonth()]}`
                    }
                  >
                    <span>{cell.dayNumber}</span>
                    {hasEvent && (
                      <span className="w-1 h-1 bg-black rounded-full absolute bottom-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-white/10 text-[11px] font-bold text-white">
              <span className="w-3 h-3 rounded bg-[#00ff66] border border-white shrink-0" />
              <span>Días con evento (Verde Fluo)</span>
            </div>
          </div>

          {/* Month Stats Card */}
          <div className="p-3 bg-[#121214] rounded-xl border border-white/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                <CalendarDays className="w-3.5 h-3.5 text-[#00ff66]" />
                Resumen del Mes
              </span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 pt-1">
              <div className="p-2 bg-[#18181b] rounded-lg border border-white/10 text-center">
                <div className="text-lg font-black text-[#00ff66] tabular-nums">
                  {confirmedCount}
                </div>
                <div className="text-[10px] font-bold text-neutral-300">Confirmados</div>
              </div>
              <div className="p-2 bg-[#18181b] rounded-lg border border-white/10 text-center">
                <div className="text-lg font-black text-white tabular-nums">
                  {senadosCount}
                </div>
                <div className="text-[10px] font-bold text-neutral-300">Señados</div>
              </div>
              <div className="p-2 bg-[#18181b] rounded-lg border border-white/10 text-center">
                <div className="text-lg font-black text-white tabular-nums">
                  {presupuestoCount}
                </div>
                <div className="text-[10px] font-bold text-neutral-300">Consultas</div>
              </div>
            </div>
          </div>

          {/* Filter by Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1">
                <Filter className="w-3.5 h-3.5 text-[#00ff66]" />
                Filtrar por Estado
              </span>
              {selectedStatusFilter !== 'all' && (
                <button
                  onClick={() => onStatusFilterChange('all')}
                  className="text-[11px] font-bold text-[#00ff66] underline hover:opacity-75 cursor-pointer"
                >
                  Restablecer
                </button>
              )}
            </div>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Todos los estados' },
                { id: 'confirmado', label: 'Confirmados' },
                { id: 'senado', label: 'Señados (En Reserva)' },
                { id: 'presupuesto', label: 'En Consulta' },
              ].map((item) => {
                const isSelected = selectedStatusFilter === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() =>
                      onStatusFilterChange(item.id as EventStatus | 'all')
                    }
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00ff66] text-black border-[#00ff66] font-black shadow-xs'
                        : 'bg-[#18181b] text-white border-white/10 hover:border-white/40'
                    }`}
                  >
                    <span>{item.label}</span>
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-black" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
