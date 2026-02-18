// src/components/ProntuarioForm.tsx
import React, { useState } from 'react';
import { BackIcon, PrintIcon, PlusIcon } from './Icons'; 
import { Paciente } from './Paciente';
import { Prontuario } from './Prontuario';

interface ProntuarioFormProps {
    paciente: Paciente;
    prontuario?: Prontuario; 
    onBack: () => void;
    onSave: (data: any) => void;
}

export function ProntuarioForm({ paciente, onBack, onSave, prontuario }: ProntuarioFormProps) {

    const [formData, setFormData] = useState({
        patientId: paciente.id || 0,
        id: prontuario?.id,
        nomeCompleto: prontuario?.nomeCompleto || paciente.nome || '',
            dataNascimento: prontuario?.dataNascimento,
            idade: prontuario?.idade || '',
            sexo: prontuario?.sexo || '',
            profissao: prontuario?.profissao || '',
            telefone: prontuario?.telefone || '',
            endereco: prontuario?.endereco || '',
            antecedentes: prontuario?.antecedentes || '',
            medicamentos: prontuario?.medicamentos || '',
            cirurgias: prontuario?.cirurgias || '',
            queixaPrincipal: prontuario?.queixaPrincipal || '',
            inicioSintomas: prontuario?.inicioSintomas || '',
            fatoresAgravantes: prontuario?.fatoresAgravantes || '',
            fatoresAtenuantes: prontuario?.fatoresAtenuantes || '',
            inspecao: prontuario?.inspecao || '',
            palpacao: prontuario?.palpacao || '',
            adm: prontuario?.adm || '',
            forcaMuscular: prontuario?.forcaMuscular || '',
            testesEspeciais: prontuario?.testesEspeciais || '',
            diagnostico: prontuario?.diagnostico || '',
            objetivosCurto: prontuario?.objetivosCurto || '',
            objetivosMedio: prontuario?.objetivosMedio || '',
            objetivosLongo: prontuario?.objetivosLongo || '',
            condutas: prontuario?.condutas || '',
            tecnicas: prontuario?.tecnicas || '',
            exercicios: prontuario?.exercicios || '',
            orientacoes: prontuario?.orientacoes || '',
            frequencia: prontuario?.frequencia || '',
            sessoes: prontuario?.sessoes || []
    });

    // Atualiza campo simples
    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addSession = () => {
    setFormData(prev => ({
        ...prev,
        sessoes: [...prev.sessoes, {
            data: '', // Default to current date, can be changed by user
            horario: '',
            valor: '',
            pagamento: '',
            procedimentos: '',
            evolucao: ''
        }]
    }));
    };

    const updateSession = (index: number, field: string, value: string) => {
        const newSessoes = [...formData.sessoes];
        newSessoes[index] = { ...newSessoes[index], [field]: value };
        setFormData(prev => ({ ...prev, sessoes: newSessoes }));
    };

    return (
        <div className="animate-in fade-in duration-300 pb-10">
            {/* Header / Toolbar */}
            <div className="flex items-center justify-between mb-6 no-print sticky top-0 bg-app-bg z-20 py-4 border-b border-app-border">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="bg-app-surface border border-app-border hover:border-app-primary text-app-text px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors"
                    >
                        <BackIcon />
                        Voltar
                    </button>
                    <h2 className="text-2xl font-bold">Prontuário - {paciente.nome}</h2>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => onSave(formData)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold transition-colors"
                    >
                        Salvar
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors"
                    >
                        <PrintIcon />
                        Imprimir
                    </button>
                </div>
            </div>

            <div id="printable-area" className="space-y-6">
                
                {/* 1. Dados e Histórico */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">1. Dados e Histórico</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold mb-2">Nome Completo</label>
                            <input
                                type="text"
                                value={formData.nomeCompleto}
                                onChange={(e) => handleChange('nomeCompleto', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Data de Nascimento</label>
                            <input
                                type="date"
                                value={formData.dataNascimento ? new Date(formData.dataNascimento).toISOString().split('T')[0] : ''}
                                onChange={(e) => handleChange('dataNascimento', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold mb-2">Idade</label>
                            <input
                                type="text"
                                value={formData.idade}
                                onChange={(e) => handleChange('idade', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Sexo</label>
                            <select
                                value={formData.sexo}
                                onChange={(e) => handleChange('sexo', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            >
                                <option value="">Selecione</option>
                                <option value="Masculino">Masculino</option>
                                <option value="Feminino">Feminino</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Profissão</label>
                            <input
                                type="text"
                                value={formData.profissao}
                                onChange={(e) => handleChange('profissao', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block font-semibold mb-2">Telefone</label>
                            <input
                                type="tel"
                                value={formData.telefone}
                                onChange={(e) => handleChange('telefone', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Endereço</label>
                            <input
                                type="text"
                                value={formData.endereco}
                                onChange={(e) => handleChange('endereco', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Antecedentes Pessoais e Familiares</label>
                            <textarea
                                value={formData.antecedentes}
                                onChange={(e) => handleChange('antecedentes', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Medicamentos em Uso</label>
                            <textarea
                                value={formData.medicamentos}
                                onChange={(e) => handleChange('medicamentos', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Cirurgias Prévias</label>
                            <textarea
                                value={formData.cirurgias}
                                onChange={(e) => handleChange('cirurgias', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 2. Sintomatologia */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">2. Sintomatologia</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Queixa Principal</label>
                            <textarea
                                value={formData.queixaPrincipal}
                                onChange={(e) => handleChange('queixaPrincipal', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Início dos Sintomas</label>
                            <input
                                type="text"
                                value={formData.inicioSintomas}
                                onChange={(e) => handleChange('inicioSintomas', e.target.value)}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Fatores Agravantes</label>
                            <textarea
                                value={formData.fatoresAgravantes}
                                onChange={(e) => handleChange('fatoresAgravantes', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Fatores Atenuantes</label>
                            <textarea
                                value={formData.fatoresAtenuantes}
                                onChange={(e) => handleChange('fatoresAtenuantes', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 3. Exame Físico */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">3. Exame Físico</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Inspeção</label>
                            <textarea
                                value={formData.inspecao}
                                onChange={(e) => handleChange('inspecao', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Palpação</label>
                            <textarea
                                value={formData.palpacao}
                                onChange={(e) => handleChange('palpacao', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Amplitude de Movimento (ADM)</label>
                            <textarea
                                value={formData.adm}
                                onChange={(e) => handleChange('adm', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Força Muscular</label>
                            <textarea
                                value={formData.forcaMuscular}
                                onChange={(e) => handleChange('forcaMuscular', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Testes Especiais</label>
                            <textarea
                                value={formData.testesEspeciais}
                                onChange={(e) => handleChange('testesEspeciais', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 4. Planejamento */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">4. Planejamento</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Diagnóstico Fisioterapêutico</label>
                            <textarea
                                value={formData.diagnostico}
                                onChange={(e) => handleChange('diagnostico', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Objetivos de Curto Prazo</label>
                            <textarea
                                value={formData.objetivosCurto}
                                onChange={(e) => handleChange('objetivosCurto', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Objetivos de Médio Prazo</label>
                            <textarea
                                value={formData.objetivosMedio}
                                onChange={(e) => handleChange('objetivosMedio', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Objetivos de Longo Prazo</label>
                            <textarea
                                value={formData.objetivosLongo}
                                onChange={(e) => handleChange('objetivosLongo', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Condutas Terapêuticas</label>
                            <textarea
                                value={formData.condutas}
                                onChange={(e) => handleChange('condutas', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 5. Recursos e Conduta */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">5. Recursos e Conduta</h3>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block font-semibold mb-2">Técnicas Aplicadas</label>
                            <textarea
                                value={formData.tecnicas}
                                onChange={(e) => handleChange('tecnicas', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Exercícios Prescritos</label>
                            <textarea
                                value={formData.exercicios}
                                onChange={(e) => handleChange('exercicios', e.target.value)}
                                rows={3}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Orientações ao Paciente</label>
                            <textarea
                                value={formData.orientacoes}
                                onChange={(e) => handleChange('orientacoes', e.target.value)}
                                rows={2}
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">Frequência das Sessões</label>
                            <input
                                type="text"
                                value={formData.frequencia}
                                onChange={(e) => handleChange('frequencia', e.target.value)}
                                placeholder="Ex: 2x por semana"
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* 6. Registro de Sessões (Tabela + Detalhes) */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">6. Registro de Sessões</h3>
                    
                    {/* Tabela de Sessões */}
                    <div className="overflow-x-auto mb-6">
                        <table className="w-full border border-app-border">
                            <thead className="bg-app-bg">
                                <tr>
                                    <th className="border border-app-border px-3 py-2 font-bold text-left min-w-[150px]">Data</th>
                                    <th className="border border-app-border px-3 py-2 font-bold text-left">Horário</th>
                                    <th className="border border-app-border px-3 py-2 font-bold text-left">Valor</th>
                                    <th className="border border-app-border px-3 py-2 font-bold text-left">Pagamento</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.sessoes.map((sessao, index) => (
                                    <tr key={index}>
                                        <td className="border border-app-border px-3 py-2">
                                            <input
                                                type="date"
                                                value={sessao.data ? new Date(sessao.data).toISOString().split('T')[0] : ''}
                                                onChange={(e) => updateSession(index, 'data', e.target.value)}
                                                className="w-full bg-app-bg border border-app-border rounded px-2 py-1 text-app-text focus:border-app-primary outline-none text-sm"
                                            />
                                        </td>
                                        <td className="border border-app-border px-3 py-2">
                                            <input
                                                type="time"
                                                value={sessao.horario}
                                                onChange={(e) => updateSession(index, 'horario', e.target.value)}
                                                className="w-full bg-app-bg border border-app-border rounded px-2 py-1 text-app-text focus:border-app-primary outline-none text-sm"
                                            />
                                        </td>
                                        <td className="border border-app-border px-3 py-2">
                                            <input
                                                type="text"
                                                value={sessao.valor}
                                                onChange={(e) => updateSession(index, 'valor', e.target.value)}
                                                placeholder="R$"
                                                className="w-full bg-app-bg border border-app-border rounded px-2 py-1 text-app-text focus:border-app-primary outline-none text-sm"
                                            />
                                        </td>
                                        <td className="border border-app-border px-3 py-2">
                                            <select
                                                value={sessao.pagamento}
                                                onChange={(e) => updateSession(index, 'pagamento', e.target.value)}
                                                className="w-full bg-app-bg border border-app-border rounded px-2 py-1 text-app-text focus:border-app-primary outline-none text-sm"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="Pago">Pago</option>
                                                <option value="Pendente">Pendente</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {formData.sessoes.length === 0 && (
                             <p className="text-center text-app-text/40 py-4">Nenhuma sessão registrada.</p>
                        )}
                    </div>

                    {/* Detalhes de Cada Sessão */}
                    <div className="space-y-4 mb-4">
                        {formData.sessoes.map((sessao, index) => (
                            <div key={index} className="border border-app-border rounded p-4 bg-app-bg">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-bold text-app-primary">
                                        Sessão {index + 1} - {sessao.data ? new Date(sessao.data).toLocaleDateString('pt-BR') : 'Data não informada'}
                                    </h4>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block font-semibold mb-2 text-sm">Procedimentos Realizados</label>
                                        <textarea
                                            value={sessao.procedimentos}
                                            onChange={(e) => updateSession(index, 'procedimentos', e.target.value)}
                                            rows={3}
                                            placeholder="Descreva os procedimentos realizados nesta sessão..."
                                            className="w-full bg-app-surface border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block font-semibold mb-2 text-sm">Evolução do Paciente</label>
                                        <textarea
                                            value={sessao.evolucao}
                                            onChange={(e) => updateSession(index, 'evolucao', e.target.value)}
                                            rows={3}
                                            placeholder="Descreva a evolução e resposta do paciente..."
                                            className="w-full bg-app-surface border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Botão de Adicionar Sessão */}
                    <button
                        onClick={addSession}
                        className="no-print bg-app-primary hover:bg-sky-600 text-white px-4 py-2 rounded font-semibold flex items-center gap-2 transition-colors"
                    >
                        <PlusIcon />
                        Adicionar Nova Sessão
                    </button>
                </section>

                {/* 7. Finalização */}
                <section className="bg-app-surface border border-app-border rounded p-6">
                    <h3 className="text-xl font-bold text-app-primary mb-4 border-b border-app-border pb-2">7. Finalização</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-semibold mb-2">Assinatura do Profissional</label>
                            <input
                                type="text"
                                value=''
                                onChange={(e) => handleChange('assinatura', e.target.value)}
                                placeholder="Nome completo"
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                        <div>
                            <label className="block font-semibold mb-2">CREFITO</label>
                            <input
                                type="text"
                                value=''
                                onChange={(e) => handleChange('crefito', e.target.value)}
                                placeholder="Ex: CREFITO-3/123456-F"
                                className="w-full bg-app-bg border border-app-border rounded px-4 py-2 text-app-text focus:border-app-primary outline-none"
                            />
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}