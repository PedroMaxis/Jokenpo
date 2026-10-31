import { GESTOS, aproveitamento, totalDeRodadas } from "../jogo";

export default function Estatisticas({ stats, aoLimpar }) {
  const total = totalDeRodadas(stats);
  const maior = Math.max(1, ...GESTOS.map((g) => stats.gestos[g]));
  return (
    <details className="painel">
      <summary>Sua história <span className="mono-mini">{total} {total === 1 ? "rodada" : "rodadas"} contra a máquina</span></summary>
      <div className="stats-grade">
        <div><strong>{aproveitamento(stats)}%</strong><span>de vitórias</span></div>
        <div><strong>{stats.vitorias}</strong><span>vitórias</span></div>
        <div><strong>{stats.derrotas}</strong><span>derrotas</span></div>
        <div><strong>{stats.empates}</strong><span>empates</span></div>
        <div><strong>{stats.melhorSequencia}</strong><span>melhor sequência</span></div>
        <div><strong>{stats.partidasGanhas}–{stats.partidasPerdidas}</strong><span>partidas (V–D)</span></div>
      </div>
      <h3>O que você mais joga</h3>
      <ul className="barras">
        {GESTOS.map((g) => (
          <li key={g}><span>{g}</span><i style={{ "--p": `${(stats.gestos[g] / maior) * 100}%` }} /><b>{stats.gestos[g]}</b></li>
        ))}
      </ul>
      <p className="mono-mini">Quem repete sempre o mesmo gesto é presa fácil para o Sensei.</p>
      <button className="link" onClick={() => confirm("Apagar todas as estatísticas?") && aoLimpar()}>Apagar estatísticas</button>
    </details>
  );
}
