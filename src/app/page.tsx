'use client';

import React, { useState, useEffect } from 'react';
import { useAppContext } from '@/contexts/useAppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AgendaView } from '@/components/views/AgendaView';
import { PacientesView } from '@/components/views/PacientesView';
import { ProntuarioForm } from '@/components/ProntuarioForm';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { Paciente } from '@/components/Paciente';
import { Prontuario } from '@/components/Prontuario';

export interface Appointment {
  id: number;
  paciente: Paciente;
  patientId: number;
  date: string;
  time: string;
  type: string;
  prontuario?: Prontuario;
}

const API_URL = 'http://localhost:8080/api';

const saveProntuary = async (data: Prontuario): Promise<Prontuario> => {
    try {
        const response = await fetch(`${API_URL}/prontuarios/${data.id || ''}`, {
            method: data.id ? 'POST' : 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        alert('Prontuário salvo!');
        if (!response.ok) throw new Error('Erro ao salvar prontuário');
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { ...data, id: data.id || Date.now() };
    }
};

const fetchPatients = async () : Promise<Paciente[]> => {
    try {
        const response = await fetch(`${API_URL}/pacientes`);
        if (!response.ok) throw new Error('Erro ao buscar pacientes');
        const data = await response.json();
        return data;
    } catch (err) {
        console.error('Erro ao carregar pacientes:', err);
        return [] as Paciente[];
    }
};
                           

export default function FisioManager(): React.ReactElement {
    const { 
        currentView, setCurrentView, sidebarOpen, setSidebarOpen,
        appointments, selectedPatient, setSelectedPatient,
        fetchAppointments, error, clearError
    } = useAppContext();

    const [showAddModal, setShowAddModal] = useState(false);
    const [patients, setPatients] = useState<Paciente[]>([]);
    const [prontuarioData, setProntuarioData] = useState<Prontuario>({
        id: undefined,
        nomeCompleto: '',
        dataNascimento: new Date(),
        idade: '',
        sexo: '',
        profissao: '',
        telefone: '',
        endereco: '',
        antecedentes: '',
        medicamentos: '',
        cirurgias: '',
        queixaPrincipal: '',
        inicioSintomas: '',
        fatoresAgravantes: '',
        fatoresAtenuantes: '',
        inspecao: '',
        palpacao: '',
        adm: '',
        forcaMuscular: '',
        testesEspeciais: '',
        diagnostico: '',
        objetivosCurto: '',
        objetivosMedio: '',
        objetivosLongo: '',
        condutas: '',
        tecnicas: '',
        exercicios: '',
        orientacoes: '',
        frequencia: '',
        sessoes: []
    });

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);

    useEffect(() => {
        fetchPatients().then(setPatients);
    }, []);

    const openPatientRecord = async (paciente: Paciente): Promise<void> => {
        setSelectedPatient(paciente);
        if (paciente.prontuario?.id) {
            try {
                const response = await fetch(`${API_URL}/prontuarios/${paciente.prontuario.id}`);
                if (!response.ok) throw new Error('Erro ao buscar prontuário');
                const prontuario: Prontuario = await response.json();
                setProntuarioData(prev => ({
                    ...prev,
                    ...prontuario,
                    id: prontuario.id,
                    dataNascimento: prontuario.dataNascimento || new Date(),
                    nomeCompleto: paciente.nome,
                    telefone: paciente.telefone || prev.telefone
                }));
            } catch (err) {
                console.error('Erro ao carregar prontuário:', err);
            }
        } else {
            setProntuarioData(prev => ({
                ...prev,
                nomeCompleto: paciente.nome,
                telefone: paciente.telefone
            }));
        }
        setCurrentView('prontuario');
    };

    const handleDeleteAppointment = (id: number): void => {
        // TODO: Fazer integração com Context quando adicionado deleteAppointment
        console.log('Deletar agendamento:', id);
    };

    return (
        <div className="min-h-screen bg-app-bg text-app-text font-sans">
            <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

            {error && (
                <div className="bg-red-900/20 border-b border-red-700 px-4 py-3">
                    <div className="flex justify-between items-center">
                        <span className="text-red-400">{error}</span>
                        <button 
                            onClick={clearError}
                            className="text-red-400 hover:text-red-300 text-sm"
                        >
                            Descartar
                        </button>
                    </div>
                </div>
            )}

            <div className="flex relative">
                <Sidebar 
                    isOpen={sidebarOpen} 
                    onClose={() => setSidebarOpen(false)}
                    currentView={currentView}
                    onViewChange={setCurrentView}
                />

                {/* Main Content */}
                <main className="flex-1 p-4 lg:p-6 overflow-x-hidden min-h-[calc(100vh-65px)]">
                    {currentView === 'agenda' && (
                        <AgendaView 
                            appointments={appointments}
                            onAddAppointment={() => setShowAddModal(true)}
                            onSelectAppointment={openPatientRecord}
                            onDeleteAppointment={handleDeleteAppointment}
                        />
                    )}

                    {currentView === 'prontuario' && selectedPatient && (
                        <ProntuarioForm 
                            prontuario={prontuarioData}
                            paciente={selectedPatient}
                            onBack={() => setCurrentView('agenda')}
                            onSave={(data) => {
                                saveProntuary(data);
                            }}
                        />
                    )}

                    {currentView === 'prontuarios-list' && (
                        <PacientesView 
                            patients={patients}
                            onSelectPatient={openPatientRecord}
                        />
                    )}
                </main>
            </div>

            <AddAppointmentModal 
                isOpen={showAddModal}
                patients={[]}
                onClose={() => setShowAddModal(false)}
                onSave={(apt) => {
                    console.log('Novo agendamento:', apt);
                    setShowAddModal(false);
                    // TODO: Integrar com Context quando adicionado addAppointment
                }}
            />
        </div>
    );
}
