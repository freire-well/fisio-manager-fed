import React, { useState } from 'react';
import { PlusIcon } from '../Icons';
import { Appointment } from '@/app/page';

interface AgendaViewProps {
  appointments: Appointment[];
  onAddAppointment: () => void;
  onSelectAppointment: (appointment: any) => void;
  onDeleteAppointment: (id: number) => void;
}

export function AgendaView({ 
  appointments, 
  onAddAppointment, 
  onSelectAppointment,
  onDeleteAppointment 
}: AgendaViewProps): React.ReactElement {
  const [calendarView, setCalendarView] = useState<'week' | 'month' | 'year'>('week');

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
        <div className="bg-app-surface border border-app-border rounded overflow-hidden overflow-x-auto">
          <div className="min-w-[600px]">
            <div className="grid grid-cols-8 border-b border-app-border">
              <div className="p-4 font-bold border-r border-app-border">Horário</div>
              {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map(day => (
                <div key={day} className="p-4 font-bold text-center border-r border-app-border last:border-r-0">
                  {day}
                </div>
              ))}
            </div>
            {Array.from({ length: 12 }, (_, i) => i + 8).map(hour => (
              <div key={hour} className="grid grid-cols-8 border-b border-app-border last:border-b-0">
                <div className="p-4 font-semibold border-r border-app-border bg-app-bg">
                  {hour}:00
                </div>
                {Array.from({ length: 7 }).map((_, idx) => {
                  const dayAppointments = appointments.filter(apt => parseInt(apt.time.split(':')[0]) === hour && idx === 0);
                  
                  return (
                    <div key={idx} className="p-2 border-r border-app-border last:border-r-0 min-h-[80px]">
                      {dayAppointments.map(apt => (
                        <div key={apt.id} className="bg-app-primary bg-opacity-20 border border-app-primary rounded p-2 mb-2 text-sm">
                          <button
                            onClick={() => onSelectAppointment(apt.paciente)}
                            className="w-full bg-app-primary bg-opacity-20 border-app-primary rounded px-2 py-1 mb-1 text-xs hover:bg-opacity-30 transition-colors text-left"
                          >
                            <div className="font-semibold text-app-primary">{apt.paciente.nome}</div>
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
      )}

      {/* Visão Mensal */}
      {calendarView === 'month' && (
        <div className="bg-app-surface border border-app-border rounded overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-app-border">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="bg-app-surface p-4 font-bold text-center">
                {day}
              </div>
            ))}
            {Array.from({ length: 30 }, (_, i) => i + 1).map(day => {
              const dayAppointments = appointments.filter(apt => {
                const aptDay = parseInt(apt.date.split('-')[2]);
                return aptDay === day;
              });

              return (
                <div key={day} className="bg-app-surface p-3 min-h-[120px]">
                  <div className="font-semibold mb-2">{day}</div>
                  {dayAppointments.map(apt => (
                    <button
                      key={apt.id}
                      onClick={() => onSelectAppointment(apt.paciente)}
                      className="w-full bg-app-primary bg-opacity-20 border border-app-primary rounded px-2 py-1 mb-1 text-xs hover:bg-opacity-30 transition-colors text-left truncate"
                    >
                      {apt.time} {apt.paciente.nome}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(month => (
            <div key={month} className="bg-app-surface border border-app-border rounded p-4">
              <h3 className="font-bold mb-3 text-center">{month} 2026</h3>
              <div className="grid grid-cols-7 gap-1 text-xs">
                {Array.from({ length: 30 }, (_, i) => i + 1).map(day => (
                  <div key={day} className="aspect-square flex items-center justify-center hover:bg-app-bg rounded cursor-pointer text-app-text/70 hover:text-white transition-colors">
                    {day}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
