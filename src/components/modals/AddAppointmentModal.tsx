import React, { useState, useEffect } from 'react';
import { CloseIcon } from '../Icons';
import { Paciente } from '../Paciente';
import { Agendamento } from '../Agendamento';

interface AddAppointmentModalProps {
  isOpen: boolean;
  patients: Paciente[];
  onClose: () => void;
  onSave: (appointment: Omit<Agendamento, 'id'>) => void;
}

export function AddAppointmentModal({ isOpen, patients, onClose, onSave }: AddAppointmentModalProps): React.ReactElement | null {
  const [formData, setFormData] = useState({
    patientId: 0,
    cpf: '',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'Fisioterapia',
  });

  const [showNewPatientForm, setShowNewPatientForm] = useState(false);
  const [newPatientData, setNewPatientData] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    dataNascimento: '',
  });
  const [patients_list, setPatientsList] = useState<Paciente[]>(patients);
  const [isCheckingSlot, setIsCheckingSlot] = useState(false);

  // Sincroniza a lista de pacientes locais com a prop `patients`
  useEffect(() => {
    setPatientsList(patients);
  }, [patients]);


  const saveAppointment = async (): Promise<void> => {
    await fetch('http://localhost:8080/api/agendamentos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        paciente: patients_list.find(p => p.id === formData.patientId),
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        type: formData.type,
      }),
    });
  };

  const saveNewPatient = async (): Promise<void> => {
    if (!newPatientData.nome || !newPatientData.cpf) {
      alert('Por favor, preencha nome e CPF');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/pacientes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatientData),
      });

      if (!response.ok) throw new Error('Erro ao salvar paciente');
      
      const newPatient = await response.json();
      
      // Adiciona o novo paciente à lista local
      const updatedPatients = [...patients_list, newPatient];
      setPatientsList(updatedPatients);
      
      // Seleciona automaticamente o novo paciente
      setFormData({
        ...formData,
        patientId: newPatient.id,
        cpf: newPatient.cpf,
      });

      // Reseta o formulário de novo paciente e fecha
      setNewPatientData({ nome: '', cpf: '', telefone: '', email: '', dataNascimento: '' });
      setShowNewPatientForm(false);
      
      alert('Paciente cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar paciente:', error);
      alert('Erro ao cadastrar paciente. Tente novamente.');
    }
  };

  const handleSave = async (): Promise<void> => {
    if (!formData.patientId || !formData.date || !formData.time) {
      alert('Por favor, preencha todos os campos');
      return;
    }

    setIsCheckingSlot(true);
    
    try {
      // Verifica se o horário está bloqueado
      const response = await fetch('http://localhost:8080/api/horarios-bloqueados');
      
      if (response.ok) {
        const blockedSlots = await response.json();
        const hour = formData.time.split(':')[0];
        const isBlocked = blockedSlots.some((slot: { date: string; time: string }) => 
          slot.date === formData.date && slot.time.startsWith(hour + ':')
        );

        if (isBlocked) {
          setIsCheckingSlot(false);
          alert('Este horário está bloqueado. Escolha outro horário.');
          return;
        }
      }

      setIsCheckingSlot(false);
      await saveAppointment();
      const selectedPatient = patients_list.find(p => p.id === formData.patientId);
      if (selectedPatient && formData.date && formData.time) {
        onSave({
          paciente: selectedPatient,
          paciente_id: formData.patientId,
          date: formData.date,
          time: formData.time,
          type: formData.type,
        });
      }
    } catch (error) {
      setIsCheckingSlot(false);
      console.error('Erro ao verificar disponibilidade:', error);
      alert('Erro ao verificar disponibilidade do horário');
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d)/, '$1.$2');
    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    e.target.value = value.substring(0, 14);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-app-surface border border-app-border rounded w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Novo Agendamento</h3>
          <button 
            onClick={onClose}
            className="text-app-text hover:text-app-primary"
            aria-label="Close modal"
          >
            <CloseIcon />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label htmlFor="patient-select" className="block text-sm font-semibold mb-2">
              Paciente
            </label>
            <select
              id="patient-select"
              value={formData.patientId}
              onChange={(e) => {
                const patientId = parseInt(e.target.value);
                
                if (patientId === -1) {
                  // Abre o formulário de novo paciente
                  setShowNewPatientForm(true);
                  setFormData({ ...formData, patientId: 0, cpf: '' });
                } else {
                  const selectedPatient = patients_list.find(p => p.id === patientId);
                  setFormData({ 
                    ...formData, 
                    patientId, 
                    cpf: selectedPatient ? selectedPatient.cpf : '' 
                  });
                }
              }} 
              className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
            >
              <option value={0}>Selecione um paciente</option>
              <option disabled>──────────</option>
              <option value={-1}>Novo Paciente</option>
              <option disabled>──────────</option>
              {patients_list.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cpf-input" className="block text-sm font-semibold mb-2">
              CPF
            </label>
            <input 
              value={formData.cpf}
              id="cpf-input"
              placeholder="000.000.000-00" 
              onChange={handleCPFChange} 
              maxLength={14} 
              className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="date-input" className="block text-sm font-semibold mb-2">
              Data
            </label>
            <input 
              id="date-input"
              type="date" 
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="time-input" className="block text-sm font-semibold mb-2">
              Horário
            </label>
            <input 
              id="time-input"
              type="time" 
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
            />
          </div>

          <div>
            <label htmlFor="type-select" className="block font-semibold mb-2">
              Tipo
            </label>
            <select
              id="type-select"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
            >
              <option>Liberação</option>
              <option>Fisioterapia</option>
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <button 
              onClick={handleSave}
              disabled={isCheckingSlot || !formData.patientId}
              className="flex-1 bg-app-primary text-white py-2 rounded font-bold hover:bg-sky-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCheckingSlot ? 'Verificando...' : 'Salvar'}
            </button>
            <button 
              onClick={onClose}
              disabled={isCheckingSlot}
              className="flex-1 bg-app-bg border border-app-border text-app-text py-2 rounded font-bold hover:bg-app-surface transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Modal para cadastrar novo paciente */}
      {showNewPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-app-surface border border-app-border rounded w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Cadastrar Novo Paciente</h3>
              <button 
                onClick={() => {
                  setShowNewPatientForm(false);
                  setNewPatientData({ nome: '', cpf: '', telefone: '', email: '', dataNascimento: '' });
                }}
                className="text-app-text hover:text-app-primary"
                aria-label="Fechar formulário de novo paciente"
              >
                <CloseIcon />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="new-patient-name" className="block text-sm font-semibold mb-2">
                  Nome Completo *
                </label>
                <input 
                  id="new-patient-name"
                  type="text"
                  placeholder="João Silva"
                  value={newPatientData.nome}
                  onChange={(e) => setNewPatientData({ ...newPatientData, nome: e.target.value })}
                  className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
                />
              </div>

              <div>
                <label htmlFor="new-patient-cpf" className="block text-sm font-semibold mb-2">
                  CPF *
                </label>
                <input 
                  id="new-patient-cpf"
                  type="text"
                  placeholder="000.000.000-00"
                  maxLength={14}
                  value={newPatientData.cpf}
                  onChange={(e) => {
                    let value = e.target.value.replace(/\D/g, '');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d)/, '$1.$2');
                    value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
                    setNewPatientData({ ...newPatientData, cpf: value.substring(0, 14) });
                  }}
                  className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
                />
              </div>

              <div>
                <label htmlFor="new-patient-dob" className="block text-sm font-semibold mb-2">
                  Data de Nascimento
                </label>
                <input 
                  id="new-patient-dob"
                  type="date"
                  value={newPatientData.dataNascimento}
                  onChange={(e) => setNewPatientData({ ...newPatientData, dataNascimento: e.target.value })}
                  className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
                />
              </div>

              <div>
                <label htmlFor="new-patient-phone" className="block text-sm font-semibold mb-2">
                  Telefone
                </label>
                <input 
                  id="new-patient-phone"
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={newPatientData.telefone}
                  onChange={(e) => setNewPatientData({ ...newPatientData, telefone: e.target.value })}
                  className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
                />
              </div>

              <div>
                <label htmlFor="new-patient-email" className="block text-sm font-semibold mb-2">
                  Email
                </label>
                <input 
                  id="new-patient-email"
                  type="email"
                  placeholder="email@example.com"
                  value={newPatientData.email}
                  onChange={(e) => setNewPatientData({ ...newPatientData, email: e.target.value })}
                  className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  onClick={saveNewPatient}
                  className="flex-1 bg-app-primary text-white py-2 rounded font-bold hover:bg-sky-600 transition-colors"
                >
                  Salvar Paciente
                </button>
                <button 
                  onClick={() => {
                    setShowNewPatientForm(false);
                    setNewPatientData({ nome: '', cpf: '', telefone: '', email: '', dataNascimento: '' });
                  }}
                  className="flex-1 bg-app-bg border border-app-border text-app-text py-2 rounded font-bold hover:bg-app-surface transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
