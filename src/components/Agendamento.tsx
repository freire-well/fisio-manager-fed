import { Paciente } from "./Paciente";

export class Agendamento {
  id?: number;
  date?: string;
  time?: string;
  type?: string;
  paciente?: Paciente;

  constructor(
    id?: number,
    date?: string,
    time?: string,
    type?: string,
    paciente?: Paciente
  ) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.type = type;
    this.paciente = paciente;
  }
}
