export type EventType =
  | 'casamiento'
  | 'cumple_15'
  | 'cumpleanos'
  | 'corporativo'
  | 'boliche_festival'
  | 'fiesta_privada'
  | 'otro';

export type EventStatus = 'confirmado' | 'senado' | 'presupuesto';

export interface DJEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  eventType: EventType;
  status: EventStatus;
  venue: string;
  address?: string;
  clientName: string;
  clientPhone?: string;
  djAssigned?: string;
  equipment: string[];
  totalPrice?: number;
  depositAmount?: number;
  musicGenres?: string;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}

export type CalendarView = 'month' | 'week' | 'agenda';

export const EVENT_TYPES_CONFIG: Record<
  EventType,
  { label: string; icon: string }
> = {
  casamiento: { label: 'Casamiento / Boda', icon: '💍' },
  cumple_15: { label: 'Fiesta de 15 Años', icon: '👑' },
  cumpleanos: { label: 'Cumpleaños / Festejo', icon: '🎂' },
  corporativo: { label: 'Evento Corporativo', icon: '💼' },
  boliche_festival: { label: 'Boliche / Club / Festival', icon: '🎧' },
  fiesta_privada: { label: 'Fiesta Privada', icon: '🎉' },
  otro: { label: 'Otro Evento', icon: '🎵' },
};

export const STATUS_CONFIG: Record<
  EventStatus,
  { label: string; badgeColor: string }
> = {
  confirmado: {
    label: 'Confirmado',
    badgeColor: 'bg-black text-white',
  },
  senado: {
    label: 'Señado (En Reserva)',
    badgeColor: 'bg-black/80 text-[#00ff66]',
  },
  presupuesto: {
    label: 'En Consulta / Presupuesto',
    badgeColor: 'bg-neutral-200 text-black',
  },
};

export const COMMON_EQUIPMENT = [
  'Cabina DJ Pioneer Pro',
  'Sistema de Sonido Line Array',
  'Iluminación Móvil & Cabezas Beam',
  'Láser Show RGB',
  'Máquina de Humo / Geiser CO2',
  'Pantalla LED Gigante',
  'Pista de Baile LED',
  'Micrófonos Inalámbricos Shure',
  'Chispas Frías (Sparkulars)',
  'Estructuras Truss de Techo',
];
