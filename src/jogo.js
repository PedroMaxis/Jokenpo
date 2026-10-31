/* Regras e inteligência do jogo, sem nada de tela: tudo aqui é testável com números na mão. */

export const GESTOS = ["Pedra", "Papel", "Tesoura"];

// quem derrota quem, e o verbo que conta a história
const VENCE = { Pedra: "Tesoura", Papel: "Pedra", Tesoura: "Papel" };
const VERBO = { Pedra: "amassa", Papel: "embrulha", Tesoura: "corta" };

/** Resultado do ponto de vista de `a`: "vitoria", "derrota" ou "empate" */
export function resultado(a, b) {
  if (!GESTOS.includes(a) || !GESTOS.includes(b)) throw new Error(`Gesto inválido: ${a} × ${b}`);
  if (a === b) return "empate";
  return VENCE[a] === b ? "vitoria" : "derrota";
}

/** Quem ganha de `g` (o gesto que o derrota) */
export const queVence = (g) => GESTOS.find((x) => VENCE[x] === g);

/** "Pedra amassa tesoura." / "Empate: os dois jogaram papel." */
export function frase(a, b) {
  const r = resultado(a, b);
  if (r === "empate") return `Empate: os dois jogaram ${a.toLowerCase()}.`;
  const [ganha, perde] = r === "vitoria" ? [a, b] : [b, a];
  return `${ganha} ${VERBO[ganha]} ${perde.toLowerCase()}.`;
}

/* ---------- adversários ---------- */

const sorteia = (rng) => GESTOS[Math.floor(rng() * GESTOS.length)];

/**
 * Sensei: lê o que a pessoa jogou antes e aposta no próximo gesto dela.
 *  1. olha o que ela costuma jogar depois do último gesto (cadeia de Markov de ordem 1);
 *  2. sem dados suficientes, usa o gesto que ela mais joga;
 *  3. joga o que vence o gesto previsto. Em 15% das vezes sorteia, para não ser previsível.
 * Contra quem joga ao acaso, ninguém ganha na média: o Sensei só aproveita padrões de verdade.
 */
export function sensei(historicoDoJogador, rng = Math.random) {
  if (historicoDoJogador.length < 3 || rng() < 0.15) return sorteia(rng);
  const ultimo = historicoDoJogador.at(-1);
  const depois = Object.fromEntries(GESTOS.map((g) => [g, 0]));
  for (let i = 0; i < historicoDoJogador.length - 1; i++) if (historicoDoJogador[i] === ultimo) depois[historicoDoJogador[i + 1]]++;
  let alvo = GESTOS.reduce((m, g) => (depois[g] > depois[m] ? g : m), GESTOS[0]);
  if (depois[alvo] === 0) {
    const freq = Object.fromEntries(GESTOS.map((g) => [g, historicoDoJogador.filter((x) => x === g).length]));
    alvo = GESTOS.reduce((m, g) => (freq[g] > freq[m] ? g : m), GESTOS[0]);
  }
  return queVence(alvo);
}

export const MODOS = {
  maquina: { nome: "Máquina", descricao: "Joga ao acaso" },
  sensei: { nome: "Sensei", descricao: "Aprende o seu jeito de jogar" },
  dois: { nome: "2 jogadores", descricao: "No mesmo aparelho, sem espiar" },
};

export function escolhaDoAdversario(modo, historicoDoJogador, rng = Math.random) {
  return modo === "sensei" ? sensei(historicoDoJogador, rng) : sorteia(rng);
}

/* ---------- partida (melhor de N) ---------- */

export const FORMATOS = [{ valor: 0, nome: "Livre" }, { valor: 3, nome: "Melhor de 3" }, { valor: 5, nome: "Melhor de 5" }, { valor: 7, nome: "Melhor de 7" }];

/** Pontos necessários para vencer a partida (null se for livre) */
export const pontosParaVencer = (melhorDe) => (melhorDe ? Math.ceil(melhorDe / 2) : null);

/** "A" ou "B" se a partida já foi decidida; null se continua */
export function vencedorDaPartida(placar, melhorDe) {
  const alvo = pontosParaVencer(melhorDe);
  if (!alvo) return null;
  if (placar.a >= alvo) return "A";
  if (placar.b >= alvo) return "B";
  return null;
}

export const placarVazio = () => ({ a: 0, b: 0, empates: 0 });

export function somarPonto(placar, res) {
  if (res === "vitoria") return { ...placar, a: placar.a + 1 };
  if (res === "derrota") return { ...placar, b: placar.b + 1 };
  return { ...placar, empates: placar.empates + 1 };
}

/* ---------- estatísticas de longo prazo ---------- */

export const estatisticasVazias = () => ({ vitorias: 0, derrotas: 0, empates: 0, melhorSequencia: 0, partidasGanhas: 0, partidasPerdidas: 0, gestos: { Pedra: 0, Papel: 0, Tesoura: 0 } });

/** Soma uma rodada às estatísticas; `sequenciaAtual` é a sequência de vitórias já incluindo esta rodada */
export function registrarRodada(stats, escolhaDaPessoa, res, sequenciaAtual) {
  return {
    ...stats,
    vitorias: stats.vitorias + (res === "vitoria" ? 1 : 0),
    derrotas: stats.derrotas + (res === "derrota" ? 1 : 0),
    empates: stats.empates + (res === "empate" ? 1 : 0),
    melhorSequencia: Math.max(stats.melhorSequencia, sequenciaAtual),
    gestos: { ...stats.gestos, [escolhaDaPessoa]: stats.gestos[escolhaDaPessoa] + 1 },
  };
}

export const totalDeRodadas = (s) => s.vitorias + s.derrotas + s.empates;
/** Porcentagem de vitórias entre as rodadas jogadas (0 se ainda não jogou) */
export const aproveitamento = (s) => (totalDeRodadas(s) ? Math.round((s.vitorias / totalDeRodadas(s)) * 100) : 0);
