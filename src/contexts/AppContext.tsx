'use client';

import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { Appointment } from '@/app/page';
import { Paciente } from '@/components/Paciente';

const API_URL = 'http://localhost:8080/api';

export interface AppContextType {
  // View State
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Data State
  appointments: Appointment[];
  setAppointments: (appointments: Appointment[]) => void;
  patients: Paciente[];
  setPatients: (patients: Paciente[]) => void;
  selectedPatient: Paciente | null;
  setSelectedPatient: (patient: Paciente | null) => void;

  // UI State
  loading: boolean;
  error: string | null;
  
  // Actions
  addAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchPatients: () => Promise<void>;
  clearError: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps): React.ReactElement {
  // View State
  const [currentView, setCurrentView] = useState('agenda');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Data State
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actions
  const addAppointment = useCallback(async (appointment: Omit<Appointment, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/agendamentos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      });
      if (!response.ok) throw new Error('Erro ao criar agendamento');
      
      const newAppointment: Appointment = await response.json();
      setAppointments(prev => [...prev, newAppointment]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      setError(errorMessage);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteAppointment = useCallback(async (id: number): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/agendamentos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar agendamento');
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao deletar agendamento';
      setError(errorMessage);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointments = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/agendamentos`);
      if (!response.ok) throw new Error('Erro ao buscar agendamentos');
      const data: Appointment[] = await response.json();
      setAppointments(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar agendamentos';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPatients = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_URL}/pacientes`);
      if (!response.ok) throw new Error('Erro ao buscar pacientes');
      const data: Paciente[] = await response.json();
      setPatients(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao buscar pacientes';
      setError(errorMessage);
      console.error('API Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const value = useMemo<AppContextType>(() => ({
    currentView, setCurrentView,
    sidebarOpen, setSidebarOpen,
    appointments, setAppointments,
    patients, setPatients,
    selectedPatient, setSelectedPatient,
    loading,
    error,
    addAppointment,
    deleteAppointment,
    fetchAppointments,
    fetchPatients,
    clearError,
  }), [
    currentView, sidebarOpen, appointments, patients, selectedPatient, 
    loading, error, addAppointment, deleteAppointment, fetchAppointments, 
    fetchPatients, clearError
  ]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
