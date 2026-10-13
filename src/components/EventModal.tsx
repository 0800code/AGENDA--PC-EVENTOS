import React, { useState, useEffect } from 'react';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Disc,
  DollarSign,
  Music,
  Check,
  AlertCircle,
} from 'lucide-react';
import {
  DJEvent,
  EventType,
  EventStatus,
  EVENT_TYPES_CONFIG,
  COMMON_EQUIPMENT,
} from '../types/calendar';
import { PCLogo } from './PCLogo';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (eventData: Omit<DJEvent, 'id' | 'createdAt' | 'updatedAt'>, id?: string) => void;
  initialDateKey?: string;
  editingEvent?: DJEvent | null;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialDateKey,
  editingEvent,
}) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('21:00');
  const [endTime, setEndTime] = useState('05:00');
  const [eventType, setEventType] = useState<EventType>('casamiento');
  const [status, setStatus] = useState<EventStatus>('confirmado');
  const [venue, setVenue] = useState('');
  const [address, setAddress] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [djAssigned, setDjAssigned] = useState('DJ Pedro C. (PC EVENTOS)');
  const [equipment, setEquipment] = useState<string[]>([
    'Cabina DJ Pioneer Pro',
    'Sistema de Sonido Line Array',
    'Iluminación Móvil & Cabezas Beam',
  ]);
  const [totalPrice, setTotalPrice] = useState<string>('');
  const [depositAmount, setDepositAmount] = useState<string>('');
  const [musicGenres, setMusicGenres] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingEvent) {
      setTitle(editingEvent.title);
      setDate(editingEvent.date);
      setStartTime(editingEvent.startTime);
      setEndTime(editingEvent.endTime);
      setEventType(editingEvent.eventType);
      setStatus(editingEvent.status);
      setVenue(editingEvent.venue || '');
      setAddress(editingEvent.address || '');
      setClientName(editingEvent.clientName || '');
      setClientPhone(editingEvent.clientPhone || '');
      setDjAssigned(editingEvent.djAssigned || 'DJ Pedro C. (PC EVENTOS)');
      setEquipment(editingEvent.equipment || []);
      setTotalPrice(editingEvent.totalPrice ? String(editingEvent.totalPrice) : '');
      setDepositAmount(editingEvent.depositAmount ? String(editingEvent.depositAmount) : '');
      setMusicGenres(editingEvent.musicGenres || '');
      setNotes(editingEvent.notes || '');
    } else {
      setTitle('');
      setDate(initialDateKey || new Date().toISOString().split('T')[0]);
      setStartTime('21:00');
      setEndTime('05:00');
      setEventType('casamiento');
      setStatus('confirmado');
      setVenue('');
      setAddress('');
      setClientName('');
      setClientPhone('');
      setDjAssigned('DJ Pedro C. (PC EVENTOS)');
      setEquipment([
        'Cabina DJ Pioneer Pro',
        'Sistema de Sonido Line Array',
        'Iluminación Móvil & Cabezas Beam',
      ]);
      setTotalPrice('');
      setDepositAmount('');
      setMusicGenres('');
      setNotes('');
    }
    setError('');
  }, [editingEvent, initialDateKey, isOpen]);

  if (!isOpen) return null;

  const handleToggleEquipment = (item: string) => {
    if (equipment.includes(item)) {
      setEquipment(equipment.filter((e) => e !== item));
    } else {
      setEquipment([...equipment, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe el nombre del evento.');
      return;
    }
    if (!date) {
      setError('Por favor selecciona una fecha para el evento.');
      return;
    }

    onSave(
      {
        title: title.trim(),
        date,
        startTime,
        endTime,
        eventType,
        status,
        venue: venue.trim(),
        address: address.trim(),
        clientName: clientName.trim(),
        clientPhone: clientPhone.trim(),
        djAssigned: djAssigned.trim(),
        equipment,
        totalPrice: totalPrice ? Number(totalPrice) : undefined,
        depositAmount: depositAmount ? Number(depositAmount) : undefined,
        musicGenres: musicGenres.trim(),
        notes: notes.trim(),
      },
      editingEvent?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xs">
      <div className="bg-[#121214] border-2 border-white/30 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-[0_0_35px_rgba(0,0,0,0.9)] overflow-hidden text-white animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header in Fluo Green */}
        <div className="bg-[#00ff66] border-b-2 border-black p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <PCLogo size={32} className="text-black" />
            <div>
              <h2 className="text-lg sm:text-xl font-black text-black tracking-tight">
                {editingEvent ? 'Editar Fecha en Calendario' : 'Anotar Nueva Fecha en PC EVENTOS'}
              </h2>
              <p className="text-xs font-bold text-black opacity-85">
                Al guardar, la fecha se resaltará en verde fluo con el nombre del evento.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg border-2 border-black bg-white hover:bg-neutral-100 transition-colors cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5 text-black" />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {error && (
            <div className="p-3 bg-red-950 border-2 border-red-500 text-white rounded-xl text-xs font-black flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Row 1: Title */}
          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
              Nombre del Evento * <span className="font-normal text-neutral-400">(Se verá destacado en el día)</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Casamiento Florencia & Lucas / 15 de Martina / Boliche Set"
              className="w-full px-3.5 py-2.5 text-sm sm:text-base font-black text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66] focus:border-[#00ff66]"
            />
          </div>

          {/* Row 2: Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#00ff66]" /> Fecha *
              </label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00ff66]" /> Hora Inicio
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-[#00ff66]" /> Hora Fin
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
          </div>

          {/* Row 3: Event Type & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                Tipo de Evento
              </label>
              <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value as EventType)}
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66] cursor-pointer"
              >
                {(Object.keys(EVENT_TYPES_CONFIG) as EventType[]).map((key) => (
                  <option key={key} value={key} className="bg-[#18181b] text-white">
                    {EVENT_TYPES_CONFIG[key].icon} {EVENT_TYPES_CONFIG[key].label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                Estado de la Fecha
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66] cursor-pointer"
              >
                <option value="confirmado" className="bg-[#18181b] text-white">✅ Confirmado (Fecha Asegurada)</option>
                <option value="senado" className="bg-[#18181b] text-white">💰 Señado (Con pago inicial)</option>
                <option value="presupuesto" className="bg-[#18181b] text-white">⏳ En Consulta / Presupuesto</option>
              </select>
            </div>
          </div>

          {/* Row 4: Venue & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#00ff66]" /> Salón / Lugar
              </label>
              <input
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ej: Salón Madero, Quinta Los Robles"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                Dirección / Localidad
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Ej: Av. Libertador 4200, San Isidro"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
          </div>

          {/* Row 5: Client & Phone & Assigned DJ */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-[#00ff66]" /> Cliente / Contacto
              </label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Nombre del cliente"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-[#00ff66]" /> WhatsApp / Teléfono
              </label>
              <input
                type="tel"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+54 9 11 ..."
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Disc className="w-3.5 h-3.5 text-[#00ff66]" /> DJ Asignado
              </label>
              <input
                type="text"
                value={djAssigned}
                onChange={(e) => setDjAssigned(e.target.value)}
                placeholder="Ej: DJ Pedro C."
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
          </div>

          {/* Row 6: Equipment selection checkboxes */}
          <div>
            <label className="block text-xs font-black text-white uppercase tracking-wider mb-1.5">
              Equipamiento Técnico Requerido
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {COMMON_EQUIPMENT.map((item) => {
                const isChecked = equipment.includes(item);
                return (
                  <button
                    type="button"
                    key={item}
                    onClick={() => handleToggleEquipment(item)}
                    className={`p-2 text-left text-xs font-bold rounded-xl border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isChecked
                        ? 'bg-[#00ff66] border-white text-black font-extrabold shadow-xs'
                        : 'bg-[#18181b] border-white/20 text-neutral-300 hover:border-white'
                    }`}
                  >
                    <span className="truncate">{item}</span>
                    {isChecked && <Check className="w-3.5 h-3.5 text-black shrink-0 ml-1 stroke-[3]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Row 7: Budget & Deposit */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#00ff66]" /> Presupuesto Total ($)
              </label>
              <input
                type="number"
                value={totalPrice}
                onChange={(e) => setTotalPrice(e.target.value)}
                placeholder="Ej: 1200000"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-[#00ff66]" /> Seña Pagada ($)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Ej: 600000"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
          </div>

          {/* Row 8: Music & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1 flex items-center gap-1">
                <Music className="w-3.5 h-3.5 text-[#00ff66]" /> Estilos Musicales / Pedidos
              </label>
              <input
                type="text"
                value={musicGenres}
                onChange={(e) => setMusicGenres(e.target.value)}
                placeholder="Ej: Cachengue, Retro 90s, Electrónica"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-white uppercase tracking-wider mb-1">
                Notas / Cronograma
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ej: Vals 23:45, cotillón 03:00"
                className="w-full px-3 py-2 text-sm font-bold text-white bg-[#18181b] border-2 border-white/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#00ff66]"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t-2 border-white/20 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border-2 border-white/30 text-white font-black text-xs sm:text-sm hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#00ff66] hover:bg-[#10f543] active:scale-95 border-2 border-white text-black font-black text-xs sm:text-sm shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>{editingEvent ? 'Guardar Cambios' : 'Anotar Fecha en Verde Fluo'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
