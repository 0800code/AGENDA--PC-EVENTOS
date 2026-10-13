import React, { useState, useEffect } from 'react';
import { DJEvent, CalendarView, EventStatus, EventType } from './types/calendar';
import { INITIAL_EVENTS } from './data/initialEvents';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MonthView } from './components/MonthView';
import { WeekView } from './components/WeekView';
import { AgendaView } from './components/AgendaView';
import { EventModal } from './components/EventModal';
import { EventDetailModal } from './components/EventDetailModal';
import { formatDateToKey, MONTH_NAMES_ES } from './utils/dateUtils';
import { Sparkles, Check } from 'lucide-react';

const LOCAL_STORAGE_KEY = 'pc_eventos_dj_calendar_events_v1';

export default function App() {
  // Current reference date (defaults to current date, Oct 2026)
  const [currentDate, setCurrentDate] = useState<Date>(() => new Date());

  // Stored events
  const [events, setEvents] = useState<DJEvent[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading events from localStorage', e);
    }
    return INITIAL_EVENTS;
  });

  // Current view
  const [currentView, setCurrentView] = useState<CalendarView>('month');

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<EventStatus | 'all'>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<EventType | 'all'>('all');

  // Modal States
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [modalInitialDate, setModalInitialDate] = useState<string>('');
  const [editingEvent, setEditingEvent] = useState<DJEvent | null>(null);
  const [viewingEvent, setViewingEvent] = useState<DJEvent | null>(null);

  // Mobile sidebar
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.error('Error saving events to localStorage', e);
    }
  }, [events]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Month navigation
  const handlePrev = () => {
    if (currentView === 'week') {
      const newD = new Date(currentDate);
      newD.setDate(newD.getDate() - 7);
      setCurrentDate(newD);
    } else {
      const newD = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
      setCurrentDate(newD);
    }
  };

  const handleNext = () => {
    if (currentView === 'week') {
      const newD = new Date(currentDate);
      newD.setDate(newD.getDate() + 7);
      setCurrentDate(newD);
    } else {
      const newD = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
      setCurrentDate(newD);
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleSelectMonthYear = (year: number, month: number) => {
    setCurrentDate(new Date(year, month, 1));
  };

  // Open modal to annotate a specific date
  const handleAnnotateDate = (dateKey: string) => {
    setEditingEvent(null);
    setModalInitialDate(dateKey);
    setIsEventModalOpen(true);
  };

  // Open modal from top button (+ Anotar Fecha)
  const handleOpenNewEvent = () => {
    setEditingEvent(null);
    setModalInitialDate(formatDateToKey(currentDate));
    setIsEventModalOpen(true);
  };

  // Edit existing event
  const handleEditEvent = (event: DJEvent) => {
    setEditingEvent(event);
    setModalInitialDate(event.date);
    setIsEventModalOpen(true);
  };

  // Save or update event
  const handleSaveEvent = (
    eventData: Omit<DJEvent, 'id' | 'createdAt' | 'updatedAt'>,
    id?: string
  ) => {
    const nowIso = new Date().toISOString();

    if (id) {
      // Update existing
      setEvents((prev) =>
        prev.map((e) =>
          e.id === id
            ? {
                ...e,
                ...eventData,
                updatedAt: nowIso,
              }
            : e
        )
      );
      showToast(`Evento "${eventData.title}" actualizado correctamente.`);
    } else {
      // Create new
      const newEvent: DJEvent = {
        ...eventData,
        id: `pc-evt-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        createdAt: nowIso,
      };
      setEvents((prev) => [...prev, newEvent]);
      showToast(
        `¡Fecha anotada! El día ${eventData.date} ahora se muestra en VERDE FLUO.`
      );
    }

    // Switch view date to that event's month so user immediately sees it
    const [y, m] = eventData.date.split('-').map(Number);
    setCurrentDate(new Date(y, m - 1, 1));
  };

  // Delete event
  const handleDeleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    showToast('Fecha eliminada del calendario.');
  };

  // Filter events based on active filters & search query
  const filteredEvents = React.useMemo(() => {
    return events.filter((evt) => {
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = evt.title.toLowerCase().includes(q);
        const matchesClient = evt.clientName?.toLowerCase().includes(q);
        const matchesVenue = evt.venue?.toLowerCase().includes(q);
        const matchesDj = evt.djAssigned?.toLowerCase().includes(q);
        const matchesNotes = evt.notes?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesClient && !matchesVenue && !matchesDj && !matchesNotes) {
          return false;
        }
      }

      // Status filter
      if (selectedStatusFilter !== 'all' && evt.status !== selectedStatusFilter) {
        return false;
      }

      // Type filter
      if (selectedTypeFilter !== 'all' && evt.eventType !== selectedTypeFilter) {
        return false;
      }

      return true;
    });
  }, [events, searchQuery, selectedStatusFilter, selectedTypeFilter]);

  // Export events to CSV
  const handleExportCSV = () => {
    const headers = [
      'Fecha',
      'Evento',
      'Horario Inicio',
      'Horario Fin',
      'Tipo',
      'Estado',
      'Salón',
      'Dirección',
      'Cliente',
      'Teléfono',
      'DJ Asignado',
      'Presupuesto Total',
      'Seña',
      'Equipamiento',
    ];

    const rows = filteredEvents.map((e) => [
      e.date,
      `"${e.title.replace(/"/g, '""')}"`,
      e.startTime,
      e.endTime,
      e.eventType,
      e.status,
      `"${(e.venue || '').replace(/"/g, '""')}"`,
      `"${(e.address || '').replace(/"/g, '""')}"`,
      `"${(e.clientName || '').replace(/"/g, '""')}"`,
      `"${(e.clientPhone || '').replace(/"/g, '""')}"`,
      `"${(e.djAssigned || '').replace(/"/g, '""')}"`,
      e.totalPrice || '',
      e.depositAmount || '',
      `"${(e.equipment || []).join('; ').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `PC_EVENTOS_Calendario_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Archivo CSV descargado con éxito.');
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans select-none">
      {/* Top Navigation Bar */}
      <Header
        currentDate={currentDate}
        onPrevMonth={handlePrev}
        onNextMonth={handleNext}
        onToday={handleToday}
        onSelectMonthYear={handleSelectMonthYear}
        currentView={currentView}
        onViewChange={setCurrentView}
        onOpenNewEventModal={handleOpenNewEvent}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        totalEventsCount={filteredEvents.length}
        onToggleSidebar={() => setIsSidebarOpenMobile(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden bg-black">
        {/* Left Sidebar */}
        <Sidebar
          currentDate={currentDate}
          onSelectDate={(date) => {
            setCurrentDate(date);
          }}
          onOpenNewEventModal={handleOpenNewEvent}
          selectedStatusFilter={selectedStatusFilter}
          onStatusFilterChange={setSelectedStatusFilter}
          events={events}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
        />

        {/* Calendar View Area */}
        <main className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden">
          {currentView === 'month' && (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectDate={setCurrentDate}
              onAnnotateDate={handleAnnotateDate}
              onViewEvent={(event) => setViewingEvent(event)}
            />
          )}

          {currentView === 'week' && (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              onAnnotateDate={handleAnnotateDate}
              onViewEvent={(event) => setViewingEvent(event)}
            />
          )}

          {currentView === 'agenda' && (
            <AgendaView
              events={filteredEvents}
              onViewEvent={(event) => setViewingEvent(event)}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
              onOpenNewEventModal={handleOpenNewEvent}
            />
          )}
        </main>
      </div>

      {/* Event Create / Edit Modal */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEditingEvent(null);
        }}
        onSave={handleSaveEvent}
        initialDateKey={modalInitialDate}
        editingEvent={editingEvent}
      />

      {/* Event Details Inspection Modal */}
      <EventDetailModal
        event={viewingEvent}
        onClose={() => setViewingEvent(null)}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#121214] border-2 border-[#00ff66] text-[#00ff66] px-4 py-3 rounded-xl shadow-[0_0_20px_rgba(0,255,102,0.35)] flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200">
          <Check className="w-5 h-5 text-[#00ff66] stroke-[3]" />
          <span className="text-xs sm:text-sm font-black text-white">
            {toastMessage}
          </span>
        </div>
      )}
    </div>
  );
}
