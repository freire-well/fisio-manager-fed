import React, { useState } from 'react';
import { CloseIcon } from '../Icons';
import { Paciente } from '../Paciente';
import { Appointment } from '@/app/page';

interface AddAppointmentModalProps {
  isOpen: boolean;
  patients: Paciente[];
  onClose: () => void;
  onSave: (appointment: Omit<Appointment, 'id'>) => void;
}

export function AddAppointmentModal({ isOpen, patients, onClose, onSave }: AddAppointmentModalProps): React.ReactElement | null {
  const [formData, setFormData] = useState({
    patientId: 0,
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    type: 'Fisioterapia',
  });

  const handleSave = (): void => {
    const selectedPatient = patients.find(p => p.id === formData.patientId);
    if (selectedPatient && formData.date && formData.time) {
      onSave({
        paciente: selectedPatient,
        patientId: formData.patientId,
        date: formData.date,
        time: formData.time,
        type: formData.type,
      });
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
              onChange={(e) => setFormData({ ...formData, patientId: parseInt(e.target.value) })}
              className="w-full bg-app-bg border border-app-border rounded px-3 py-2 text-app-text focus:border-app-primary outline-none"
            >
              <option value={0}>Selecione um paciente</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="cpf-input" className="block text-sm font-semibold mb-2">
              CPF
            </label>
            <input 
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
              className="flex-1 bg-app-primary text-white py-2 rounded font-bold hover:bg-sky-600 transition-colors"
            >
              Salvar
            </button>
            <button 
              onClick={onClose} 
              className="flex-1 bg-app-bg border border-app-border text-app-text py-2 rounded font-bold hover:bg-app-surface transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
