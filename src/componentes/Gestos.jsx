/* Ícones desenhados à mão em SVG, no mesmo traço de tinta (sumi). Nada de pacote de ícones. */
const TINTA = "#16120e", VERMELHO = "#d8381e";

const FORMAS = {
  Pedra: (
    <>
      <path d="M20 80C14 58 28 34 52 27C76 20 100 34 104 58C108 80 94 98 70 100C46 102 26 98 20 80Z" fill="#cfc7b2" stroke={TINTA} strokeWidth="5" strokeLinejoin="round" />
      <path d="M52 29L59 49L47 62M86 42L77 58M34 74L48 78" fill="none" stroke={TINTA} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M36 52C40 44 48 40 56 38" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  Papel: (
    <>
      <path d="M32 16H72L94 38V104H32Z" fill="#fffaf0" stroke={TINTA} strokeWidth="5" strokeLinejoin="round" />
      <path d="M72 16V38H94" fill="#e6dcc3" stroke={TINTA} strokeWidth="5" strokeLinejoin="round" />
      <path d="M44 58H82M44 70H82M44 82H66" stroke={TINTA} strokeOpacity=".55" strokeWidth="4" strokeLinecap="round" />
      <circle cx="78" cy="88" r="7" fill={VERMELHO} />
    </>
  ),
  Tesoura: (
    <>
      <path d="M26 14L38 10L74 74L62 82Z" fill="#dfe3e8" stroke={TINTA} strokeWidth="4.5" strokeLinejoin="round" />
      <path d="M94 14L82 10L46 74L58 82Z" fill="#c9ced6" stroke={TINTA} strokeWidth="4.5" strokeLinejoin="round" />
      <circle cx="42" cy="98" r="13" fill="none" stroke={VERMELHO} strokeWidth="7" />
      <circle cx="78" cy="98" r="13" fill="none" stroke={VERMELHO} strokeWidth="7" />
      <circle cx="60" cy="76" r="4.5" fill={TINTA} />
    </>
  ),
  Punho: (
    <>
      <path d="M28 58C28 42 38 34 54 34H76C90 34 96 44 96 58V74C96 92 84 102 66 102H54C38 102 28 92 28 74Z" fill="#f3d6bb" stroke={TINTA} strokeWidth="5" strokeLinejoin="round" />
      <path d="M44 34V58M60 34V58M76 34V58" stroke={TINTA} strokeWidth="4" strokeLinecap="round" />
      <path d="M28 66H46" stroke={TINTA} strokeWidth="4" strokeLinecap="round" />
      <path d="M40 88C52 94 70 94 84 86" fill="none" stroke={TINTA} strokeOpacity=".3" strokeWidth="4" strokeLinecap="round" />
    </>
  ),
};

export default function Gesto({ nome, className = "", titulo }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role={titulo ? "img" : "presentation"} aria-label={titulo} aria-hidden={titulo ? undefined : true}>
      {FORMAS[nome]}
    </svg>
  );
}
