// Date manipulation helpers for calendar

export const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

export const DAY_NAMES_ES = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

export const DAY_NAMES_SHORT_ES = [
  'LUN',
  'MAR',
  'MIÉ',
  'JUE',
  'VIE',
  'SÁB',
  'DOM',
];

export function formatDateToKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatFriendlyDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const dayOfWeek = (date.getDay() + 6) % 7; // Monday = 0
  return `${DAY_NAMES_ES[dayOfWeek]} ${day} de ${MONTH_NAMES_ES[month - 1]} de ${year}`;
}

export function formatShortDate(dateKey: string): string {
  const [year, month, day] = dateKey.split('-').map(Number);
  return `${day} ${MONTH_NAMES_ES[month - 1].slice(0, 3)} ${year}`;
}

export interface CalendarDayCell {
  date: Date;
  dateKey: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
}

/**
 * Returns a 35 or 42 element grid for the given year and month (0-indexed).
 * Week starts on Monday.
 */
export function getMonthMatrix(year: number, month: number): CalendarDayCell[] {
  const todayKey = formatDateToKey(new Date());
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Day of week: Sunday is 0 in JS. We want Monday=0, ..., Sunday=6.
  const jsDay = firstDayOfMonth.getDay();
  const startDayOffset = (jsDay + 6) % 7; // 0 for Monday, 6 for Sunday

  const days: CalendarDayCell[] = [];

  // Previous month trailing days
  for (let i = startDayOffset; i > 0; i--) {
    const prevDate = new Date(year, month, 1 - i);
    const dateKey = formatDateToKey(prevDate);
    days.push({
      date: prevDate,
      dateKey,
      dayNumber: prevDate.getDate(),
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
    });
  }

  // Current month days
  const totalDaysInMonth = lastDayOfMonth.getDate();
  for (let i = 1; i <= totalDaysInMonth; i++) {
    const curDate = new Date(year, month, i);
    const dateKey = formatDateToKey(curDate);
    days.push({
      date: curDate,
      dateKey,
      dayNumber: i,
      isCurrentMonth: true,
      isToday: dateKey === todayKey,
    });
  }

  // Next month leading days to complete full weeks (either 35 or 42 cells)
  const remainingCells = (7 - (days.length % 7)) % 7;
  // If we have 35 or fewer cells, make it 35 or 42 as needed
  const targetTotal = days.length + remainingCells < 35 ? 35 : days.length + remainingCells;
  const extraNeeded = targetTotal - days.length;

  for (let i = 1; i <= extraNeeded; i++) {
    const nextDate = new Date(year, month + 1, i);
    const dateKey = formatDateToKey(nextDate);
    days.push({
      date: nextDate,
      dateKey,
      dayNumber: nextDate.getDate(),
      isCurrentMonth: false,
      isToday: dateKey === todayKey,
    });
  }

  return days;
}

/**
 * Returns 7 days for a given week containing referenceDate (starts Monday).
 */
export function getWeekDays(referenceDate: Date): CalendarDayCell[] {
  const todayKey = formatDateToKey(new Date());
  const jsDay = referenceDate.getDay();
  const mondayOffset = (jsDay + 6) % 7;
  const monday = new Date(referenceDate);
  monday.setDate(referenceDate.getDate() - mondayOffset);

  const days: CalendarDayCell[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const dateKey = formatDateToKey(d);
    days.push({
      date: d,
      dateKey,
      dayNumber: d.getDate(),
      isCurrentMonth: d.getMonth() === referenceDate.getMonth(),
      isToday: dateKey === todayKey,
    });
  }
  return days;
}
