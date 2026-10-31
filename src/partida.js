import { frase, placarVazio, resultado, somarPonto, vencedorDaPartida } from "./jogo";

/** Estado da partida como máquina de fases: escolha → (j2) → contagem → revelado → … → fim.
 *  O reducer é puro: quem sorteia o gesto do adversário é o chamador, e a animação só avisa "REVELAR" quando termina. */
export const estadoInicial = (modo = "maquina", melhorDe = 0) => ({
  modo, melhorDe, placar: placarVazio(), historico: [], fase: "escolha",
  escolhaA: null, escolhaB: null, ultimo: null, sequencia: 0, rodada: 0, vencedor: null,
});

export function reduzir(s, acao) {
  switch (acao.tipo) {
    case "CONFIGURAR":
      return estadoInicial(acao.modo ?? s.modo, acao.melhorDe ?? s.melhorDe);

    case "ESCOLHER": {
      if (s.fase === "escolha") {
        if (s.modo === "dois") return { ...s, escolhaA: acao.gesto, fase: "j2" }; // o gesto do jogador 1 fica escondido
        return { ...s, escolhaA: acao.gesto, escolhaB: acao.adversario, fase: "contagem", rodada: s.rodada + 1 };
      }
      if (s.fase === "j2") return { ...s, escolhaB: acao.gesto, fase: "contagem", rodada: s.rodada + 1 };
      return s;
    }

    case "REVELAR": {
      if (s.fase !== "contagem") return s;
      const res = resultado(s.escolhaA, s.escolhaB);
      const placar = somarPonto(s.placar, res);
      const vencedor = vencedorDaPartida(placar, s.melhorDe);
      return {
        ...s, placar, vencedor, fase: vencedor ? "fim" : "revelado",
        sequencia: res === "vitoria" ? s.sequencia + 1 : 0,
        historico: [...s.historico, { a: s.escolhaA, b: s.escolhaB, res }],
        ultimo: { a: s.escolhaA, b: s.escolhaB, res, frase: frase(s.escolhaA, s.escolhaB) },
      };
    }

    case "PROXIMA":
      return s.fase === "revelado" ? { ...s, fase: "escolha", escolhaA: null, escolhaB: null } : s;

    case "NOVA_PARTIDA":
      return { ...s, placar: placarVazio(), fase: "escolha", escolhaA: null, escolhaB: null, ultimo: null, sequencia: 0, vencedor: null };

    default:
      return s;
  }
}

/** O que a pessoa (lado A) já jogou, na ordem: alimenta o Sensei */
export const historicoDoJogador = (s) => s.historico.map((h) => h.a);
