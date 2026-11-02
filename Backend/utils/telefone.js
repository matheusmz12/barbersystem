export function normalizarTelefone(telefone) {
  if (typeof telefone !== "string") {
    return null; // Retorna null se o telefone não for uma string
  }

  // Remove espaços em branco e caracteres não numéricos
  const telefoneLimpo = telefone.replace(/\D/g, "");

  if (telefoneLimpo.length < 10 || telefoneLimpo.length > 11) {
    return null; // Retorna null se o telefone não tiver 10 ou 11 dígitos
  }

  return telefoneLimpo; // Retorna o telefone limpo (apenas números)
}
