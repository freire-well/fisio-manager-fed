import React from 'react';
import { UserIcon } from '../Icons';
import { Paciente } from '../Paciente';

interface PacientesViewProps {
  patients: Paciente[];
  onSelectPatient: (patient: Paciente) => void;
}

export function PacientesView({ patients, onSelectPatient }: PacientesViewProps): React.ReactElement {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Lista de Pacientes</h2>
      <div className="bg-app-surface border border-app-border rounded overflow-hidden">
        {patients.length === 0 ? (
          <div className="p-8 text-center text-app-text/70">
            Nenhum paciente registrado
          </div>
        ) : (
          patients.map(p => (
            <div 
              key={p.id} 
              onClick={() => onSelectPatient(p)}
              className="p-4 border-b border-app-border hover:bg-app-bg cursor-pointer flex justify-between items-center transition-colors last:border-b-0"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-app-primary bg-opacity-20 rounded-full">
                  <UserIcon />
                </div>
                <div>
                  <span className="font-semibold">{p.nome}</span>
                  <div className="text-sm text-app-text/70">{p.cpf}</div>
                </div>
              </div>
              <div className="text-sm text-app-text/70">{p.telefone}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
