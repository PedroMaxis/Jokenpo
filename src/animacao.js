import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { CustomWiggle } from "gsap/CustomWiggle";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Physics2DPlugin } from "gsap/Physics2DPlugin";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(CustomEase, CustomWiggle, DrawSVGPlugin, Physics2DPlugin, SplitText, useGSAP);
CustomWiggle.create("tremor", { wiggles: 9, type: "easeOut" }); // sacudida de derrota

/** Só anima quando a pessoa não pediu menos movimento */
export const SEM_PREFERENCIA = "(prefers-reduced-motion: no-preference)";
export const movimentoReduzido = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Chuva de confete (pétalas de tinta) lançada com física a partir de um ponto da tela */
export function confete(x, y, quantidade = 70) {
  if (movimentoReduzido()) return;
  const cores = ["#d8381e", "#f2b632", "#2b3a67", "#16120e", "#f1e9d6"];
  for (let i = 0; i < quantidade; i++) {
    const p = document.createElement("i");
    const longo = Math.random() < 0.4;
    Object.assign(p.style, { position: "fixed", left: `${x}px`, top: `${y}px`, width: longo ? "5px" : "10px", height: longo ? "16px" : "10px", borderRadius: longo ? "2px" : "50% 0", background: cores[i % cores.length], zIndex: 50, pointerEvents: "none" });
    document.body.appendChild(p);
    gsap.to(p, {
      physics2D: { velocity: gsap.utils.random(350, 950), angle: gsap.utils.random(-140, -40), gravity: 1400 },
      rotation: gsap.utils.random(-540, 540), duration: gsap.utils.random(1.5, 2.5), ease: "none", opacity: 0, delay: gsap.utils.random(0, 0.1), onComplete: () => p.remove(),
    });
  }
}

export { gsap, SplitText, useGSAP };
