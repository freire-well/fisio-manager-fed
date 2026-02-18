import React from 'react';
import { CalendarIcon, FileIcon } from '../Icons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isOpen, onClose, currentView, onViewChange }: SidebarProps): React.ReactElement {
  const handleViewChange = (view: string): void => {
    onViewChange(view);
    onClose();
  };

  return (
    <>
      <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} fixed lg:sticky lg:top-[65px] lg:translate-x-0 w-64 bg-app-surface border-r border-app-border h-[calc(100vh-65px)] transition-transform z-40`}>
        <nav className="p-4 space-y-2">
          <button
            onClick={() => handleViewChange('agenda')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded font-semibold transition-colors ${currentView === 'agenda' ? 'bg-app-primary text-white' : 'text-app-text hover:bg-app-bg'}`}
            aria-label="Go to agenda"
          >
            <CalendarIcon />
            Agenda
          </button>
          <button
            onClick={() => handleViewChange('prontuarios-list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded font-semibold transition-colors ${['prontuarios-list', 'prontuario'].includes(currentView) ? 'bg-app-primary text-white' : 'text-app-text hover:bg-app-bg'}`}
            aria-label="Go to medical records"
          >
            <FileIcon />
            Prontuários
          </button>
        </nav>
      </aside>

      {/* Overlay Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </>
  );
}
