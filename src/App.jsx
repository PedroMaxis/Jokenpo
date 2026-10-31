import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import Arena from "./componentes/Arena";
import Controles from "./componentes/Controles";
import Estatisticas from "./componentes/Estatisticas";
import Historico from "./componentes/Historico";
import Opcoes from "./componentes/Opcoes";
import Placar from "./componentes/Placar";
import { gsap, SEM_PREFERENCIA, SplitText, useGSAP } from "./animacao";
import { carregar, salvar } from "./armazenamento";
import { GESTOS, MODOS, FORMATOS, escolhaDoAdversario, estatisticasVazias, registrarRodada } from "./jogo";
import { estadoInicial, historicoDoJogador, reduzir } from "./partida";
import { ligarSom } from "./som";
import "./styles.css";

const valido = (lista, v, padrao) => (lista.includes(v) ? v : padrao);

export default function App() {
  const [estado, dispatch] = useReducer(reduzir, undefined, () => estadoInicial(
    valido(Object.keys(MODOS), carregar("jokenpo.modo", "maquina"), "maquina"),
    valido(FORMATOS.map((f) => f.valor), carregar("jokenpo.formato", 0), 0),
  ));
  const [stats, setStats] = useState(() => carregar("jokenpo.stats", estatisticasVazias()));
  const [som, setSom] = useState(() => carregar("jokenpo.som", false));
  const raiz = useRef(null);
  const { modo, melhorDe, fase, ultimo, vencedor } = estado;

  useEffect(() => { ligarSom(som); salvar("jokenpo.som", som); }, [som]);
  useEffect(() => { salvar("jokenpo.modo", modo); salvar("jokenpo.formato", melhorDe); }, [modo, melhorDe]);
  useEffect(() => { salvar("jokenpo.stats", stats); }, [stats]);

  // cada rodada revelada contra a máquina entra nas estatísticas (partidas de 2 jogadores não contam)
  useEffect(() => {
    if (!ultimo || modo === "dois") return;
    setStats((s) => registrarRodada(s, ultimo.a, ultimo.res, estado.sequencia));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ultimo]);
  useEffect(() => {
    if (!vencedor || modo === "dois") return;
    setStats((s) => (vencedor === "A" ? { ...s, partidasGanhas: s.partidasGanhas + 1 } : { ...s, partidasPerdidas: s.partidasPerdidas + 1 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vencedor]);

  const jogar = useCallback((gesto) => {
    if (fase !== "escolha" && fase !== "j2") return;
    dispatch({ tipo: "ESCOLHER", gesto, adversario: fase === "escolha" && modo !== "dois" ? escolhaDoAdversario(modo, historicoDoJogador(estado)) : undefined });
  }, [fase, modo, estado]);
  const proxima = useCallback(() => dispatch({ tipo: "PROXIMA" }), []);
  const novaPartida = useCallback(() => dispatch({ tipo: "NOVA_PARTIDA" }), []);
  const aoRevelar = useCallback(() => dispatch({ tipo: "REVELAR" }), []);

  // teclado: 1, 2, 3 jogam; Enter/Espaço seguem; R recomeça a partida
  useEffect(() => {
    const tecla = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const emControle = e.target.closest?.("button, select, input, summary, a"); // Enter/Espaço já clicam nesses
      const digitando = e.target.closest?.("select, input, textarea");
      if (["1", "2", "3"].includes(e.key)) jogar(GESTOS[Number(e.key) - 1]);
      else if ((e.key === "Enter" || e.key === " ") && !emControle) { e.preventDefault(); if (fase === "revelado") proxima(); else if (fase === "fim") novaPartida(); }
      else if (e.key.toLowerCase() === "r" && !digitando) novaPartida();
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [jogar, proxima, novaPartida, fase]);

  // título: as letras entram uma a uma
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(SEM_PREFERENCIA, () => {
      const letras = SplitText.create(".titulo", { type: "chars", mask: "chars" });
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .from(letras.chars, { yPercent: 110, duration: 0.9, stagger: 0.05 })
        .from(".ruby, .subtitulo", { y: 14, opacity: 0, duration: 0.6, stagger: 0.1 }, 0.3)
        .from(".placar, .arena, .controles, .opcoes, .painel, .historico, .vazio-historico", { y: 30, opacity: 0, duration: 0.7, stagger: 0.08 }, 0.4);
    });
  }, { scope: raiz });

  const nomeA = modo === "dois" ? "Jogador 1" : "Você";
  const nomeB = MODOS[modo].nome === "2 jogadores" ? "Jogador 2" : MODOS[modo].nome;
  const quemGanhou = ultimo?.res === "vitoria" ? (modo === "dois" ? "Jogador 1 ganhou" : "Você ganhou") : ultimo?.res === "derrota" ? (modo === "dois" ? "Jogador 2 ganhou" : modo === "sensei" ? "O Sensei ganhou" : "A máquina ganhou") : "Empate";
  const fim = fase === "fim" ? (vencedor === "A" ? (modo === "dois" ? "Partida do Jogador 1!" : "A partida é sua!") : modo === "dois" ? "Partida do Jogador 2!" : `A partida é ${modo === "sensei" ? "do Sensei" : "da máquina"}.`) : null;
  const textoVeredito = ultimo && (fase === "revelado" || fase === "fim") ? (
    <>
      <strong>{fim ?? quemGanhou}</strong>
      <span>{fim ? `${quemGanhou}. ` : ""}{ultimo.frase}</span>
    </>
  ) : fase === "j2" ? <span>Jogador 2, é a sua vez. O gesto do Jogador 1 está escondido.</span> : null;

  return (
    <div className="pagina" ref={raiz}>
      <span className="kana" aria-hidden="true">じゃんけんぽん</span>
      <header className="cabecalho">
        <p className="ruby" lang="ja">じゃんけんぽん</p>
        <h1 className="titulo">Jokenpô</h1>
        <p className="subtitulo">Pedra, papel e tesoura. Três batidas e a mão na mesa.</p>
      </header>
      <main>
        <Opcoes modo={modo} melhorDe={melhorDe} som={som}
          aoMudarModo={(m) => dispatch({ tipo: "CONFIGURAR", modo: m })} aoMudarFormato={(f) => dispatch({ tipo: "CONFIGURAR", melhorDe: f })} aoMudarSom={setSom} />
        <Placar estado={estado} nomeA={nomeA} nomeB={nomeB} />
        <Arena estado={estado} nomeA={nomeA} nomeB={nomeB} textoVeredito={textoVeredito} aoRevelar={aoRevelar} />
        <Controles estado={estado} nomeA={nomeA} aoJogar={jogar} aoProxima={proxima} aoNovaPartida={novaPartida} />
        <Historico historico={estado.historico} />
        <Estatisticas stats={stats} aoLimpar={() => setStats(estatisticasVazias())} />
      </main>
      <footer className="rodape">
        <span>Teclas: <kbd>1</kbd> pedra · <kbd>2</kbd> papel · <kbd>3</kbd> tesoura · <kbd>↵</kbd> seguir · <kbd>R</kbd> recomeçar</span>
        <span>“Jokenpô” vem do japonês <i>jan-ken-pon</i>.</span>
      </footer>
    </div>
  );
}
