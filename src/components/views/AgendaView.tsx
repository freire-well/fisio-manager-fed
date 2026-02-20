import React, { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { PlusIcon } from '../Icons';
import { Agendamento } from '../Agendamento';
import { Paciente } from '../Paciente';

interface AgendaViewProps {
  appointments: Agendamento[];
  onAddAppointment: () => void;
  onSelectAppointment: (appointment: any) => void;
  onDeleteAppointment: (id: number) => void;
  patients: Paciente[];
}


const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getWeekDates = (date: Date): Date[] => {
  const current = new Date(date);
  const first = current.getDate() - current.getDay() + 1; // Ajusta para segunda-feira
  const weekDates: Date[] = [];
  
  for (let i = 0; i < 7; i++) {
    const day = new Date(current.setDate(first + i));
    weekDates.push(new Date(day));
  }
  return weekDates;
};

const getDaysInMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
};

const getFirstDayOfMonth = (date: Date): number => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
};

export function AgendaView({ 
  appointments,
  patients, 
  onAddAppointment, 
  onSelectAppointment,
  onDeleteAppointment 
}: AgendaViewProps): React.ReactElement {
  const [calendarView, setCalendarView] = useState<'week' | 'month' | 'year'>('week');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [optimisticAppointments, setOptimisticAppointments] = useState<Agendamento[]>(appointments);
  const [blockedSlots, setBlockedSlots] = useState<Set<string>>(new Set());
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const weekDates = getWeekDates(selectedDate);

  useEffect(() => {
    setOptimisticAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    const fetchBlockedSlots = async () => {
      try {
        const data = await api.get<Array<{ date: string; time: string }>>('/horarios-bloqueados');
        const slots = new Set<string>();
        data.forEach((slot: { date: string; time: string }) => {
          const hour = slot.time.split(':')[0];
          slots.add(`${slot.date}:${hour}`);
        });
        setBlockedSlots(slots);
      } catch (error) {
        console.error('Erro ao carregar horários bloqueados:', error);
      }
    };
    fetchBlockedSlots();
  }, []);

  const toggleBlockSlot = async (dateStr: string, hour: number) => {
    const slotKey = `${dateStr}:${String(hour).padStart(2, '0')}`;
    const newBlockedSlots = new Set(blockedSlots);
    const isBlocking = !newBlockedSlots.has(slotKey);
    
    if (isBlocking) {
      newBlockedSlots.add(slotKey);
    } else {
      newBlockedSlots.delete(slotKey);
    }
    
    setBlockedSlots(newBlockedSlots);
    
    try {
      if (isBlocking) {
        await api.post('/horarios-bloqueados', { 
          date: dateStr,
          time: `${String(hour).padStart(2, '0')}:00`
        });
      } else {
        await api.delete('/horarios-bloqueados', { 
          date: dateStr,
          time: `${String(hour).padStart(2, '0')}:00`
        });
      }
    } catch (error) {
      console.error('Erro ao bloquear/desbloquear horário:', error);
      const revertedSlots = new Set(blockedSlots);
      if (isBlocking) {
        revertedSlots.delete(slotKey);
      } else {
        revertedSlots.add(slotKey);
      }
      setBlockedSlots(revertedSlots);
      alert('Erro ao atualizar disponibilidade do horário');
    }
  };

  const updateAppointmentDate = async (appointmentId: number, newDate: string, newTime?: string) => {
    try {
      const appointment = optimisticAppointments.find(apt => apt.id === appointmentId);
      if (!appointment) throw new Error('Agendamento não encontrado');
      
      const slotKey = `${newDate}:${(newTime || appointment.time).split(':')[0].padStart(2, '0')}`;
      if (blockedSlots.has(slotKey)) {
        alert('Este horário está bloqueado. Escolha outro horário.');
        return;
      }
      
      const previousAppointments = optimisticAppointments;
      const updatedAppointments = optimisticAppointments.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, date: newDate, time: newTime || apt.time }
          : apt
      );
      
      setOptimisticAppointments(updatedAppointments);
      
      await api.post(`/agendamentos/${appointmentId}`, { 
        date: newDate,
        paciente_id: appointment.paciente_id,
        time: newTime || appointment.time,
        type: appointment.type
      });
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      alert('Erro ao atualizar data do agendamento');
    }
  };


  return (
    
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Agenda</h2>
        <div className="flex gap-3 w-full sm:w-auto">
          <div className="bg-app-surface border border-app-border rounded overflow-hidden flex">
            {(['week', 'month', 'year'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setCalendarView(view)}
                className={`px-3 py-2 text-sm font-semibold transition-colors capitalize ${calendarView === view ? 'bg-app-primary text-white' : 'text-app-text hover:bg-app-bg'}`}
              >
                {view === 'week' ? 'Semanal' : view === 'month' ? 'Mensal' : 'Anual'}
              </button>
            ))}
          </div>
          <button
            onClick={onAddAppointment}
            className="bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors ml-auto sm:ml-0"
          >
            <PlusIcon />
            <span className="hidden sm:inline">Novo Agendamento</span>
          </button>
        </div>
      </div>

      {/* Week View Simplificada */}
      {calendarView === 'week' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() - 7);
                setSelectedDate(newDate);
              }}
              className="bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              ← Semana Anterior
            </button>
            <div className="text-center">
              <h3 className="text-2xl font-bold">
                {weekDates[0].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} - {weekDates[6].toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}
              </h3>
              <p className="text-xs text-app-text/60 mt-2">Clique em um horário vazio para bloqueá-lo ou desbloqueá-lo</p>
            </div>
            <button
              onClick={() => {
                const newDate = new Date(selectedDate);
                newDate.setDate(newDate.getDate() + 7);
                setSelectedDate(newDate);
              }}
              className="bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Próxima Semana →
            </button>
          </div>

          <div className="bg-app-surface border border-app-border rounded overflow-hidden overflow-x-auto">
            <div className="min-w-[600px]">
              <div className="grid grid-cols-8 border-b border-app-border">
                <div className="p-4 font-bold border-r border-app-border">Horário</div>
                {weekDates.map((date, idx) => {
                  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
                  return (
                    <div key={idx} className="p-4 font-bold text-center border-r border-app-border last:border-r-0">
                      <div>{dayNames[date.getDay()]}</div>
                      <div className="text-sm font-normal">{date.getDate()}</div>
                    </div>
                  );
                })}
              </div>
              {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
                <div key={hour} className="grid grid-cols-8 border-b border-app-border last:border-b-0">
                  <div className="p-4 font-semibold border-r border-app-border bg-app-bg">
                    {hour}:00
                  </div>
                  {weekDates.map((date, dayIdx) => {
                    const dateStr = formatDate(date);
                    const slotKey = `${dateStr}:${String(hour).padStart(2, '0')}`;
                    const isBlocked = blockedSlots.has(slotKey);
                    const dayAppointments = optimisticAppointments.filter(apt => {
                      const aptDate = apt.date;
                      const aptHour = parseInt(apt.time.split(':')[0]);
                      return aptDate === dateStr && aptHour === hour;
                    });
                    return (
                      <div 
                        key={dayIdx} 
                        className={`p-2 border-r border-app-border last:border-r-0 min-h-[80px] cursor-pointer relative transition-colors ${
                          isBlocked ? 'bg-red-900/20 opacity-60' : 'hover:bg-app-bg/50'
                        }`}
                        onClick={() => {
                          if (dayAppointments.length === 0) {
                            toggleBlockSlot(dateStr, hour);
                          }
                        }}
                        onDragOver={(e) => {
                          if (!isBlocked) {
                            e.preventDefault();
                            e.currentTarget.classList.add('bg-app-bg/80');
                          }
                        }}
                        onDragLeave={(e) => {
                          e.currentTarget.classList.remove('bg-app-bg/80');
                        }}
                        onDrop={(e) => {
                          e.currentTarget.classList.remove('bg-app-bg/80');
                          if (isBlocked) {
                            e.preventDefault();
                            return;
                          }
                          e.preventDefault();
                          const data = JSON.parse(e.dataTransfer.getData('application/json'));
                          const newTime = `${String(hour).padStart(2, '0')}:00`;
                          updateAppointmentDate(data.id, dateStr, newTime);
                        }}
                      >
                        {isBlocked && dayAppointments.length === 0 && (
                          <div className="absolute inset-0 flex items-center justify-center text-red-500 font-semibold text-sm opacity-60">
                            BLOQUEADO
                          </div>
                        )}
                        {dayAppointments.map(apt => (
                          <div 
                            key={apt.id} 
                            className="bg-app-primary bg-opacity-20 border border-app-primary rounded p-2 mb-2 text-sm cursor-move hover:bg-opacity-30 transition-colors"
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.effectAllowed = 'move';
                              e.dataTransfer.setData('application/json', JSON.stringify({ id: apt.id, currentTime: apt.time }));
                            }}
                          >
                            <button
                              onClick={() => onSelectAppointment(patients.find(p => p.id === apt.paciente_id))}
                              className="w-full bg-app-primary bg-opacity-20 border-app-primary rounded px-2 py-1 mb-1 text-xs hover:bg-opacity-30 transition-colors text-left"
                            >
                            <div className="font-semibold text-app-primary">{patients.find(p => p.id === apt.paciente_id)?.nome}</div>
                            </button>
                            <div className="text-xs opacity-80">{apt.type}</div>
                            <button 
                              onClick={() => apt.id && onDeleteAppointment(apt.id)} 
                              className="text-xs text-red-400 mt-1 hover:underline"
                            >
                              Remover
                            </button>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Visão Mensal */}
      {calendarView === 'month' && (
        <div className="bg-app-surface border border-app-border rounded overflow-hidden">
          <div className="mb-4 p-4 text-center font-bold text-lg">
            {today.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </div>
          <div className="grid grid-cols-7 gap-px bg-app-border">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="bg-app-surface p-4 font-bold text-center">
                {day}
              </div>
            ))}
            {Array.from({ length: getFirstDayOfMonth(today) }, (_, i) => (
              <div key={`empty-${i}`} className="bg-app-surface p-3 min-h-[120px]"></div>
            ))}
            {Array.from({ length: getDaysInMonth(today) }, (_, i) => {
              const day = i + 1;
              const date = new Date(currentYear, currentMonth, day);
              const dateStr = formatDate(date);
              const dayAppointments = optimisticAppointments.filter(apt => apt.date === dateStr);

              return (
                <div key={day} className="bg-app-surface p-3 min-h-[120px] border border-app-border">
                  <div className="font-semibold mb-2">{day}</div>
                  {dayAppointments.map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => onSelectAppointment(patients.find(p => p.id === apt.paciente_id))}
                      className="w-full bg-app-primary bg-opacity-20 border border-app-primary rounded px-2 py-1 mb-1 text-xs hover:bg-opacity-30 transition-colors text-left truncate"
                    >
                      {apt.time} {patients.find(p => p.id === apt.paciente_id)?.nome} - {apt.type}
                    </button>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Visão Anual */}
      {calendarView === 'year' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => setSelectedYear(selectedYear - 1)}
              className="bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              ← Ano Anterior
            </button>
            <h3 className="text-2xl font-bold">{selectedYear}</h3>
            <button
              onClick={() => setSelectedYear(selectedYear + 1)}
              className="bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold transition-colors"
            >
              Próximo Ano →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }, (_, monthIdx) => {
              const monthDate = new Date(selectedYear, monthIdx, 1);
              const daysInMonth = getDaysInMonth(monthDate);
              const firstDay = getFirstDayOfMonth(monthDate);
              const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
              
              return (
                <div key={monthIdx} className="bg-app-surface border border-app-border rounded p-4">
                  <h3 className="font-bold mb-3 text-center">{monthNames[monthIdx]} {selectedYear}</h3>
                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {Array.from({ length: firstDay }, (_, i) => (
                      <div key={`empty-${i}`}></div>
                    ))}
                    {Array.from({ length: daysInMonth }, (_, i) => {
                      const day = i + 1;
                      const date = new Date(selectedYear, monthIdx, day);
                      const dateStr = formatDate(date);
                      const hasAppointment = optimisticAppointments.some(apt => apt.date === dateStr);
                      
                      return (
                        <div 
                          key={day} 
                          className={`aspect-square flex items-center justify-center rounded cursor-pointer transition-colors ${
                            hasAppointment
                              ? 'bg-app-primary text-white font-semibold'
                              : 'text-app-text/70 hover:bg-app-bg hover:text-white'
                          }`}
                        >
                          {day}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
