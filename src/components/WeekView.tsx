import React from 'react';
import { Plus, Clock, MapPin, Disc } from 'lucide-react';
import { DJEvent, EVENT_TYPES_CONFIG } from '../types/calendar';
import {
  DAY_NAMES_ES,
  getWeekDays,
} from '../utils/dateUtils';

interface WeekViewProps {
  currentDate: Date;
  events: DJEvent[];
  onAnnotateDate: (dateKey: string) => void;
  onViewEvent: (event: DJEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onAnnotateDate,
  onViewEvent,
}) => {
  const weekDays = getWeekDays(currentDate);

  // Map events by dateKey
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
    <div className="flex-1 flex flex-col bg-black overflow-hidden text-white">
      {/* Week Header Row */}
      <div className="grid grid-cols-7 border-b-2 border-white/20 bg-[#0a0a0c] shrink-0">
        {weekDays.map((day, idx) => {
          const dayEvents = eventsByDate.get(day.dateKey) || [];
          const hasEvents = dayEvents.length > 0;
          const dayName = DAY_NAMES_ES[idx];

          return (
            <div
              key={day.dateKey}
              onClick={() => onAnnotateDate(day.dateKey)}
              className={`p-2 sm:p-3 text-center border-r border-white/10 last:border-r-0 cursor-pointer transition-colors ${
                hasEvents
                  ? 'bg-[#00ff66] text-black border-b-2 border-b-white'
                  : 'hover:bg-neutral-800'
              }`}
            >
              <div
                className={`text-[11px] sm:text-xs font-black uppercase tracking-wider ${
                  hasEvents ? 'text-black' : 'text-neutral-300'
                }`}
              >
                {dayName.slice(0, 3)}
              </div>
              <div className="mt-0.5 flex items-center justify-center gap-1">
                <span
                  className={`text-lg sm:text-2xl font-black tabular-nums ${
                    hasEvents
                      ? 'text-black'
                      : day.isToday
                      ? 'px-2 py-0.5 bg-white text-black rounded-lg'
                      : 'text-white'
                  }`}
                >
                  {day.dayNumber}
                </span>
              </div>
              {hasEvents && (
                <div className="mt-1 text-[10px] font-black text-black bg-black/15 py-0.5 px-1 rounded truncate">
                  {dayEvents.length} Evento{dayEvents.length > 1 ? 's' : ''}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Week Days Columns */}
      <div className="flex-1 grid grid-cols-7 divide-x divide-white/10 overflow-y-auto bg-black">
        {weekDays.map((day) => {
          const dayEvents = eventsByDate.get(day.dateKey) || [];
          const hasEvents = dayEvents.length > 0;

          return (
            <div
              key={day.dateKey}
              className={`p-2 flex flex-col min-h-[350px] transition-colors ${
                hasEvents ? 'bg-[#00ff66]/10' : 'bg-[#09090b] hover:bg-[#121215]'
              }`}
            >
              {/* Add event button on day header */}
              <div className="mb-2 flex items-center justify-between pb-1 border-b border-white/10">
                <span className="text-[10px] font-black text-neutral-400 uppercase">
                  {dayEvents.length > 0 ? 'Agendados' : 'Libre'}
                </span>
                <button
                  onClick={() => onAnnotateDate(day.dateKey)}
                  className="p-1 rounded bg-[#00ff66] text-black hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  title="Anotar fecha aquí"
                >
                  <Plus className="w-3 h-3 stroke-[3]" />
                </button>
              </div>

              {/* Event Cards in column */}
              <div className="space-y-2 flex-1">
                {dayEvents.length > 0 ? (
                  dayEvents.map((evt) => {
                    const typeConfig = EVENT_TYPES_CONFIG[evt.eventType];
                    return (
                      <div
                        key={evt.id}
                        onClick={() => onViewEvent(evt)}
                        className="p-2.5 rounded-xl bg-[#00ff66] border-2 border-black text-black shadow-[0_0_12px_rgba(0,255,102,0.4)] hover:scale-[1.02] transition-transform cursor-pointer space-y-1.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-black text-black leading-tight">
                            {evt.title}
                          </span>
                          <span className="text-xs">{typeConfig.icon}</span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] font-extrabold text-black">
                          <Clock className="w-3 h-3 shrink-0" />
                          <span>
                            {evt.startTime} - {evt.endTime} hs
                          </span>
                        </div>

                        {evt.venue && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-black truncate">
                            <MapPin className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{evt.venue}</span>
                          </div>
                        )}

                        {evt.djAssigned && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-black truncate">
                            <Disc className="w-2.5 h-2.5 shrink-0" />
                            <span className="truncate">{evt.djAssigned}</span>
                          </div>
                        )}

                        <div className="pt-1 flex items-center justify-between border-t border-black/30 text-[9px] font-black uppercase text-black">
                          <span>{evt.status}</span>
                          {evt.totalPrice && (
                            <span className="tabular-nums">
                              ${evt.totalPrice.toLocaleString('es-AR')}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    onClick={() => onAnnotateDate(day.dateKey)}
                    className="h-full flex flex-col items-center justify-center p-4 text-center cursor-pointer opacity-30 hover:opacity-100 transition-opacity border-2 border-dashed border-neutral-700 hover:border-[#00ff66] rounded-xl"
                  >
                    <Plus className="w-6 h-6 text-white mb-1" />
                    <span className="text-xs font-black text-white">
                      Fecha Libre
                    </span>
                    <span className="text-[10px] font-bold text-[#00ff66] mt-0.5">
                      Click para anotar
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
