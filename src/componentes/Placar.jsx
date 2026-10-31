import { pontosParaVencer } from "../jogo";

function Pontos({ total, alvo, cor }) {
  if (!alvo) return null;
  return <span className="pontos" aria-hidden="true">{Array.from({ length: alvo }, (_, i) => <i key={i} className={i < total ? `cheio ${cor}` : ""} />)}</span>;
}

export default function Placar({ estado, nomeA, nomeB }) {
  const { placar, melhorDe, sequencia } = estado;
  const alvo = pontosParaVencer(melhorDe);
  return (
    <div className="placar" role="group" aria-label="Placar">
      <div className="tile"><span className="rotulo">{nomeA}</span><strong>{placar.a}</strong><Pontos total={placar.a} alvo={alvo} cor="a" /></div>
      <div className="tile meio"><span className="rotulo">empates</span><strong>{placar.empates}</strong>{alvo ? <span className="mono-mini">primeiro a {alvo}</span> : <span className="mono-mini">partida livre</span>}</div>
      <div className="tile"><span className="rotulo">{nomeB}</span><strong>{placar.b}</strong><Pontos total={placar.b} alvo={alvo} cor="b" /></div>
      {sequencia >= 2 && estado.modo !== "dois" && <span className="sequencia" role="status">{sequencia} vitórias seguidas</span>}
    </div>
  );
}
