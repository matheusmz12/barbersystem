const MS_POR_MINUTO = 60 * 1000;

export function calcularFim(inicio, duracaoMinutos) {
  const duracaoEmMs = duracaoMinutos * MS_POR_MINUTO;
  return new Date(inicio.getTime() + duracaoEmMs);
}

export function conflita(inicioA, fimA, inicioB, fimB) {
     return inicioA < fimB && inicioB < fimA;
}
