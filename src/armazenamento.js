// localStorage com rede de proteção: modo privado, cota cheia ou dado corrompido nunca derrubam o jogo
export function carregar(chave, padrao) {
  try {
    const bruto = localStorage.getItem(chave);
    if (bruto === null) return padrao;
    const valor = JSON.parse(bruto);
    // mantém só campos conhecidos e do tipo certo, para um dado antigo/estranho não quebrar a tela
    return typeof padrao === "object" && padrao !== null ? mesclar(padrao, valor) : typeof valor === typeof padrao ? valor : padrao;
  } catch { return padrao; }
}
export function salvar(chave, valor) {
  try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* sem storage */ }
}
export function mesclar(padrao, valor) {
  if (typeof valor !== "object" || valor === null || Array.isArray(valor) !== Array.isArray(padrao)) return padrao;
  const saida = { ...padrao };
  for (const k of Object.keys(padrao)) {
    if (typeof padrao[k] === "object" && padrao[k] !== null) saida[k] = mesclar(padrao[k], valor[k]);
    else if (typeof valor[k] === typeof padrao[k] && (typeof valor[k] !== "number" || Number.isFinite(valor[k]))) saida[k] = valor[k];
  }
  return saida;
}
