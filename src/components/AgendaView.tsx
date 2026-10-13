import React from 'react';
import {
  Clock,
  MapPin,
  User,
  Disc,
  Plus,
  Edit,
  Trash2,
  Calendar,
} from 'lucide-react';
import { DJEvent, EVENT_TYPES_CONFIG, STATUS_CONFIG } from '../types/calendar';
import { formatFriendlyDate } from '../utils/dateUtils';
import { PCLogo } from './PCLogo';

interface AgendaViewProps {
  events: DJEvent[];
  onViewEvent: (event: DJEvent) => void;
  onEditEvent: (event: DJEvent) => void;
  onDeleteEvent: (eventId: string) => void;
  onOpenNewEventModal: () => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  onOpenNewEventModal,
}) => {
  // Sort events chronologically
  const sortedEvents = React.useMemo(() => {
    return [...events].sort((a, b) => a.date.localeCompare(b.date));
  }, [events]);

  if (sortedEvents.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-black text-center text-white">
        <div className="w-16 h-16 rounded-2xl bg-[#00ff66] border-2 border-white flex items-center justify-center mb-4 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]">
          <Calendar className="w-8 h-8 text-black" />
        </div>
        <h3 className="text-xl font-black text-white mb-1">
          No hay fechas que coincidan con la búsqueda
        </h3>
        <p className="text-sm font-bold text-neutral-400 max-w-md mb-5">
          Puedes agregar un nuevo evento para PC EVENTOS o ajustar los filtros de búsqueda.
        </p>
        <button
          onClick={onOpenNewEventModal}
          className="px-5 py-2.5 bg-[#00ff66] hover:bg-[#10f543] border-2 border-white rounded-xl text-black font-black text-sm shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          + Anotar Primer Evento
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-black overflow-y-auto p-4 sm:p-6 space-y-4 text-white">
      <div className="flex items-center justify-between pb-2 border-b-2 border-white/20">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
            <PCLogo size={24} className="text-white" />
            Agenda Completa de Fechas - PC EVENTOS
          </h2>
          <p className="text-xs font-bold text-neutral-400">
            {sortedEvents.length} fechas reservadas ordenadas cronológicamente
          </p>
        </div>
        <button
          onClick={onOpenNewEventModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#00ff66] hover:bg-[#10f543] border-2 border-white rounded-lg text-xs font-black text-black shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Anotar Fecha</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {sortedEvents.map((evt) => {
          const typeConf = EVENT_TYPES_CONFIG[evt.eventType];
          const statusConf = STATUS_CONFIG[evt.status];
          const pendingBalance =
            evt.totalPrice && evt.depositAmount
              ? evt.totalPrice - evt.depositAmount
              : 0;

          return (
            <div
              key={evt.id}
              onClick={() => onViewEvent(evt)}
              className="bg-[#121214] rounded-2xl border-2 border-white/20 shadow-[3px_3px_0px_0px_rgba(255,255,255,0.2)] overflow-hidden flex flex-col hover:border-[#00ff66] hover:translate-y-[-2px] transition-all cursor-pointer"
            >
              {/* Date Header Strip in Verde Fluo */}
              <div className="bg-[#00ff66] border-b-2 border-black p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-black text-[#00ff66] flex items-center justify-center font-black text-sm">
                    {evt.date.split('-')[2]}
                  </div>
                  <div>
                    <span className="text-xs font-black text-black uppercase tracking-wider block">
                      {formatFriendlyDate(evt.date)}
                    </span>
                    <span className="text-[11px] font-extrabold text-black flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {evt.startTime} - {evt.endTime} hs
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border border-black ${statusConf.badgeColor}`}
                >
                  {statusConf.label}
                </span>
              </div>

              {/* Event Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base font-black text-white leading-snug">
                      {evt.title}
                    </h3>
                    <span className="text-base">{typeConf.icon}</span>
                  </div>

                  <div className="mt-2.5 space-y-1.5 text-xs font-bold text-neutral-300">
                    {evt.venue && (
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                        <span className="truncate">{evt.venue}</span>
                      </div>
                    )}

                    {evt.clientName && (
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                        <span>Cliente: {evt.clientName}</span>
                      </div>
                    )}

                    {evt.djAssigned && (
                      <div className="flex items-center gap-1.5">
                        <Disc className="w-3.5 h-3.5 text-[#00ff66] shrink-0" />
                        <span className="text-white font-extrabold">
                          {evt.djAssigned}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Equipment Preview */}
                  {evt.equipment && evt.equipment.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10">
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider block mb-1">
                        Equipamiento Asignado:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {evt.equipment.slice(0, 3).map((item) => (
                          <span
                            key={item}
                            className="text-[10px] font-bold bg-[#18181b] text-white border border-white/20 px-1.5 py-0.5 rounded"
                          >
                            {item}
                          </span>
                        ))}
                        {evt.equipment.length > 3 && (
                          <span className="text-[10px] font-black text-black bg-[#00ff66] px-1.5 py-0.5 rounded">
                            +{evt.equipment.length - 3} más
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Strip with Budget and Quick Actions */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    {evt.totalPrice ? (
                      <div>
                        <span className="text-[10px] font-bold text-neutral-400 block">
                          Total Presupuestado:
                        </span>
                        <span className="text-sm font-black text-white tabular-nums">
                          ${evt.totalPrice.toLocaleString('es-AR')}
                        </span>
                        {pendingBalance > 0 && (
                          <span className="text-[10px] font-extrabold text-[#00ff66] block">
                            Resta: ${pendingBalance.toLocaleString('es-AR')}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-neutral-500">
                        Sin costo asignado
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => onEditEvent(evt)}
                      className="p-1.5 rounded-lg border border-white/30 hover:bg-neutral-800 transition-colors text-white cursor-pointer"
                      title="Editar evento"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `¿Estás seguro de eliminar "${evt.title}" del calendario?`
                          )
                        ) {
                          onDeleteEvent(evt.id);
                        }
                      }}
                      className="p-1.5 rounded-lg border border-white/30 hover:bg-red-900/40 text-red-400 transition-colors cursor-pointer"
                      title="Eliminar evento"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
