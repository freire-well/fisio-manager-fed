import { Paciente } from "./Paciente";

export class Agendamento {
  id: number;
  date: string;
  time: string;
  type: string;
  paciente: Paciente;
  paciente_id: number;

  constructor(
    id: number,
    date: string,
    time: string,
    type: string,
    paciente: Paciente,
    paciente_id: number
  ) {
    this.id = id;
    this.date = date;
    this.time = time;
    this.type = type;
    this.paciente = paciente;
    this.paciente_id = paciente_id;
  }
}
