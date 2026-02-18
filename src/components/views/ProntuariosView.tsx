import React from 'react';
import { Prontuario } from '../Prontuario';

interface ProntuariosViewProps {
  pronouns: any[];
  onSelectProntuario: (prontuario: Prontuario) => void;
  onEditProntuario: (prontuario: Prontuario) => void;
}

export function ProntuariosView({ 
  pronouns, 
  onSelectProntuario, 
  onEditProntuario 
}: ProntuariosViewProps): React.ReactElement {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Prontuários</h2>
      <div className="bg-app-surface border border-app-border rounded overflow-hidden">
        {pronouns.length === 0 ? (
          <div className="p-8 text-center text-app-text/70">
            Nenhum prontuário registrado. Clique em um paciente da agenda para criar um.
          </div>
        ) : (
          <div className="divide-y divide-app-border">
            {pronouns.map((item: any, idx: number) => (
              <div 
                key={idx}
                className="p-4 hover:bg-app-bg cursor-pointer flex justify-between items-center transition-colors"
              >
                <div>
                  <div className="font-semibold">{item.nomeCompleto || item.paciente?.nome || 'Sem nome'}</div>
                  <div className="text-sm text-app-text/70">{item.queixaPrincipal || 'Sem descrição'}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onSelectProntuario(item)}
                    className="px-3 py-1 bg-app-primary text-white rounded text-sm hover:bg-sky-600 transition-colors"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => onEditProntuario(item)}
                    className="px-3 py-1 bg-app-primary/50 text-white rounded text-sm hover:bg-app-primary transition-colors"
                  >
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
