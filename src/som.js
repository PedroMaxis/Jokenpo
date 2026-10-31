// Sons sintetizados na hora (WebAudio): nada de arquivos. O contexto só nasce depois de um gesto do usuário.
let ctx = null;
let ligado = false;
export const ligarSom = (v) => { ligado = v; };

function nota(freq, inicio, dur, tipo = "triangle", vol = 0.08) {
  if (!ligado) return;
  try {
    ctx ??= new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime + inicio;
    const osc = ctx.createOscillator(), g = ctx.createGain();
    osc.type = tipo; osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(ctx.destination); osc.start(t); osc.stop(t + dur + 0.02);
  } catch { /* sem áudio */ }
}

export const batida = (i) => nota(i < 2 ? 330 : 523, 0, i < 2 ? 0.12 : 0.22, "square", 0.05); // jan, ken, PON
export const somVitoria = () => [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.09, 0.2));
export const somDerrota = () => [262, 196].forEach((f, i) => nota(f, i * 0.16, 0.3, "sawtooth", 0.05));
export const somEmpate = () => [392, 392].forEach((f, i) => nota(f, i * 0.12, 0.14));
