import Gesto from "./Gestos";

const ROTULO = { vitoria: "vitória", derrota: "derrota", empate: "empate" };

export default function Historico({ historico }) {
  const ultimas = historico.slice(-12);
  if (!ultimas.length) return <p className="mono-mini vazio-historico">As rodadas aparecem aqui.</p>;
  return (
    <ol className="historico" aria-label="Últimas rodadas">
      {ultimas.map((h, i) => (
        <li key={historico.length - ultimas.length + i} className={`h-${h.res}`} title={`${h.a} × ${h.b}: ${ROTULO[h.res]}`}>
          <Gesto nome={h.a} /><span className="sr">{h.a} contra {h.b}: {ROTULO[h.res]}</span>
        </li>
      ))}
    </ol>
  );
}
