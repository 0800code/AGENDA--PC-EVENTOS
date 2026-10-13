import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Disc,
  Music,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  Copy,
  Check,
} from 'lucide-react';
import { DJEvent, EVENT_TYPES_CONFIG, STATUS_CONFIG } from '../types/calendar';
import { formatFriendlyDate } from '../utils/dateUtils';
import { PCLogo } from './PCLogo';

interface EventDetailModalProps {
  event: DJEvent | null;
  onClose: () => void;
  onEdit: (event: DJEvent) => void;
  onDelete: (eventId: string) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onEdit,
  onDelete,
}) => {
  const [copied, setCopied] = useState(false);

  if (!event) return null;

  const typeConf = EVENT_TYPES_CONFIG[event.eventType];
  const statusConf = STATUS_CONFIG[event.status];
  const pendingBalance =
    event.totalPrice && event.depositAmount
      ? event.totalPrice - event.depositAmount
      : 0;

  const generateWhatsAppText = () => {
    return `🎧 *PC EVENTOS - FICHA TÉCNICA DE EVENTO*\n` +
      `📅 *Fecha:* ${formatFriendlyDate(event.date)}\n` +
      `🎉 *Evento:* ${event.title}\n` +
      `⏰ *Horario:* ${event.startTime} a ${event.endTime} hs\n` +
      `📍 *Salón/Lugar:* ${event.venue || 'A confirmar'} ${event.address ? `(${event.address})` : ''}\n` +
      `👤 *Cliente:* ${event.clientName || 'N/A'} ${event.clientPhone ? `(Tel: ${event.clientPhone})` : ''}\n` +
      `🎛️ *DJ Asignado:* ${event.djAssigned || 'PC EVENTOS Team'}\n` +
      `🔊 *Equipamiento:* ${event.equipment.join(', ') || 'Estándar'}\n` +
      `${event.notes ? `📝 *Notas:* ${event.notes}\n` : ''}` +
      `✅ *Estado:* ${statusConf.label}`;
  };

  const handleCopyWhatsApp = () => {
    const text = generateWhatsAppText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = () => {
    const text = encodeURIComponent(generateWhatsAppText());
    const phone = event.clientPhone ? event.clientPhone.replace(/\D/g, '') : '';
    const url = phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="bg-[#121214] border-2 border-white/30 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Fluo Green Header with PC Logo & Black Text */}
        <div className="bg-[#00ff66] border-b-2 border-black p-4 sm:p-5 flex items-start justify-between">
          <div className="flex items-start gap-3">
            <PCLogo size={42} className="text-black" />
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider bg-black text-[#00ff66] px-2 py-0.5 rounded border border-black">
                  {typeConf.icon} {typeConf.label}
                </span>
                <span
                  className={`text-xs font-black uppercase px-2 py-0.5 rounded border border-black ${statusConf.badgeColor}`}
                >
                  {statusConf.label}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-black leading-tight">
                {event.title}
              </h2>
              <div className="mt-1 flex items-center gap-2 text-xs font-extrabold text-black">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatFriendlyDate(event.date)}
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {event.startTime} - {event.endTime} hs
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-neutral-100 transition-colors shrink-0 cursor-pointer"
            title="Cerrar"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Venue & Location */}
          <div className="p-3 bg-[#18181b] rounded-xl border border-white/20 space-y-1">
            <span className="text-[10px] font-black text-[#00ff66] uppercase tracking-wider flex items-center gap-1">
              <MapPin className="w-3 h-3" /> Salón y Ubicación
            </span>
            <div className="text-sm font-black text-white">
              {event.venue || 'Salón no especificado'}
            </div>
            {event.address && (
              <div className="text-xs font-bold text-neutral-300">
                {event.address}
              </div>
            )}
          </div>

          {/* Client & DJ Assigned */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-[#18181b] rounded-xl border border-white/20 space-y-1">
              <span className="text-[10px] font-black text-[#00ff66] uppercase tracking-wider flex items-center gap-1">
                <User className="w-3 h-3" /> Datos del Cliente
              </span>
              <div className="text-sm font-black text-white">
                {event.clientName || 'Sin nombre registrado'}
              </div>
              {event.clientPhone && (
                <div className="text-xs font-bold text-[#00ff66] flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{event.clientPhone}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-[#18181b] rounded-xl border border-white/20 space-y-1">
              <span className="text-[10px] font-black text-[#00ff66] uppercase tracking-wider flex items-center gap-1">
                <Disc className="w-3 h-3" /> DJ Responsable
              </span>
              <div className="text-sm font-black text-white">
                {event.djAssigned || 'PC EVENTOS Team'}
              </div>
              <div className="text-[11px] font-bold text-neutral-400">
                Staff Técnico PC EVENTOS
              </div>
            </div>
          </div>

          {/* Equipment Checklist */}
          {event.equipment && event.equipment.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-xs font-black text-white uppercase tracking-wider block">
                Rider Técnico & Equipamiento ({event.equipment.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {event.equipment.map((item) => (
                  <div
                    key={item}
                    className="p-2 bg-[#18181b] rounded-lg border border-white/10 text-xs font-extrabold text-white flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-[#00ff66] shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Budget & Payments */}
          {(event.totalPrice || event.depositAmount) && (
            <div className="p-3 bg-[#18181b] rounded-xl border border-white/20">
              <span className="text-xs font-black text-white uppercase tracking-wider block mb-2">
                Presupuesto y Estado Financiero
              </span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-[#121214] rounded-lg border border-white/10">
                  <div className="text-[10px] font-bold text-neutral-400">Total</div>
                  <div className="text-sm sm:text-base font-black text-white tabular-nums">
                    ${event.totalPrice?.toLocaleString('es-AR') || '0'}
                  </div>
                </div>
                <div className="p-2 bg-[#121214] rounded-lg border border-white/10">
                  <div className="text-[10px] font-bold text-neutral-400">Seña Abonada</div>
                  <div className="text-sm sm:text-base font-black text-[#00ff66] tabular-nums">
                    ${event.depositAmount?.toLocaleString('es-AR') || '0'}
                  </div>
                </div>
                <div className="p-2 bg-[#121214] rounded-lg border border-white/10">
                  <div className="text-[10px] font-bold text-neutral-400">Saldo Pendiente</div>
                  <div className="text-sm sm:text-base font-black text-white tabular-nums">
                    ${pendingBalance.toLocaleString('es-AR')}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Music Preferences & Notes */}
          {(event.musicGenres || event.notes) && (
            <div className="p-3 bg-[#18181b] rounded-xl border border-white/20 space-y-2">
              {event.musicGenres && (
                <div>
                  <span className="text-[10px] font-black text-[#00ff66] uppercase tracking-wider flex items-center gap-1">
                    <Music className="w-3 h-3" /> Estilos Musicales
                  </span>
                  <p className="text-xs font-bold text-neutral-200 mt-0.5">
                    {event.musicGenres}
                  </p>
                </div>
              )}
              {event.notes && (
                <div>
                  <span className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">
                    Notas y Cronograma
                  </span>
                  <p className="text-xs font-bold text-neutral-300 mt-0.5">
                    {event.notes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-3 sm:p-4 bg-[#0a0a0c] border-t-2 border-white/20 flex flex-wrap items-center justify-between gap-2">
          {/* WhatsApp share buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#18181b] hover:bg-neutral-800 border border-white/30 rounded-lg text-xs font-black text-white transition-colors cursor-pointer"
              title="Copiar texto para WhatsApp"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00ff66]" />
                  <span className="text-[#00ff66]">¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar Ficha</span>
                </>
              )}
            </button>
            <button
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#00ff66] hover:bg-[#10f543] border border-black rounded-lg text-xs font-black text-black shadow-xs cursor-pointer"
              title="Abrir chat en WhatsApp"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onEdit(event);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white text-black hover:bg-neutral-200 border border-white rounded-lg text-xs font-black transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Editar</span>
            </button>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    `¿Estás seguro de eliminar el evento "${event.title}"?`
                  )
                ) {
                  onDelete(event.id);
                  onClose();
                }
              }}
              className="p-2 bg-[#18181b] hover:bg-red-950/60 border border-red-500/50 rounded-lg text-red-400 transition-colors cursor-pointer"
              title="Eliminar evento"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
