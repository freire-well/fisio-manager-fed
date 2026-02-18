import React from 'react';
import { MenuIcon, UserIcon } from '../Icons';

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps): React.ReactElement {
  return (
    <header className="bg-app-surface border-b border-app-border px-4 py-3 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="text-app-text hover:text-app-primary transition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          <MenuIcon />
        </button>
        <h1 className="text-xl font-bold text-app-primary">FisioManager</h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-app-bg border border-app-border rounded hover:border-app-primary cursor-pointer transition-colors flex items-center gap-2">
          <UserIcon />
          <span className="font-semibold hidden sm:inline">Dr. Fisioterapeuta</span>
        </div>
      </div>
    </header>
  );
}
