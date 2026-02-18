# 📋 Plano de Modernização - FisioManager

**Data:** 18 de fevereiro de 2026  
**Versão:** 0.1.0 → 1.0.0 (planned)  
**Status:** Planning Phase

---

## 📌 Resumo Executivo

Este documento descreve o plano estratégico para transformar o FisioManager de um MVP funcional em uma aplicação corporativa robusta, escalável e acessível. O plano é organizado em 4 fases com 8 tarefas principais, estimadas em **5-8 semanas** de desenvolvimento.

**Objetivo Principal:** Aplicar as 8 áreas de melhoria identificadas na análise inicial, aumentando a qualidade de código, robustez e experiência do usuário.

---

## 🎯 Áreas de Melhoria Encontradas

| # | Problema | Impacto | Prioridade |
|---|----------|--------|-----------|
| 1 | TypeScript `strict: false` | Bugs em tempo de execução | 🔴 Crítica |
| 2 | Muita lógica em `page.tsx` (458 linhas) | Difícil de manter/testar | 🔴 Crítica |
| 3 | Sem State Management (Context/Redux) | Prop drilling, estado desorganizado | 🟠 Alta |
| 4 | Sem validação de formulário | Dados inválidos no backend | 🟠 Alta |
| 5 | Sem componentes Loading/Error | UX ruim em requisições | 🟡 Média |
| 6 | Sem ARIA labels/acessibilidade | Usuários com deficiência excluídos | 🟡 Média |
| 7 | Sem testes automatizados | Regressões silenciosas | 🟡 Média |
| 8 | Sem otimizações de performance | Aplicação lenta em produção | 🟡 Média |

---

## 📊 Estrutura do Plano

```
FASE 1: Fundação & Qualidade (1-2 sem)
├── Task #1: TypeScript Strict Mode ⚡
├── Task #2: Refatorar page.tsx 🏗️
└── Task #3: Context API 🔄

FASE 2: Validação & Robustez (1-2 sem)
├── Task #4: Validação com Zod ✅
└── Task #5: Componentes Loading/Error 🎨

FASE 3: Acessibilidade & Experiência (1 sem)
└── Task #6: ARIA Labels & Acessibilidade ♿

FASE 4: Testes & Performance (2-3 sem)
├── Task #7: Testes Automatizados 🧪
└── Task #8: Otimizações de Performance ⚡
```

---

## 📋 FASE 1: Fundação & Qualidade de Código
**Duração:** 1-2 semanas  
**Objetivo:** Preparar base sólida para futuras melhorias

---

### Task #1: Habilitar TypeScript Strict Mode ⚡

**Status:** `not-started`  
**Prioridade:** 🔴 Máxima  
**Duração:** 1-2 dias  
**Responsável:** Solo  
**Bloqueador para:** Todas as outras tasks

#### Justificativa
- Prevenir 80% dos bugs em tempo de compilação
- Melhorar autocomplete do IDE
- Documentação de tipos explícita

#### Passos de Execução

1. **Atualizar tsconfig.json**
   ```json
   {
     "compilerOptions": {
       "strict": true,                    // ← Ativar
       "noImplicitAny": true,             // ← Adicionar
       "noImplicitThis": true,            // ← Adicionar
       "strictNullChecks": true,          // ← Incluído em strict
       "strictFunctionTypes": true,       // ← Incluído em strict
       "noUnusedLocals": true,            // ← Adicionar (nice to have)
       "noUnusedParameters": true,        // ← Adicionar (nice to have)
       "noImplicitReturns": true          // ← Adicionar
     }
   }
   ```

2. **Resolver erros em page.tsx (linhas 1-458)**
   - [ ] Tipar `api` object com interfaces
   - [ ] Tipar `appointments` state
   - [ ] Tipar `patientsList` state
   - [ ] Tipar callback handlers
   - [ ] Validar retorno de funções async

   **Exemplo - Antes:**
   ```typescript
   const api = {
     async getAppointments() { ... },  // ❌ Sem tipo de retorno
   };
   ```

   **Exemplo - Depois:**
   ```typescript
   interface ApiService {
     getAppointments(): Promise<Appointment[]>;
     getPatients(): Promise<Paciente[]>;
     // ...
   }

   const api: ApiService = {
     async getAppointments(): Promise<Appointment[]> { ... },  // ✅ Tipado
   };
   ```

3. **Resolver erros em componentes**
   - [ ] [src/components/ProntuarioForm.tsx](src/components/ProntuarioForm.tsx) - Tipar props, estado
   - [ ] [src/components/Paciente.tsx](src/components/Paciente.tsx) - Validar classe
   - [ ] [src/components/Prontuario.tsx](src/components/Prontuario.tsx) - Validar classe
   - [ ] [src/components/Agendamento.tsx](src/components/Agendamento.tsx) - Validar classe
   - [ ] [src/components/Sessoes.tsx](src/components/Sessoes.tsx) - Validar classe

4. **Testar build**
   ```bash
   npm run build
   # Esperado: 0 erros TS
   ```

#### Checklist
- [ ] tsconfig.json atualizado com `strict: true`
- [ ] Todos os arquivos `*.tsx` compilam sem erros
- [ ] Não há `// @ts-ignore` comments (exceto se absolutamente necessário)
- [ ] `npm run build` executa com sucesso

#### Impacto
- ✅ Type safety em 100%
- ✅ Melhor IDE experience
- ✅ Redução de runtime bugs

---

### Task #2: Refatorar page.tsx em Componentes 🏗️

**Status:** `not-started`  
**Prioridade:** 🔴 Máxima  
**Duração:** 3-4 dias  
**Dependência:** Task #1 (TypeScript strict)

#### Justificativa
- page.tsx tem 458 linhas (muito grande)
- Difícil de testar components isolados
- Reutilização limitada

#### Arquitetura Alvo

```
src/
├── app/
│   ├── page.tsx (refatorado: ~100 linhas apenas)
│   ├── layout.tsx
│   └── global.css
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         (Menu lateral + toggle)
│   │   ├── Navbar.tsx          (Barra superior)
│   │   └── MainLayout.tsx      (Wrapper layout)
│   ├── views/
│   │   ├── AgendaView.tsx      (Gestão de agendamentos)
│   │   ├── PacientesView.tsx   (Gestão de pacientes)
│   │   └── ProntuariosView.tsx (Gestão de prontuários)
│   ├── modals/
│   │   └── AddAppointmentModal.tsx
│   ├── (existentes)
│   │   ├── ProntuarioForm.tsx
│   │   ├── Icons.tsx
│   │   ├── Paciente.tsx
│   │   ├── Prontuario.tsx
│   │   ├── Agendamento.tsx
│   │   └── Sessoes.tsx
│   ├── common/
│   │   ├── LoadingSpinner.tsx  (Task #5)
│   │   ├── ErrorAlert.tsx      (Task #5)
│   │   └── SkeletonLoader.tsx  (Task #5)
│   └── AppProvider.tsx         (Task #3)
└── contexts/
    ├── AppContext.tsx          (Task #3)
    └── useAppContext.ts        (Task #3)
```

#### Componentes a Extrair

**1. Sidebar.tsx**
```typescript
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  currentView: string;
  onViewChange: (view: string) => void;
}

export function Sidebar({ isOpen, onClose, currentView, onViewChange }: SidebarProps) {
  // Extraído de page.tsx: Menu lateral
}
```

**2. Navbar.tsx**
```typescript
interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  // Extraído de page.tsx: Barra superior com logo/título
}
```

**3. AgendaView.tsx**
```typescript
interface AgendaViewProps {
  appointments: Appointment[];
  onAddAppointment: () => void;
  onSelectAppointment: (appointment: Appointment) => void;
}

export function AgendaView({ appointments, onAddAppointment, onSelectAppointment }: AgendaViewProps) {
  // Extraído de page.tsx: Seção agenda
}
```

**4. PacientesView.tsx**
```typescript
interface PacientesViewProps {
  patients: Paciente[];
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectPatient: (patient: Paciente) => void;
}

export function PacientesView({ patients, searchQuery, onSearchChange, onSelectPatient }: PacientesViewProps) {
  // Extraído de page.tsx: Seção pacientes
}
```

**5. ProntuariosView.tsx**
```typescript
interface ProntuariosViewProps {
  pronouns: Prontuario[];
  onSelectProntuario: (prontuario: Prontuario) => void;
  onEditProntuario: (prontuario: Prontuario) => void;
}

export function ProntuariosView({ pronouns, onSelectProntuario, onEditProntuario }: ProntuariosViewProps) {
  // Extraído de page.tsx: Seção prontuários
}
```

**6. AddAppointmentModal.tsx**
```typescript
interface AddAppointmentModalProps {
  isOpen: boolean;
  patients: Paciente[];
  onClose: () => void;
  onSave: (appointment: Appointment) => void;
}

export function AddAppointmentModal({ isOpen, patients, onClose, onSave }: AddAppointmentModalProps) {
  // Extraído de page.tsx: Modal de novo agendamento
}
```

#### Novo page.tsx (Refatorado)

```typescript
'use client';

import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/Sidebar';
import { AgendaView } from '@/components/views/AgendaView';
import { PacientesView } from '@/components/views/PacientesView';
import { ProntuariosView } from '@/components/views/ProntuariosView';
import { AddAppointmentModal } from '@/components/modals/AddAppointmentModal';
import { useAppContext } from '@/contexts/useAppContext';

export default function FisioManager() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { currentView, setCurrentView, appointments, patients } = useAppContext();
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="flex h-screen bg-app-bg">
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        currentView={currentView}
        onViewChange={setCurrentView}
      />
      
      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <main className="flex-1 overflow-auto p-6">
          {currentView === 'agenda' && (
            <AgendaView 
              appointments={appointments}
              onAddAppointment={() => setShowAddModal(true)}
            />
          )}
          
          {currentView === 'pacientes' && (
            <PacientesView 
              patients={patients}
            />
          )}
          
          {currentView === 'prontuarios' && (
            <ProntuariosView 
              pronouns={appointments}
            />
          )}
        </main>
      </div>

      <AddAppointmentModal 
        isOpen={showAddModal}
        patients={patients}
        onClose={() => setShowAddModal(false)}
        onSave={(appointment) => {
          // handle save
          setShowAddModal(false);
        }}
      />
    </div>
  );
}
```

#### Checklist
- [ ] `page.tsx` reduzido para ~100-150 linhas
- [ ] Todos os componentes extraídos compila sem erros
- [ ] Props bem tipadas em cada componente
- [ ] Funcionalidade mantida (sem regressões)
- [ ] Componentes podem ser testados isoladamente

#### Impacto
- ✅ Código mais legível
- ✅ Componentes reutilizáveis
- ✅ Testes isolados possíveis

---

### Task #3: Implementar Context API 🔄

**Status:** `not-started`  
**Prioridade:** 🔴 Máxima  
**Duração:** 2-3 dias  
**Dependência:** Task #1 + #2

#### Justificativa
- Eliminar prop drilling (passar props por múltiplos níveis)
- Estado global acessível em qualquer componente
- Facilita gerenciamento de estado

#### Arquitetura

**src/contexts/AppContext.tsx**
```typescript
import React, { createContext, useState, useCallback } from 'react';
import { Appointment, Paciente, Prontuario } from '@/components/models';

interface AppContextType {
  // View State
  currentView: 'agenda' | 'pacientes' | 'prontuarios';
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  
  // Actions
  addAppointment: (appointment: Appointment) => Promise<void>;
  deleteAppointment: (id: number) => Promise<void>;
  saveProntuario: (data: any) => Promise<void>;
  fetchAppointments: () => Promise<void>;
  fetchPatients: () => Promise<void>;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentView, setCurrentView] = useState<'agenda' | 'pacientes' | 'prontuarios'>('agenda');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Paciente[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Paciente | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const addAppointment = useCallback(async (appointment: Appointment) => {
    try {
      const response = await fetch('http://localhost:8080/api/agendamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment),
      });
      if (!response.ok) throw new Error('Erro ao criar agendamento');
      
      const newAppointment = await response.json();
      setAppointments(prev => [...prev, newAppointment]);
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  const deleteAppointment = useCallback(async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/agendamentos/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao deletar agendamento');
      setAppointments(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  const saveProntuario = useCallback(async (data: any) => {
    try {
      const response = await fetch(`http://localhost:8080/api/prontuarios/${data.id || ''}`, {
        method: data.id ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Erro ao salvar prontuário');
      // Update local state if needed
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }, []);

  const fetchAppointments = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/agendamentos');
      if (!response.ok) throw new Error('Erro ao buscar agendamentos');
      const data = await response.json();
      setAppointments(data);
    } catch (error) {
      console.error('API Error:', error);
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:8080/api/pacientes');
      if (!response.ok) throw new Error('Erro ao buscar pacientes');
      const data = await response.json();
      setPatients(data);
    } catch (error) {
      console.error('API Error:', error);
    }
  }, []);

  const value: AppContextType = {
    currentView, setCurrentView,
    sidebarOpen, setSidebarOpen,
    appointments, setAppointments,
    patients, setPatients,
    selectedPatient, setSelectedPatient,
    searchQuery, setSearchQuery,
    showAddModal, setShowAddModal,
    addAppointment,
    deleteAppointment,
    saveProntuario,
    fetchAppointments,
    fetchPatients,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

**src/contexts/useAppContext.ts**
```typescript
import { useContext } from 'react';
import { AppContext } from './AppContext';

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
```

**src/app/layout.tsx (atualizado)**
```typescript
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import { AppProvider } from "@/contexts/AppContext";
import "./global.css";

const workSans = Work_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
});

export const metadata: Metadata = {
  title: "FisioManager",
  description: "Gestor de Fisioterapia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={workSans.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
```

#### Uso nos Componentes

**Antes (com prop drilling):**
```typescript
// page.tsx
<Sidebar 
  isOpen={sidebarOpen}
  onClose={() => setSidebarOpen(false)}
  currentView={currentView}
  onViewChange={setCurrentView}
  appointments={appointments}
  patients={patients}
  // ... 10+ props!
/>
```

**Depois (com Context):**
```typescript
// Sidebar.tsx
import { useAppContext } from '@/contexts/useAppContext';

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen, currentView, setCurrentView } = useAppContext();
  
  return (
    // ... use state directly
  );
}
```

#### Checklist
- [ ] `AppContext.tsx` criado com tipos completos
- [ ] `useAppContext()` hook criado
- [ ] `AppProvider` envolvendo `RootLayout`
- [ ] Todos componentes usando `useAppContext()` ao invés de props
- [ ] Sem prop drilling
- [ ] Funcionalidade mantida

#### Impacto
- ✅ Código mais limpo (menos props)
- ✅ Estado previsível
- ✅ Fácil adicionar novos estado

---

## 📋 FASE 2: Validação & Robustez
**Duração:** 1-2 semanas  
**Objetivo:** Garantir entrada de dados válida

---

### Task #4: Adicionar Validação com Zod ✅

**Status:** `not-started`  
**Prioridade:** 🟠 Alta  
**Duração:** 2-3 dias  
**Dependência:** Task #1

#### Justificativa
- Validar dados no frontend antes de enviar
- Mensagens de erro claras e específicas
- Type-safe validation

#### Install

```bash
npm install zod
```

#### Schemas

**src/schemas/paciente.schema.ts**
```typescript
import { z } from 'zod';

export const PacienteSchema = z.object({
  id: z.number().int().positive(),
  cpf: z.string()
    .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido'),
  nome: z.string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres'),
  telefone: z.string()
    .regex(/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido'),
  prontuario: z.any().optional(),
});

export type Paciente = z.infer<typeof PacienteSchema>;
```

**src/schemas/prontuario.schema.ts**
```typescript
import { z } from 'zod';

export const ProntuarioSchema = z.object({
  id: z.number().int().optional(),
  nomeCompleto: z.string().min(3).max(100),
  dataNascimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  idade: z.string().optional(),
  sexo: z.enum(['M', 'F', 'Outro']),
  profissao: z.string().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  antecedentes: z.string().optional(),
  medicamentos: z.string().optional(),
  cirurgias: z.string().optional(),
  queixaPrincipal: z.string().min(5, 'Descreva a queixa principal'),
  inicioSintomas: z.string().optional(),
  fatoresAgravantes: z.string().optional(),
  fatoresAtenuantes: z.string().optional(),
  inspecao: z.string().optional(),
  palpacao: z.string().optional(),
  adm: z.string().optional(),
  forcaMuscular: z.string().optional(),
  testesEspeciais: z.string().optional(),
  diagnostico: z.string().optional(),
  objetivosCurto: z.string().optional(),
  objetivosMedio: z.string().optional(),
  objetivosLongo: z.string().optional(),
  condutas: z.string().optional(),
  tecnicas: z.string().optional(),
  exercicios: z.string().optional(),
  orientacoes: z.string().optional(),
  frequencia: z.string().optional(),
  sessoes: z.array(z.any()).optional(),
});

export type Prontuario = z.infer<typeof ProntuarioSchema>;
```

**src/schemas/agendamento.schema.ts**
```typescript
import { z } from 'zod';

export const AgendamentoSchema = z.object({
  id: z.number().int().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  type: z.string().min(1),
  paciente: z.any(),
  patientId: z.number().int().positive(),
  prontuario: z.any().optional(),
});

export type Agendamento = z.infer<typeof AgendamentoSchema>;
```

**src/schemas/sessao.schema.ts**
```typescript
import { z } from 'zod';

export const SessaoSchema = z.object({
  id: z.number().int().optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  horario: z.string().regex(/^\d{2}:\d{2}$/),
  procedimentos: z.string().optional(),
  evolucao: z.string().optional(),
  valor: z.string().optional(),
  pagamento: z.string().optional(),
});

export type Sessao = z.infer<typeof SessaoSchema>;
```

#### Integração em ProntuarioForm

**src/components/ProntuarioForm.tsx (atualizado)**
```typescript
import { ProntuarioSchema } from '@/schemas/prontuario.schema';
import { ZodError } from 'zod';

export function ProntuarioForm({ paciente, onBack, onSave, prontuario }: ProntuarioFormProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({ /* ... */ });

  const handleSave = async () => {
    try {
      // Validar dados
      const validatedData = ProntuarioSchema.parse(formData);
      
      // Limpar erros anteriores
      setErrors({});
      
      // Salvar
      await onSave(validatedData);
    } catch (error) {
      if (error instanceof ZodError) {
        // Mapear erros Zod para campo
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          const path = err.path.join('.');
          fieldErrors[path] = err.message;
        });
        setErrors(fieldErrors);
      } else {
        console.error('Erro ao salvar:', error);
      }
    }
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  return (
    <div>
      {/* ... formulário ... */}
      <input
        type="text"
        value={formData.nomeCompleto}
        onChange={(e) => handleChange('nomeCompleto', e.target.value)}
        className={getFieldError('nomeCompleto') ? 'border-red-500' : 'border-app-border'}
      />
      {getFieldError('nomeCompleto') && (
        <span className="text-red-500 text-sm">{getFieldError('nomeCompleto')}</span>
      )}
      
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
}
```

#### Checklist
- [ ] Todos os schemas criados em `src/schemas/`
- [ ] ProntuarioForm valida com Zod antes de salvar
- [ ] Mensagens de erro exibidas ao usuário
- [ ] API valida schemas também (backend)
- [ ] Sem compilação erros TS

#### Impacto
- ✅ Dados garantidamente válidos
- ✅ Melhor UX com mensagens de erro
- ✅ Integração mais segura com backend

---

### Task #5: Componentes Loading & Error 🎨

**Status:** `not-started`  
**Prioridade:** 🟡 Média  
**Duração:** 1-2 dias  
**Dependência:** Task #2

#### Justificativa
- Feedback visual durante requisições
- Melhor tratamento de erros
- UX mais profissional

#### Componentes a Criar

**src/components/common/LoadingSpinner.tsx**
```typescript
interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

export function LoadingSpinner({ size = 'md', message }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }[size];

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`${sizeClass} border-4 border-app-border border-t-app-primary rounded-full animate-spin`} />
      {message && <p className="text-app-text">{message}</p>}
    </div>
  );
}
```

**src/components/common/ErrorAlert.tsx**
```typescript
interface ErrorAlertProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export function ErrorAlert({ title = 'Erro', message, onDismiss, onRetry }: ErrorAlertProps) {
  return (
    <div className="bg-red-900/20 border border-red-700 rounded p-4">
      <h3 className="text-red-400 font-semibold mb-1">{title}</h3>
      <p className="text-red-300 text-sm mb-3">{message}</p>
      <div className="flex gap-2">
        {onRetry && (
          <button 
            onClick={onRetry}
            className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
          >
            Tentar Novamente
          </button>
        )}
        {onDismiss && (
          <button 
            onClick={onDismiss}
            className="text-red-400 hover:text-red-300 px-3 py-1 text-sm"
          >
            Descartar
          </button>
        )}
      </div>
    </div>
  );
}
```

**src/components/common/SkeletonLoader.tsx**
```typescript
interface SkeletonLoaderProps {
  rows?: number;
  height?: string;
}

export function SkeletonLoader({ rows = 3, height = 'h-4' }: SkeletonLoaderProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`${height} bg-gradient-to-r from-app-surface via-app-border to-app-surface rounded animate-pulse`}
        />
      ))}
    </div>
  );
}
```

#### Uso nos Componentes

**Exemplo em AgendaView.tsx:**
```typescript
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ErrorAlert } from '@/components/common/ErrorAlert';

export function AgendaView() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { appointments, fetchAppointments } = useAppContext();

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchAppointments();
      } catch (err) {
        setError('Erro ao carregar agendamentos');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [fetchAppointments]);

  if (loading) return <LoadingSpinner message="Carregando agendamentos..." />;
  if (error) return <ErrorAlert message={error} onRetry={() => location.reload()} />;

  return (
    // ... componente
  );
}
```

#### Checklist
- [ ] LoadingSpinner criado e reutilizável
- [ ] ErrorAlert criado com retry capability
- [ ] SkeletonLoader criado
- [ ] Componentes integrados em views
- [ ] Estados de loading/error testados

#### Impacto
- ✅ UX mais profissional
- ✅ Feedback claro ao usuário
- ✅ Melhor tratamento de erros

---

## 📋 FASE 3: Acessibilidade & Experiência
**Duração:** 1 semana  
**Objetivo:** Melhorar experiência de todos os usuários

---

### Task #6: ARIA Labels & Acessibilidade ♿

**Status:** `not-started`  
**Prioridade:** 🟡 Média  
**Duração:** 2-3 dias  
**Dependência:** Task #2

#### Justificativa
- Compatibilidade com screen readers
- Conformidade WCAG 2.1 AA
- Usuários com deficiência incluídos

#### Checklist ARIA

1. **Botões**
```typescript
<button 
  onClick={() => setShowModal(true)}
  aria-label="Adicionar novo agendamento"
>
  <PlusIcon />
</button>
```

2. **Inputs com Label**
```typescript
<label htmlFor="nome-input">Nome Completo</label>
<input 
  id="nome-input"
  type="text"
  aria-label="Nome Completo do Paciente"
  aria-required="true"
/>
```

3. **Descrição de Formulário**
```typescript
<div>
  <input 
    type="email"
    aria-label="Email"
    aria-describedby="email-hint"
  />
  <span id="email-hint" className="text-sm text-app-text/70">
    Use um email válido para contato
  </span>
</div>
```

4. **Modais**
```typescript
<div 
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
  aria-hidden={!isOpen}
>
  <h2 id="modal-title">Novo Agendamento</h2>
  {/* ... conteúdo ... */}
</div>
```

5. **Loadings**
```typescript
<div 
  role="status"
  aria-live="polite"
  aria-label="Carregando dados"
>
  <LoadingSpinner />
</div>
```

#### Arquivos a Atualizar

| Arquivo | Mudanças |
|---------|----------|
| [src/components/ProntuarioForm.tsx](src/components/ProntuarioForm.tsx) | Adicionar aria-label em campos |
| [src/components/layout/Sidebar.tsx](src/components/layout/Sidebar.tsx) | Adicionar aria-label em botões |
| [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx) | Adicionar aria-label em ícones |
| [src/components/views/AgendaView.tsx](src/components/views/AgendaView.tsx) | Adicionar role/aria em tabelas |
| [src/components/modals/AddAppointmentModal.tsx](src/components/modals/AddAppointmentModal.tsx) | Adicionar role="dialog" |

#### Testes de Acessibilidade

```bash
# Instalar Axe DevTools (browser extension)
# https://www.deque.com/axe/devtools/

# Ou usar axe-core via npm
npm install --save-dev @axe-core/react
```

#### Checklist
- [ ] Todos os botões têm `aria-label`
- [ ] Inputs estão associados a labels (via `htmlFor`/`id`)
- [ ] Modais têm `role="dialog"` e `aria-modal="true"`
- [ ] Loadings têm `role="status"` e `aria-live="polite"`
- [ ] Testes de acessibilidade passaram (Axe)
- [ ] Navegação com Tab funciona corretamente
- [ ] Contraste de cores WCAG AA validado

#### Impacto
- ✅ Compatível com screen readers
- ✅ Conformidade WCAG 2.1 AA
- ✅ Inclusão de usuários com deficiências

---

## 📋 FASE 4: Testes & Performance
**Duração:** 2-3 semanas  
**Objetivo:** Garantir qualidade e velocidade

---

### Task #7: Testes Automatizados 🧪

**Status:** `not-started`  
**Prioridade:** 🟡 Média  
**Duração:** 3-5 dias  
**Dependência:** Task #2, #4

#### Setup Inicial

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event jest @types/jest @testing-library/user-event
npx jest --init
```

#### Configuração Jest

**jest.config.js**
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testMatch: [
    '**/__tests__/**/*.test.ts?(x)',
    '**/?(*.)+(spec|test).ts?(x)',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
  ],
}

module.exports = createJestConfig(customJestConfig)
```

**jest.setup.js**
```javascript
import '@testing-library/jest-dom'
```

#### Testes a Implementar

**src/__tests__/ProntuarioForm.test.tsx**
```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProntuarioForm } from '@/components/ProntuarioForm';
import { Paciente } from '@/components/Paciente';

describe('ProntuarioForm', () => {
  const mockPaciente: Paciente = {
    id: 1,
    nome: 'Test Patient',
    cpf: '123.456.789-00',
    telefone: '(11) 99999-9999',
    prontuario: undefined,
  };

  it('should render form with all fields', () => {
    const mockOnSave = jest.fn();
    const mockOnBack = jest.fn();

    render(
      <ProntuarioForm 
        paciente={mockPaciente} 
        onSave={mockOnSave}
        onBack={mockOnBack}
        prontuario={undefined}
      />
    );

    expect(screen.getByLabelText(/nome completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/data de nascimento/i)).toBeInTheDocument();
    expect(screen.getByText(/salvar/i)).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    const mockOnSave = jest.fn();
    const mockOnBack = jest.fn();

    render(
      <ProntuarioForm 
        paciente={mockPaciente} 
        onSave={mockOnSave}
        onBack={mockOnBack}
        prontuario={undefined}
      />
    );

    const submitButton = screen.getByText(/salvar/i);
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/obrigatório/i)).toBeInTheDocument();
    });

    expect(mockOnSave).not.toHaveBeenCalled();
  });

  it('should call onSave with valid data', async () => {
    const mockOnSave = jest.fn();
    const mockOnBack = jest.fn();
    const user = userEvent.setup();

    render(
      <ProntuarioForm 
        paciente={mockPaciente} 
        onSave={mockOnSave}
        onBack={mockOnBack}
        prontuario={undefined}
      />
    );

    await user.type(screen.getByLabelText(/nome completo/i), 'Test Patient');
    fireEvent.click(screen.getByText(/salvar/i));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled();
    });
  });

  it('should handle add session button', async () => {
    const mockOnSave = jest.fn();
    const mockOnBack = jest.fn();

    render(
      <ProntuarioForm 
        paciente={mockPaciente} 
        onSave={mockOnSave}
        onBack={mockOnBack}
        prontuario={undefined}
      />
    );

    const addSessionButton = screen.getByRole('button', { name: /adicionar sessão/i });
    fireEvent.click(addSessionButton);

    await waitFor(() => {
      expect(screen.getAllByLabelText(/data da sessão/i).length).toBeGreaterThan(0);
    });
  });
});
```

**src/__tests__/schemas/prontuario.schema.test.ts**
```typescript
import { ProntuarioSchema } from '@/schemas/prontuario.schema';
import { ZodError } from 'zod';

describe('ProntuarioSchema', () => {
  it('should validate valid prontuario data', () => {
    const validData = {
      id: 1,
      nomeCompleto: 'John Doe',
      dataNascimento: '1990-01-01',
      sexo: 'M',
      queixaPrincipal: 'Dor nas costas há 2 semanas',
      frequencia: 'Duas vezes por semana',
      sessoes: [],
    };

    expect(() => ProntuarioSchema.parse(validData)).not.toThrow();
  });

  it('should reject invalid sexo value', () => {
    const invalidData = {
      nomeCompleto: 'John Doe',
      dataNascimento: '1990-01-01',
      sexo: 'X',
      queixaPrincipal: 'Dor nas costas',
    };

    expect(() => ProntuarioSchema.parse(invalidData)).toThrow(ZodError);
  });

  it('should require queixaPrincipal', () => {
    const invalidData = {
      nomeCompleto: 'John Doe',
      dataNascimento: '1990-01-01',
      sexo: 'M',
      queixaPrincipal: 'A',
    };

    expect(() => ProntuarioSchema.parse(invalidData)).toThrow(ZodError);
  });
});
```

#### Scripts NPM

Adicionar a `package.json`:
```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

#### Coverage Target

```
Statements   : >= 80%
Branches     : >= 75%
Functions    : >= 80%
Lines        : >= 80%
```

#### Checklist
- [ ] Jest configurado
- [ ] Testes para ProntuarioForm
- [ ] Testes para Schemas
- [ ] Testes para Contexto
- [ ] Coverage >= 80%
- [ ] CI/CD integrado (GitHub Actions)

#### Impacto
- ✅ Confiança em refatorações
- ✅ Menos regressões
- ✅ Documentação viva

---

### Task #8: Otimizações de Performance ⚡

**Status:** `not-started`  
**Prioridade:** 🟡 Média  
**Duração:** 2-3 dias  
**Dependência:** Task #2

#### 1. Code Splitting

**src/components/LazyViews.tsx**
```typescript
import dynamic from 'next/dynamic';

export const LazyAgendaView = dynamic(
  () => import('@/components/views/AgendaView').then(mod => ({ default: mod.AgendaView })),
  { 
    loading: () => <LoadingSpinner message="Carregando agenda..." />,
    ssr: false, // Client-side only
  }
);

export const LazyPacientesView = dynamic(
  () => import('@/components/views/PacientesView').then(mod => ({ default: mod.PacientesView })),
  { 
    loading: () => <LoadingSpinner message="Carregando pacientes..." />,
    ssr: false,
  }
);

export const LazyProntuariosView = dynamic(
  () => import('@/components/views/ProntuariosView').then(mod => ({ default: mod.ProntuariosView })),
  { 
    loading: () => <LoadingSpinner message="Carregando prontuários..." />,
    ssr: false,
  }
);
```

**Usage em page.tsx:**
```typescript
import { LazyAgendaView, LazyPacientesView, LazyProntuariosView } from '@/components/LazyViews';

export default function FisioManager() {
  const { currentView } = useAppContext();

  return (
    <>
      {currentView === 'agenda' && <LazyAgendaView />}
      {currentView === 'pacientes' && <LazyPacientesView />}
      {currentView === 'prontuarios' && <LazyProntuariosView />}
    </>
  );
}
```

#### 2. Memoization

**Componentes que não mudam frequentemente:**
```typescript
import React, { memo } from 'react';

export const Sidebar = memo(({ isOpen, onClose }: SidebarProps) => {
  return (
    // ... JSX
  );
}, (prevProps, nextProps) => {
  return prevProps.isOpen === nextProps.isOpen;
});
```

#### 3. useMemo & useCallback

**src/contexts/AppContext.tsx (otimizado)**
```typescript
import { useMemo, useCallback } from 'react';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // ... states ...

  // Memoizar lista filtrada
  const filteredPatients = useMemo(
    () => patients.filter(p => 
      p.nome.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [patients, searchQuery]
  );

  // Memoizar callbacks
  const handleAddAppointment = useCallback(async (appointment: Appointment) => {
    // ... implementation
  }, []);

  const value = useMemo(() => ({
    // ... context value
  }), [filteredPatients, handleAddAppointment /* ... */]);

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}
```

#### 4. Lazy Media Imports

Se houver imagens/assets:
```typescript
import Image from 'next/image';

<Image
  src="/logo.png"
  alt="FisioManager Logo"
  width={200}
  height={60}
  priority={true} // Apenas para acima da fold
/>
```

#### 5. Bundle Analysis

```bash
npm install --save-dev @next/bundle-analyzer

# .env.local
ANALYZE=true npm run build
```

#### Teste de Performance

```bash
npm run build
npm run start

# Lighthouse audit
# Chrome DevTools → Lighthouse
```

#### Checklist
- [ ] Code splitting implementado (views lazy-loaded)
- [ ] Componentes memoizados apropriadamente
- [ ] useMemo/useCallback usado em contexto
- [ ] Lighthouse score >= 90
- [ ] Bundle size otimizado (< 100KB JS)
- [ ] Network requests minimizados

#### Impacto
- ✅ Carregamento mais rápido (FCP, LCP)
- ✅ Menos memory usage
- ✅ Melhor UX em conexões lentas

---

## 📅 Timeline de Execução

### Semana 1-2: FASE 1 (Fundação)
- **Days 1-2:** Task #1 (TypeScript strict)
- **Days 3-6:** Task #2 (Refatorar componentes)
- **Days 7-10:** Task #3 (Context API)

### Semana 3-4: FASE 2 (Validação)
- **Days 1-3:** Task #4 (Zod validation)
- **Days 4-5:** Task #5 (Loading/Error components)

### Semana 5: FASE 3 (Acessibilidade)
- **Days 1-3:** Task #6 (ARIA labels)

### Semana 6-8: FASE 4 (Testes & Performance)
- **Days 1-5:** Task #7 (Jest tests)
- **Days 6-7:** Task #8 (Performance optimization)

**Total: 8 semanas (~2 meses)**

---

## 🎯 Métricas de Sucesso

| Métrica | Antes | Alvo | Status |
|---------|-------|------|--------|
| TypeScript Errors | 50+ | 0 | ⬜ |
| Type Coverage | 30% | 100% | ⬜ |
| page.tsx Lines | 458 | <150 | ⬜ |
| Test Coverage | 0% | 80%+ | ⬜ |
| Lighthouse Score | TBD | 90+ | ⬜ |
| Bundle Size | TBD | <100KB | ⬜ |
| WCAG Compliance | None | AA | ⬜ |
| Performance (FCP) | TBD | <2s | ⬜ |

---

## 🚀 Próximos Passos

1. **Hoje:** Revisar este plano
2. **Amanhã:** Começar Task #1 (TypeScript strict)
3. **Semana 1:** Completar FASE 1
4. **Semana 2:** Completar FASE 2
5. **Semana 3+:** Completar FASES 3 e 4

---

## 📞 Contato & Suporte

Dúvidas sobre o plano? Verifique:
- [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) - Análise detalhada
- [README.md](README.md) - Documentação do projeto
- Commit messages com contexto

---

**Atualizado em:** 18 de fevereiro de 2026  
**Versão:** 1.0 (Planning)  
**Próxima revisão:** Após Task #1
