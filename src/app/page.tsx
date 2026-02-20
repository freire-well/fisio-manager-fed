'use client';

import React, { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { useAppContext } from '@/contexts/useAppContext';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AgendaView } from '@/components/views/AgendaView';
import { PacientesView } from '@/components/views/PacientesView';
import { ProntuarioForm } from '@/components/ProntuarioForm';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { Paciente } from '@/components/Paciente';
import { Prontuario } from '@/components/Prontuario';
import { Agendamento } from '@/components/Agendamento';

const saveProntuary = async (data: Prontuario): Promise<Prontuario> => {
    try {
        const result = data.id 
            ? await api.post<Prontuario>(`/prontuarios/${data.id}`, data)
            : await api.put<Prontuario>('/prontuarios', data);
        alert('Prontuário salvo!');
        return result;
    } catch (error) {
        console.error('API Error:', error);
        return { ...data, id: data.id || Date.now() };
    }
};

const fetchPatients = async () : Promise<Paciente[]> => {
    try {
        const data = await api.get<Paciente[]>('/pacientes');
        return data;
    } catch (err) {
        console.error('Erro ao carregar pacientes:', err);
        return [] as Paciente[];
    }
};

const fetchAppointments = async (): Promise<Agendamento[]> => {
    try {
        return await api.get<Agendamento[]>('/agendamentos');
    } catch (err) {
        console.error('Erro ao carregar agendamentos:', err);
        return [] as Agendamento[];
    }
};
                           

export default function FisioManager(): React.ReactElement {
    const { 
        currentView, setCurrentView, sidebarOpen, setSidebarOpen,
          selectedPatient, setSelectedPatient,
         error, clearError
    } = useAppContext();

    const [showAddModal, setShowAddModal] = useState(false);
    const [patients, setPatients] = useState<Paciente[]>([]);
    const [appointments, setAppointments] = useState<Agendamento[]>([]);
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
        fetchAppointments().then(setAppointments);
    }, []);

    useEffect(() => {
        fetchPatients().then(setPatients);
    }, []);

    const openPatientRecord = async (paciente: Paciente): Promise<void> => {
        setSelectedPatient(paciente);
        if (paciente.prontuario?.id) {
            try {
                const prontuario: Prontuario = await api.get<Prontuario>(`/prontuarios/${paciente.prontuario.id}`);
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
            setProntuarioData({
                id: undefined,
                nomeCompleto: paciente.nome,
                dataNascimento: new Date(),
                idade: '',
                sexo: '',
                profissao: '',
                telefone: paciente.telefone || '',
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
        }
        setCurrentView('prontuario');
    };

    const handleDeleteAppointment = (id: number): void => {
        api.delete(`/agendamentos/${id}`)
            .then(() => fetchAppointments())
            .catch(err => {
                console.error('Erro ao deletar agendamento:', err);
                alert('Erro ao deletar agendamento');
            });
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
                            patients={patients}
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
                    {currentView === 'prontuarios' && selectedPatient && (
                        <ProntuarioForm 
                            prontuario={prontuarioData}
                            paciente={selectedPatient}
                            onBack={() => setCurrentView('agenda')}
                            onSave={(data) => {
                                saveProntuary(data);
                            }}
                        />
                    )}
                </main>
            </div>

            <AddAppointmentModal 
                isOpen={showAddModal}
                patients={patients} // TODO: Integrar com Context para usar pacientes do estado global
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
