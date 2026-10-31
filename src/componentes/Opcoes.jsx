import { FORMATOS, MODOS } from "../jogo";

function Grupo({ legenda, valor, itens, aoMudar }) {
  return (
    <fieldset className="grupo">
      <legend>{legenda}</legend>
      <div className="segmentos">
        {itens.map((it) => (
          <label key={String(it.valor)} className={valor === it.valor ? "on" : ""} title={it.descricao}>
            <input type="radio" name={legenda} checked={valor === it.valor} onChange={() => aoMudar(it.valor)} />
            {it.nome}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function Opcoes({ modo, melhorDe, som, aoMudarModo, aoMudarFormato, aoMudarSom }) {
  return (
    <div className="opcoes">
      <Grupo legenda="Adversário" valor={modo} aoMudar={aoMudarModo} itens={Object.entries(MODOS).map(([valor, m]) => ({ valor, nome: m.nome, descricao: m.descricao }))} />
      <Grupo legenda="Partida" valor={melhorDe} aoMudar={aoMudarFormato} itens={FORMATOS} />
      <label className={`som ${som ? "on" : ""}`}><input type="checkbox" checked={som} onChange={(e) => aoMudarSom(e.target.checked)} />Som {som ? "ligado" : "desligado"}</label>
    </div>
  );
}
