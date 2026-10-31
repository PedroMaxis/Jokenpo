import { describe, expect, it } from "vitest";
import {
  GESTOS, aproveitamento, escolhaDoAdversario, estatisticasVazias, frase, placarVazio, pontosParaVencer, queVence,
  registrarRodada, resultado, sensei, somarPonto, totalDeRodadas, vencedorDaPartida,
} from "./jogo";

// gerador pseudoaleatório com semente: os testes de IA dão sempre o mesmo resultado
function semente(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }

describe("regras", () => {
  it("cobre as 9 combinações", () => {
    const esperado = {
      "Pedra,Pedra": "empate", "Pedra,Papel": "derrota", "Pedra,Tesoura": "vitoria",
      "Papel,Pedra": "vitoria", "Papel,Papel": "empate", "Papel,Tesoura": "derrota",
      "Tesoura,Pedra": "derrota", "Tesoura,Papel": "vitoria", "Tesoura,Tesoura": "empate",
    };
    for (const a of GESTOS) for (const b of GESTOS) expect(resultado(a, b), `${a} × ${b}`).toBe(esperado[`${a},${b}`]);
  });
  it("é simétrico: se A vence B, B perde de A", () => {
    for (const a of GESTOS) for (const b of GESTOS) {
      const r = resultado(a, b), inverso = resultado(b, a);
      expect(inverso).toBe(r === "vitoria" ? "derrota" : r === "derrota" ? "vitoria" : "empate");
    }
  });
  it("recusa gesto inválido", () => { expect(() => resultado("Lagarto", "Pedra")).toThrow(); });
  it("queVence devolve quem derrota o gesto", () => {
    expect(queVence("Pedra")).toBe("Papel"); expect(queVence("Papel")).toBe("Tesoura"); expect(queVence("Tesoura")).toBe("Pedra");
  });
  it("conta a história de cada jogada", () => {
    expect(frase("Pedra", "Tesoura")).toBe("Pedra amassa tesoura.");
    expect(frase("Tesoura", "Pedra")).toBe("Pedra amassa tesoura.");
    expect(frase("Papel", "Pedra")).toBe("Papel embrulha pedra.");
    expect(frase("Tesoura", "Papel")).toBe("Tesoura corta papel.");
    expect(frase("Papel", "Papel")).toBe("Empate: os dois jogaram papel.");
  });
});

describe("partida", () => {
  it("quantos pontos decidem cada formato", () => {
    expect([0, 3, 5, 7].map(pontosParaVencer)).toEqual([null, 2, 3, 4]);
  });
  it("só decide quando alguém chega ao alvo; empates não contam", () => {
    let p = placarVazio();
    for (const r of ["vitoria", "empate", "empate", "derrota"]) p = somarPonto(p, r);
    expect(p).toEqual({ a: 1, b: 1, empates: 2 });
    expect(vencedorDaPartida(p, 3)).toBeNull();
    expect(vencedorDaPartida(somarPonto(p, "vitoria"), 3)).toBe("A");
    expect(vencedorDaPartida(somarPonto(p, "derrota"), 3)).toBe("B");
  });
  it("partida livre nunca termina", () => { expect(vencedorDaPartida({ a: 99, b: 0, empates: 0 }, 0)).toBeNull(); });
  it("somarPonto não altera o placar original", () => {
    const p = placarVazio(); somarPonto(p, "vitoria"); expect(p).toEqual({ a: 0, b: 0, empates: 0 });
  });
});

describe("estatísticas", () => {
  it("soma rodadas, melhor sequência e gestos", () => {
    let s = estatisticasVazias();
    s = registrarRodada(s, "Pedra", "vitoria", 1);
    s = registrarRodada(s, "Pedra", "vitoria", 2);
    s = registrarRodada(s, "Papel", "derrota", 0);
    s = registrarRodada(s, "Tesoura", "empate", 0);
    expect(s).toMatchObject({ vitorias: 2, derrotas: 1, empates: 1, melhorSequencia: 2, gestos: { Pedra: 2, Papel: 1, Tesoura: 1 } });
    expect(totalDeRodadas(s)).toBe(4);
    expect(aproveitamento(s)).toBe(50);
  });
  it("aproveitamento é 0 sem rodadas (nada de divisão por zero)", () => { expect(aproveitamento(estatisticasVazias())).toBe(0); });
});

describe("adversários", () => {
  const joga = (modo, jogador, n, seed) => {
    const rng = semente(seed), hist = [];
    let vitorias = 0;
    for (let i = 0; i < n; i++) {
      const g = jogador(i, rng);
      const m = escolhaDoAdversario(modo, hist, rng);
      if (resultado(m, g) === "vitoria") vitorias++;
      hist.push(g);
    }
    return vitorias / n;
  };

  it("a máquina sorteia os três gestos de forma parecida", () => {
    const rng = semente(7), cont = { Pedra: 0, Papel: 0, Tesoura: 0 };
    for (let i = 0; i < 3000; i++) cont[escolhaDoAdversario("maquina", [], rng)]++;
    for (const g of GESTOS) expect(cont[g]).toBeGreaterThan(850);
  });
  it("o Sensei quase sempre vence quem só joga pedra", () => {
    expect(joga("sensei", () => "Pedra", 300, 1)).toBeGreaterThan(0.8);
  });
  it("o Sensei aprende quem repete uma sequência", () => {
    expect(joga("sensei", (i) => GESTOS[i % 3], 300, 2)).toBeGreaterThan(0.7);
  });
  it("contra quem joga ao acaso, o Sensei não leva vantagem (nem deveria)", () => {
    const taxa = joga("sensei", (_, rng) => GESTOS[Math.floor(rng() * 3)], 3000, 3);
    expect(taxa).toBeGreaterThan(0.28); expect(taxa).toBeLessThan(0.4);
  });
  it("sem histórico suficiente, o Sensei sorteia (não quebra)", () => {
    expect(GESTOS).toContain(sensei([], semente(1))); expect(GESTOS).toContain(sensei(["Pedra"], semente(1)));
  });
});
