import React from 'react';
import { Plus, Clock, MapPin } from 'lucide-react';
import { DJEvent, EVENT_TYPES_CONFIG } from '../types/calendar';
import {
  DAY_NAMES_SHORT_ES,
  getMonthMatrix,
} from '../utils/dateUtils';

interface MonthViewProps {
  currentDate: Date;
  events: DJEvent[];
  onSelectDate: (date: Date) => void;
  onAnnotateDate: (dateKey: string) => void;
  onViewEvent: (event: DJEvent) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onSelectDate,
  onAnnotateDate,
  onViewEvent,
}) => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const daysMatrix = getMonthMatrix(currentYear, currentMonth);

  // Group events by dateKey for fast lookup
  const eventsByDate = React.useMemo(() => {
    const map = new Map<string, DJEvent[]>();
    for (const evt of events) {
      const list = map.get(evt.date) || [];
      list.push(evt);
      map.set(evt.date, list);
    }
    return map;
  }, [events]);

  return (
    <div className="flex-1 flex flex-col bg-black overflow-hidden select-none">
      {/* Weekday headers - Crisp White Text */}
      <div className="grid grid-cols-7 border-b-2 border-white/20 bg-[#0a0a0c] shrink-0">
        {DAY_NAMES_SHORT_ES.map((dayName, idx) => {
          const isWeekend = idx >= 5; // Saturday & Sunday are DJ peak days
          return (
            <div
              key={dayName}
              className={`py-2.5 text-center text-xs md:text-sm font-black text-white tracking-wider border-r border-white/10 last:border-r-0 ${
                isWeekend ? 'bg-[#121216]' : ''
              }`}
            >
              <span className="text-white font-black">{dayName}</span>
              {isWeekend && (
                <span className="hidden sm:inline-block ml-1.5 text-[10px] text-[#00ff66] font-black uppercase">
                  (Finde)
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Days Grid - Dark theme with Green Fluo booked dates */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr overflow-y-auto divide-x divide-y divide-white/10 border-b border-white/10 bg-black">
        {daysMatrix.map((cell) => {
          const dayEvents = eventsByDate.get(cell.dateKey) || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={cell.dateKey}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  onAnnotateDate(cell.dateKey);
                }
              }}
              className={`min-h-[105px] md:min-h-[125px] p-1.5 md:p-2 flex flex-col transition-all group relative cursor-pointer ${
                hasEvents
                  ? 'bg-[#00ff66] border-2 border-black shadow-[0_0_15px_rgba(0,255,102,0.45)] hover:brightness-[1.04]'
                  : cell.isCurrentMonth
                  ? 'bg-[#09090b] hover:bg-[#141418]'
                  : 'bg-[#040406] hover:bg-[#0d0d10]'
              }`}
              title={
                hasEvents
                  ? `${dayEvents.length} evento(s) anotado(s) el ${cell.dateKey}`
                  : `Hacer click para anotar evento el ${cell.dateKey}`
              }
            >
              {/* Day Cell Top Bar: Day Number (White if free, Black if Fluo Green) */}
              <div className="flex items-center justify-between mb-1 pointer-events-none">
                <div className="flex items-center gap-1">
                  <span
                    className={`font-black tracking-tight ${
                      hasEvents
                        ? 'text-black text-sm md:text-base px-1.5 py-0.5 bg-black/15 rounded border border-black/30 font-black'
                        : cell.isToday
                        ? 'text-black text-sm md:text-base px-2 py-0.5 bg-white rounded font-black'
                        : cell.isCurrentMonth
                        ? 'text-white text-sm md:text-base font-black'
                        : 'text-neutral-600 text-xs md:text-sm font-bold'
                    }`}
                  >
                    {cell.dayNumber}
                  </span>

                  {cell.isToday && (
                    <span
                      className={`text-[9px] font-black uppercase px-1 py-0.2 rounded border ${
                        hasEvents
                          ? 'bg-black text-[#00ff66] border-black'
                          : 'bg-[#00ff66] text-black border-white'
                      }`}
                    >
                      Hoy
                    </span>
                  )}
                </div>

                {/* Event count or quick plus icon */}
                <div className="pointer-events-auto flex items-center gap-1">
                  {hasEvents ? (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnnotateDate(cell.dateKey);
                      }}
                      className="p-1 rounded bg-black text-[#00ff66] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Agregar otro evento en este día"
                      aria-label="Agregar otro evento"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAnnotateDate(cell.dateKey);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded bg-white text-black hover:bg-[#00ff66] hover:text-black border border-white transition-all cursor-pointer"
                      title={`Anotar evento el ${cell.dayNumber}`}
                      aria-label={`Anotar evento el ${cell.dayNumber}`}
                    >
                      <Plus className="w-3 h-3 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>

              {/* Events in this day */}
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[140px] pr-0.5">
                {hasEvents ? (
                  dayEvents.map((evt) => {
                    return (
                      <div
                        key={evt.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewEvent(evt);
                        }}
                        className="p-1.5 rounded-lg bg-black/15 hover:bg-black/25 border-2 border-black text-black transition-all shadow-sm cursor-pointer group/evt"
                        title="Click para ver o editar evento"
                      >
                        {/* Event Name - Bold Black text over Fluo Green */}
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs md:text-sm font-black text-black leading-tight line-clamp-2 break-words">
                            {evt.title}
                          </span>
                        </div>

                        {/* Event Details: Time & Venue */}
                        <div className="mt-1 flex items-center justify-between gap-1 text-[10px] md:text-[11px] font-extrabold text-black">
                          <div className="flex items-center gap-1 truncate">
                            <Clock className="w-3 h-3 shrink-0" />
                            <span>{evt.startTime} hs</span>
                          </div>
                          {evt.status === 'confirmado' && (
                            <span className="text-[9px] uppercase px-1 py-0.2 bg-black text-[#00ff66] rounded font-black shrink-0">
                              CONFIRMADO
                            </span>
                          )}
                          {evt.status === 'senado' && (
                            <span className="text-[9px] uppercase px-1 py-0.2 bg-black text-white rounded font-black shrink-0">
                              SEÑADO
                            </span>
                          )}
                        </div>

                        {evt.venue && (
                          <div className="mt-0.5 flex items-center gap-1 text-[10px] font-bold text-black/90 truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  /* Empty state on hover hint */
                  <div
                    onClick={() => onAnnotateDate(cell.dateKey)}
                    className="h-full flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity"
                  >
                    <span className="text-[11px] font-black text-neutral-300 flex items-center gap-1">
                      <Plus className="w-3 h-3 text-[#00ff66]" /> Anotar fecha
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
