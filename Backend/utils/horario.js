import { ABERTURA, FECHAMENTO, INTERVALO_MINUTOS } from "../config/funcionamento.js";

const MS_POR_MINUTO = 60 * 1000;

export function calcularFim(inicio, duracaoMinutos) {
  const duracaoEmMs = duracaoMinutos * MS_POR_MINUTO;
  return new Date(inicio.getTime() + duracaoEmMs);
}

export function conflita(inicioA, fimA, inicioB, fimB) {
     return inicioA < fimB && inicioB < fimA;
}


export function gerarCandidatos(data, duracaoMinutos) {
  const abertura = new Date(`${data}T${ABERTURA}:00`);
  const fechamento = new Date(`${data}T${FECHAMENTO}:00`);

  const candidatos = [];
  let atual = abertura;

  while (calcularFim(atual, duracaoMinutos) <= fechamento) {
    candidatos.push(atual);
    atual = calcularFim(atual, INTERVALO_MINUTOS);
  }

  return candidatos;
}