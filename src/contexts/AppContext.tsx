'use client';

import React, { createContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { api } from '@/services/api';
import { Paciente } from '@/components/Paciente';
import { Agendamento } from '@/components/Agendamento';

export interface AppContextType {
  // View State
  currentView: string;
  setCurrentView: (view: string) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;

  // Data State
  appointments: Agendamento[];
  setAppointments: (appointments: Agendamento[]) => void;
  patients: Paciente[];
  setPatients: (patients: Paciente[]) => void;
  selectedPatient: Paciente | null;
  setSelectedPatient: (patient: Paciente | null) => void;

  // UI State
  loading: boolean;
  error: string | null;
  
  // Actions
  addAppointment: (appointment: Omit<Agendamento, 'id'>) => Promise<void>;
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
  const [appointments, setAppointments] = useState<Agendamento[]>([]);
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);

  // UI State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actions
  const addAppointment = useCallback(async (appointment: Omit<Agendamento, 'id'>): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const newAppointment: Agendamento = await api.post<Agendamento>('/agendamentos', appointment);
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
      await api.delete(`/agendamentos/${id}`);
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
      const data: Agendamento[] = await api.get<Agendamento[]>('/agendamentos');
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
      const data: Paciente[] = await api.get<Paciente[]>('/pacientes');
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
