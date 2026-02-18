import { Prontuario } from "./Prontuario";

export class Paciente {
  id: number;
  cpf: string;
  nome: string;
  telefone: string;
  prontuario?: Prontuario;

  constructor(
    id?: number,
    cpf?: string,
    nome?: string,
    telefone?: string,
    prontuario?: Prontuario
  ) {
    this.id = id ?? 0;
    this.cpf = cpf ?? '';
    this.nome = nome ?? '';
    this.telefone = telefone ?? '';
    this.prontuario = prontuario;
  }
}
