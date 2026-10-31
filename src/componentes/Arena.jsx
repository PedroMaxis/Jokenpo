import { useEffect, useRef } from "react";
import Gesto from "./Gestos";
import { confete, gsap, SEM_PREFERENCIA, useGSAP } from "../animacao";
import { batida, somDerrota, somEmpate, somVitoria } from "../som";

const KANJI = { vitoria: "勝", derrota: "負", empate: "分" };

/** Palco do jogo: punhos balançam na contagem (jan, ken, PON), as mãos se revelam e um carimbo dá o veredito */
export default function Arena({ estado, nomeA, nomeB, textoVeredito, aoRevelar }) {
  const { fase, escolhaA, escolhaB, ultimo, rodada, vencedor } = estado;
  const raiz = useRef(null);
  const revelar = useRef(aoRevelar);
  useEffect(() => { revelar.current = aoRevelar; });
  const mostra = fase === "revelado" || fase === "fim";

  // contagem: três batidas com os punhos; no PON, a rodada é revelada
  useGSAP(() => {
    if (fase !== "contagem") return;
    const mm = gsap.matchMedia();
    const palavra = raiz.current.querySelector(".palavra");
    mm.add(SEM_PREFERENCIA, () => {
      const tl = gsap.timeline({ onComplete: () => revelar.current() });
      ["JAN", "KEN", "PON"].forEach((p, i) => {
        const t = i * 0.55;
        tl.add(() => { palavra.textContent = p; batida(i); }, t)
          .fromTo(".palavra", { scale: 0.4, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.28, ease: "back.out(3)" }, t)
          .fromTo(".mao .punho", { y: 0 }, { y: -48, duration: 0.2, ease: "power2.out", yoyo: true, repeat: 1 }, t)
          .fromTo(".mao-a .punho", { rotation: 6 }, { rotation: -14, duration: 0.2, yoyo: true, repeat: 1 }, t)
          .fromTo(".mao-b .punho", { rotation: -6 }, { rotation: 14, duration: 0.2, yoyo: true, repeat: 1 }, t);
      });
      tl.to({}, { duration: 0.15 });
      return () => { palavra.textContent = ""; };
    });
    mm.add("(prefers-reduced-motion: reduce)", () => { const id = setTimeout(() => revelar.current(), 350); return () => clearTimeout(id); });
  }, { scope: raiz, dependencies: [fase, rodada], revertOnUpdate: true });

  // espera: os punhos respiram devagar
  useGSAP(() => {
    if (fase !== "escolha" && fase !== "j2") return;
    const mm = gsap.matchMedia();
    mm.add(SEM_PREFERENCIA, () => {
      gsap.to(".mao .punho", { y: -8, rotation: (i) => (i ? 3 : -3), duration: 1.3, ease: "sine.inOut", yoyo: true, repeat: -1, stagger: 0.3 });
    });
  }, { scope: raiz, dependencies: [fase], revertOnUpdate: true });

  // revelação: as mãos entram, o carimbo bate no papel, o perdedor encolhe; derrota sacode a arena; vitória na partida solta confete
  useGSAP(() => {
    if (!mostra || !ultimo) return;
    const res = ultimo.res;
    if (res === "vitoria") somVitoria(); else if (res === "derrota") somDerrota(); else somEmpate();
    const mm = gsap.matchMedia();
    mm.add(SEM_PREFERENCIA, () => {
      gsap.timeline({ defaults: { ease: "back.out(2)" } })
        .from(".mao-a .gesto, .mao-b .gesto", { scale: 0, rotation: (i) => (i ? 40 : -40), duration: 0.55, stagger: 0.08 })
        .from(".carimbo", { scale: 3.2, opacity: 0, rotation: -28, duration: 0.35, ease: "power4.in" }, 0.35)
        .from(".veredito > *", { y: 16, opacity: 0, duration: 0.45, stagger: 0.08, ease: "power3.out" }, 0.5);
      if (res === "vitoria") gsap.to(".mao-a .gesto", { scale: 1.12, duration: 0.5, yoyo: true, repeat: 1, ease: "sine.inOut", delay: 0.6 });
      if (res === "derrota") { gsap.to(".mao-a .gesto", { opacity: 0.45, rotation: -12, scale: 0.9, duration: 0.5, delay: 0.5 }); gsap.fromTo(raiz.current, { x: 0 }, { x: 14, duration: 0.7, ease: "tremor", delay: 0.3 }); }
      if (res === "empate") gsap.fromTo(".mao .gesto", { y: 0 }, { y: -10, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut", delay: 0.6 });
      if (fase === "fim" && vencedor === "A") { const r = raiz.current.getBoundingClientRect(); confete(r.left + r.width / 2, r.top + r.height / 2); }
    });
  }, { scope: raiz, dependencies: [rodada, mostra], revertOnUpdate: true });

  // o círculo de tinta (ensō) é desenhado uma vez quando a arena aparece
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(SEM_PREFERENCIA, () => { gsap.from(".enso path", { drawSVG: "0%", duration: 1.8, ease: "power2.inOut" }); });
  }, { scope: raiz });

  const mao = (lado, escolha) => (mostra && escolha ? <Gesto nome={escolha} className="gesto" titulo={`${lado === "a" ? nomeA : nomeB} jogou ${escolha}`} /> : <Gesto nome="Punho" className="punho" />);

  return (
    <section className={`arena fase-${fase}`} ref={raiz} aria-label="Arena">
      <svg className="enso" viewBox="0 0 400 400" aria-hidden="true"><path d="M318 96A162 162 0 1 0 352 222" fill="none" strokeLinecap="round" /></svg>
      <div className="lado">
        <span className="rotulo">{nomeA}</span>
        <div className="mao mao-a">{mao("a", escolhaA)}</div>
        {fase === "j2" && <span className="aviso-oculto">já escolheu</span>}
      </div>
      <div className="centro" aria-hidden="true">
        <span className="palavra" />
        {mostra && ultimo && <span className={`carimbo carimbo-${ultimo.res}`}>{KANJI[ultimo.res]}</span>}
      </div>
      <div className="lado lado-b">
        <span className="rotulo">{nomeB}</span>
        <div className="mao mao-b">{mao("b", escolhaB)}</div>
      </div>
      <div className="veredito" aria-live="polite">{textoVeredito}</div>
    </section>
  );
}
