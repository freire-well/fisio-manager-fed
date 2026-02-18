import { Sessoes } from "./Sessoes";

export class Prontuario {
  id?: number;
  nomeCompleto?: string;
  dataNascimento?: Date;
  idade?: string;
  sexo?: string;
  profissao?: string;
  telefone?: string;
  endereco?: string;
  antecedentes?: string;
  medicamentos?: string;
  cirurgias?: string;
  queixaPrincipal?: string;
  inicioSintomas?: string;
  fatoresAgravantes?: string;
  fatoresAtenuantes?: string;
  inspecao?: string;
  palpacao?: string;
  adm?: string;
  forcaMuscular?: string;
  testesEspeciais?: string;
  diagnostico?: string;
  objetivosCurto?: string;
  objetivosMedio?: string;
  objetivosLongo?: string;
  condutas?: string;
  tecnicas?: string;
  exercicios?: string;
  orientacoes?: string;
  frequencia?: string;
  sessoes: Sessoes[];

  constructor(
    id?: number,
    nomeCompleto?: string,
    dataNascimento?: Date,
    idade?: string,
    sexo?: string,
    profissao?: string,
    telefone?: string,
    endereco?: string,
    antecedentes?: string,
    medicamentos?: string,
    cirurgias?: string,
    queixaPrincipal?: string,
    inicioSintomas?: string,
    fatoresAgravantes?: string,
    fatoresAtenuantes?: string,
    inspecao?: string,
    palpacao?: string,
    adm?: string,
    forcaMuscular?: string,
    testesEspeciais?: string,
    diagnostico?: string,
    objetivosCurto?: string,
    objetivosMedio?: string,
    objetivosLongo?: string,
    condutas?: string,
    tecnicas?: string,
    exercicios?: string,
    orientacoes?: string,
    frequencia?: string,
    sessoes?: Sessoes[]
  ) {
    this.id = id;
    this.nomeCompleto = nomeCompleto;
    this.dataNascimento = dataNascimento;
    this.idade = idade;
    this.sexo = sexo;
    this.profissao = profissao;
    this.telefone = telefone;
    this.endereco = endereco;
    this.antecedentes = antecedentes;
    this.medicamentos = medicamentos;
    this.cirurgias = cirurgias;
    this.queixaPrincipal = queixaPrincipal;
    this.inicioSintomas = inicioSintomas;
    this.fatoresAgravantes = fatoresAgravantes;
    this.fatoresAtenuantes = fatoresAtenuantes;
    this.inspecao = inspecao;
    this.palpacao = palpacao;
    this.adm = adm;
    this.forcaMuscular = forcaMuscular;
    this.testesEspeciais = testesEspeciais;
    this.diagnostico = diagnostico;
    this.objetivosCurto = objetivosCurto;
    this.objetivosMedio = objetivosMedio;
    this.objetivosLongo = objetivosLongo;
    this.condutas = condutas;
    this.tecnicas = tecnicas;
    this.exercicios = exercicios;
    this.orientacoes = orientacoes;
    this.frequencia = frequencia;
    this.sessoes = sessoes || [];
  }
}
