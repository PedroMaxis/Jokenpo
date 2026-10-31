import { describe, expect, it } from "vitest";
import { mesclar } from "./armazenamento";
import { estatisticasVazias } from "./jogo";

describe("mesclar", () => {
  it("aproveita o que está certo e descarta o que não está", () => {
    const r = mesclar(estatisticasVazias(), { vitorias: 7, derrotas: "muitas", gestos: { Pedra: 3, Papel: NaN, Lagarto: 9 }, intruso: true });
    expect(r.vitorias).toBe(7);
    expect(r.derrotas).toBe(0);
    expect(r.gestos).toEqual({ Pedra: 3, Papel: 0, Tesoura: 0 });
    expect(r).not.toHaveProperty("intruso");
  });
  it("dado que nem é objeto volta ao padrão", () => {
    expect(mesclar(estatisticasVazias(), "lixo")).toEqual(estatisticasVazias());
    expect(mesclar(estatisticasVazias(), null)).toEqual(estatisticasVazias());
  });
});
