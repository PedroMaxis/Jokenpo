import { useEffect, useRef } from "react";
import Gesto from "./Gestos";
import { GESTOS } from "../jogo";

/** Três "selos" para escolher o gesto (teclas 1, 2, 3); depois da rodada, vira o botão de seguir */
export default function Controles({ estado, nomeA, aoJogar, aoProxima, aoNovaPartida }) {
  const { fase } = estado;
  const principal = useRef(null);
  // o botão de seguir recebe o foco (teclado/leitor de tela) sem rolar a página
  useEffect(() => { principal.current?.focus({ preventScroll: true }); }, [fase]);
  if (fase === "revelado") return <div className="controles"><button ref={principal} className="botao-principal" onClick={aoProxima}>Próxima rodada <kbd>↵</kbd></button></div>;
  if (fase === "fim") return <div className="controles"><button ref={principal} className="botao-principal" onClick={aoNovaPartida}>Nova partida <kbd>↵</kbd></button></div>;
  const desativado = fase === "contagem";
  const quem = fase === "j2" ? "Jogador 2" : estado.modo === "dois" ? "Jogador 1" : nomeA;
  return (
    <div className="controles">
      <p className="instrucao" aria-live="polite">{desativado ? "Atenção…" : estado.modo === "dois" ? `${quem}, escolha sem ninguém olhar` : "Escolha o seu gesto"}</p>
      <div className="selos" role="group" aria-label="Escolha o gesto">
        {GESTOS.map((g, i) => (
          <button key={g} className="selo-gesto" onClick={() => aoJogar(g)} disabled={desativado} aria-label={`${g} (tecla ${i + 1})`}>
            <Gesto nome={g} className="icone" />
            <span className="nome">{g}</span>
            <kbd>{i + 1}</kbd>
          </button>
        ))}
      </div>
    </div>
  );
}
