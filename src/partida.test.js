import { describe, expect, it } from "vitest";
import { estadoInicial, historicoDoJogador, reduzir } from "./partida";

const rodada = (s, a, b) => reduzir(reduzir(s, { tipo: "ESCOLHER", gesto: a, adversario: b }), { tipo: "REVELAR" });

describe("partida contra o computador", () => {
  it("escolher leva à contagem e revelar fecha a rodada", () => {
    let s = reduzir(estadoInicial(), { tipo: "ESCOLHER", gesto: "Pedra", adversario: "Tesoura" });
    expect(s).toMatchObject({ fase: "contagem", escolhaA: "Pedra", escolhaB: "Tesoura", rodada: 1 });
    expect(s.placar).toEqual({ a: 0, b: 0, empates: 0 }); // o placar só muda na revelação
    s = reduzir(s, { tipo: "REVELAR" });
    expect(s.fase).toBe("revelado");
    expect(s.placar.a).toBe(1);
    expect(s.ultimo).toMatchObject({ res: "vitoria", frase: "Pedra amassa tesoura." });
  });
  it("ignora jogadas fora de hora", () => {
    const s = reduzir(estadoInicial(), { tipo: "ESCOLHER", gesto: "Pedra", adversario: "Papel" });
    expect(reduzir(s, { tipo: "ESCOLHER", gesto: "Papel", adversario: "Papel" })).toBe(s);
    expect(reduzir(estadoInicial(), { tipo: "REVELAR" })).toEqual(estadoInicial());
  });
  it("sequência de vitórias sobe e zera na primeira não-vitória", () => {
    let s = estadoInicial();
    s = rodada(s, "Pedra", "Tesoura"); s = reduzir(s, { tipo: "PROXIMA" });
    s = rodada(s, "Papel", "Pedra"); expect(s.sequencia).toBe(2); s = reduzir(s, { tipo: "PROXIMA" });
    s = rodada(s, "Pedra", "Pedra"); expect(s.sequencia).toBe(0);
  });
  it("melhor de 3 termina em 2 vitórias e trava novas jogadas", () => {
    let s = estadoInicial("maquina", 3);
    s = rodada(s, "Pedra", "Tesoura"); s = reduzir(s, { tipo: "PROXIMA" });
    s = rodada(s, "Pedra", "Papel"); s = reduzir(s, { tipo: "PROXIMA" });
    s = rodada(s, "Papel", "Pedra");
    expect(s).toMatchObject({ fase: "fim", vencedor: "A" });
    expect(reduzir(s, { tipo: "PROXIMA" })).toBe(s);
    const nova = reduzir(s, { tipo: "NOVA_PARTIDA" });
    expect(nova).toMatchObject({ fase: "escolha", vencedor: null, placar: { a: 0, b: 0, empates: 0 } });
    expect(nova.historico).toHaveLength(3); // a história das rodadas continua (alimenta o Sensei)
  });
  it("empates não decidem a partida", () => {
    let s = estadoInicial("maquina", 3);
    for (let i = 0; i < 4; i++) { s = rodada(s, "Pedra", "Pedra"); s = reduzir(s, { tipo: "PROXIMA" }); }
    expect(s.fase).toBe("escolha"); expect(s.placar.empates).toBe(4);
  });
  it("trocar modo ou formato recomeça tudo", () => {
    let s = rodada(estadoInicial(), "Pedra", "Tesoura");
    s = reduzir(s, { tipo: "CONFIGURAR", modo: "sensei", melhorDe: 5 });
    expect(s).toEqual(estadoInicial("sensei", 5));
  });
  it("expõe o histórico do jogador para o Sensei", () => {
    let s = rodada(estadoInicial(), "Pedra", "Tesoura"); s = reduzir(s, { tipo: "PROXIMA" });
    s = rodada(s, "Papel", "Tesoura");
    expect(historicoDoJogador(s)).toEqual(["Pedra", "Papel"]);
  });
});

describe("2 jogadores", () => {
  it("o gesto do jogador 1 fica escondido até o jogador 2 escolher", () => {
    let s = reduzir(estadoInicial("dois"), { tipo: "ESCOLHER", gesto: "Papel" });
    expect(s.fase).toBe("j2");
    expect(s.escolhaB).toBeNull();
    s = reduzir(s, { tipo: "ESCOLHER", gesto: "Pedra" });
    expect(s).toMatchObject({ fase: "contagem", escolhaA: "Papel", escolhaB: "Pedra" });
    s = reduzir(s, { tipo: "REVELAR" });
    expect(s.ultimo.res).toBe("vitoria");
  });
});
