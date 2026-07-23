/**
 * AsciiChem Console CLI — Easter Egg Command Center.
 *
 * Exposed as `window.asciichem` with a rich set of chemistry-themed
 * commands. Type `help()` or `asciichem.help()` in the browser
 * console to see everything.
 *
 * Categories:
 *   🎵 Sound & Music — compose molecules, sing the periodic table
 *   🎮 Games — interactive quiz
 *   ⚗️ Chemistry — molecular weight, radioactive decay, the mole
 *   🌈 Visual Effects — gold, caffeine, neon, entropy
 *   🏆 Achievements — badge collection
 */

const ACHIEVEMENT_KEY = "asciichem-achievements";

interface ElementInfo {
  z: number;
  mass: number;
  name: string;
  facts: string[];
}

const ELEMENTS: Record<string, ElementInfo> = {
  H: { z: 1, mass: 1.008, name: "Hydrogen", facts: [
    "Makes up 75% of the universe's normal matter. It's literally everywhere.",
    "The sun is 91% hydrogen by number of atoms.",
    "Its name means 'water-former' — burn it and you get H₂O.",
  ]},
  He: { z: 2, mass: 4.003, name: "Helium", facts: [
    "So light it escapes Earth's gravity. We're slowly losing it forever.",
    "Discovered in the sun (via spectral lines) before it was found on Earth.",
    "Liquid helium is used to cool MRI magnets to near absolute zero.",
  ]},
  Li: { z: 3, mass: 6.941, name: "Lithium", facts: [
    "Powers your phone, your laptop, and increasingly your car.",
    "Used to treat bipolar disorder at therapeutic doses.",
    "The lightest metal — it floats on water (and then reacts with it).",
  ]},
  C: { z: 6, mass: 12.011, name: "Carbon", facts: [
    "Forms more compounds than every other element combined.",
    "Diamond and graphite are both pure carbon — same atoms, different arrangement.",
    "The basis of all known life. You are a carbon-based lifeform.",
  ]},
  N: { z: 7, mass: 14.007, name: "Nitrogen", facts: [
    "78% of the air you breathe, but completely inert at room temperature.",
    "Liquid nitrogen is -196°C. Chefs use it for instant ice cream.",
    "The N₂ triple bond is one of the strongest bonds in chemistry.",
  ]},
  O: { z: 8, mass: 15.999, name: "Oxygen", facts: [
    "What makes fire, rust, and breathing possible.",
    "Too much oxygen is toxic — pure O₂ damages your lungs over time.",
    "Produced by plants via photosynthesis. Thank a tree.",
  ]},
  F: { z: 9, mass: 18.998, name: "Fluorine", facts: [
    "The most reactive element — it even reacts with noble gases.",
    "Teflon (non-stick pans) is held together by C-F bonds.",
    "Hydrofluoric acid dissolves glass. Don't store it in a bottle.",
  ]},
  Ne: { z: 10, mass: 20.180, name: "Neon", facts: [
    "Only the orange-red 'neon' signs actually contain neon.",
    "Other colours use argon, krypton, or xenon — not neon.",
    "Completely inert. It has never been observed forming a stable compound.",
  ]},
  Na: { z: 11, mass: 22.990, name: "Sodium", facts: [
    "Explodes violently on contact with water. Great party trick.",
    "Table salt is NaCl — sodium gave up an electron to chlorine.",
    "Your nerves use sodium ions to transmit signals.",
  ]},
  Mg: { z: 12, mass: 24.305, name: "Magnesium", facts: [
    "Burns with a blinding white light — used in old camera flashes.",
    "The centre of every chlorophyll molecule. Plants need it.",
    "Epsom salts are magnesium sulfate. Good for sore muscles.",
  ]},
  Al: { z: 13, mass: 26.982, name: "Aluminium", facts: [
    "Once more precious than gold. Napoleon III served VIPs on aluminium plates.",
    "The most abundant metal in Earth's crust.",
    "Refining it from bauxite takes so much electricity that recycling saves 95%.",
  ]},
  Si: { z: 14, mass: 28.086, name: "Silicon", facts: [
    "27% of Earth's crust. The 'Silicon Valley' element.",
    "Every computer chip is etched into a silicon wafer.",
    "Glass is mostly silicon dioxide — SiO₂ melted and cooled fast.",
  ]},
  P: { z: 15, mass: 30.974, name: "Phosphorus", facts: [
    "Discovered by an alchemist who was evaporating urine. Really.",
    "White phosphorus glows in the dark and catches fire in air.",
    "In your DNA backbone, holding the code of life together.",
  ]},
  S: { z: 16, mass: 32.065, name: "Sulfur", facts: [
    "The 'brimstone' of the Bible. It burns with a blue flame.",
    "Responsible for the smell of matches, garlic, and rotten eggs.",
    "Vulcanised rubber (car tyres) is cross-linked with sulfur bridges.",
  ]},
  Cl: { z: 17, mass: 35.453, name: "Chlorine", facts: [
    "Used as a chemical weapon in WWI. Now it cleans your swimming pool.",
    "Combined with sodium, it makes table salt — chemistry is wild.",
    "The CFCs that destroyed the ozone layer were chlorine compounds.",
  ]},
  Ar: { z: 18, mass: 39.948, name: "Argon", facts: [
    "1% of the atmosphere, and it does absolutely nothing.",
    "Used to fill light bulbs and protect welding — it won't react.",
    "Its name means 'the lazy one' in Greek.",
  ]},
  K: { z: 19, mass: 39.098, name: "Potassium", facts: [
    "Bananas are rich in it — but not that rich. The banana radiation myth is a myth.",
    "Its symbol K comes from kalium, the Latin/Arabic name.",
    "Like sodium, it explodes in water — but more violently.",
  ]},
  Ca: { z: 20, mass: 40.078, name: "Calcium", facts: [
    "Your bones and teeth are mostly calcium phosphate.",
    "Limestone, chalk, and marble are all calcium carbonate.",
    "Snails build their shells out of it. So do coral reefs.",
  ]},
  Fe: { z: 26, mass: 55.845, name: "Iron", facts: [
    "The most stable element — you can't squeeze energy out of it either way.",
    "When stars run out of fuel, they die making iron. It's the end of the line.",
    "Earth's core is mostly iron and nickel. Your blood uses it to carry oxygen.",
  ]},
  Cu: { z: 29, mass: 63.546, name: "Copper", facts: [
    "The Statue of Liberty was originally brown. It turned green (verdigris) over decades.",
    "The best electrical conductor of all the common metals.",
    "One of the few metals that's naturally coloured — it's reddish-orange.",
  ]},
  Zn: { z: 30, mass: 65.38, name: "Zinc", facts: [
    "In every cell of your body — over 300 enzymes need it.",
    "Brass is copper + zinc. It's been used for 2000+ years.",
    "Galvanised steel is coated with zinc to prevent rust.",
  ]},
  Br: { z: 35, mass: 79.904, name: "Bromine", facts: [
    "One of only two elements that are liquid at room temperature.",
    "Its name means 'stench' in Greek. It smells awful.",
    "Used in flame retardants — which is why old electronics smell bad when burned.",
  ]},
  Ag: { z: 47, mass: 107.868, name: "Silver", facts: [
    "The best electrical and thermal conductor of any element.",
    "Kills bacteria — silver nanoparticles are used in bandages and socks.",
    "The word 'lunatic' comes from luna (moon) because silver was associated with the moon.",
  ]},
  Sn: { z: 50, mass: 118.71, name: "Tin", facts: [
    "Tin cans aren't pure tin — they're steel with a micro-thin tin coating.",
    "At very cold temperatures, tin crumbles into powder ('tin pest').",
    "Bronze is copper + tin. The Bronze Age is named after it.",
  ]},
  I: { z: 53, mass: 126.904, name: "Iodine", facts: [
    "Sublimates directly from a solid to a beautiful purple vapour.",
    "Added to table salt to prevent goitre (thyroid swelling).",
    "Dissolved in alcohol, it's the antiseptic your grandparents used.",
  ]},
  Xe: { z: 54, mass: 131.293, name: "Xenon", facts: [
    "The first noble gas ever forced into a chemical compound (in 1962).",
    "Used in high-intensity car headlights and cinema projectors.",
    "It's a general anaesthetic — you could literally be put to sleep with xenon.",
  ]},
  Au: { z: 79, mass: 196.967, name: "Gold", facts: [
    "So unreactive that 3000-year-old gold artefacts look brand new.",
    "A single gram can be hammered into a sheet 1 square metre in size.",
    "All the gold ever mined would fit in a cube about 21 metres on each side.",
  ]},
  Hg: { z: 80, mass: 200.59, name: "Mercury", facts: [
    "The only metal that's liquid at room temperature.",
    "'Mad as a hatter' comes from hatmakers poisoned by mercury fumes.",
    "Its symbol Hg comes from hydrargyrum — 'liquid silver' in Greek.",
  ]},
  Pb: { z: 82, mass: 207.2, name: "Lead", facts: [
    "The Romans used it for pipes and sweetening wine. Bad idea.",
    "Added to petrol (gasoline) for 80 years before we realised it caused brain damage.",
    "Great radiation shield — that's why you wear a lead apron at the dentist.",
  ]},
  U: { z: 92, mass: 238.029, name: "Uranium", facts: [
    "Weakly radioactive — a banana is more radioactive per kilogram.",
    "U-235 is the fissile isotope used in nuclear reactors and weapons.",
    "Depleted uranium (U-238) is so dense it's used in anti-tank shells.",
  ]},
};

const ACHIEVEMENTS = [
  { id: "first-atom", icon: "🔬", name: "First Contact", desc: "Click your first atom" },
  { id: "composer", icon: "🎵", name: "Composer", desc: "Play a molecule" },
  { id: "singer", icon: "🎼", name: "Maestro", desc: "Hear the periodic table song" },
  { id: "quiz-master", icon: "🧠", name: "Quiz Master", desc: "Answer 5 quiz questions correctly" },
  { id: "gold-rush", icon: "🥇", name: "Gold Rush", desc: "Turn everything to gold" },
  { id: "caffeinated", icon: "☕", name: "Caffeinated", desc: "Activate hyper focus mode" },
  { id: "neon-nights", icon: "💡", name: "Neon Nights", desc: "Light up the neon" },
  { id: "entropic", icon: "🌪️", name: "Agent of Chaos", desc: "Unleash entropy" },
  { id: "party-animal", icon: "🎉", name: "Party Animal", desc: "Activate party mode" },
  { id: "mole-day", icon: "🕳️", name: "Mole Day", desc: "Celebrate Avogadro's number" },
  { id: "alchemist", icon: "⚗️", name: "Alchemist", desc: "Calculate a molecular weight" },
  { id: "reader", icon: "📖", name: "RTFM", desc: "Read the help (you're here!)" },
];

function getUnlocked(): Set<string> {
  try {
    const stored = localStorage.getItem(ACHIEVEMENT_KEY);
    return new Set(stored ? JSON.parse(stored) : []);
  } catch {
    return new Set();
  }
}

function saveUnlocked(set: Set<string>): void {
  try {
    localStorage.setItem(ACHIEVEMENT_KEY, JSON.stringify([...set]));
  } catch { /* noop */ }
}

function unlock(id: string): boolean {
  const unlocked = getUnlocked();
  if (unlocked.has(id)) return false;
  unlocked.add(id);
  saveUnlocked(unlocked);
  const ach = ACHIEVEMENTS.find((a) => a.id === id);
  if (ach) showAchievementToast(ach);
  return true;
}

function showAchievementToast(ach: typeof ACHIEVEMENTS[0]): void {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed; top: 1.5rem; right: 1.5rem; z-index: 99999;
    display: flex; align-items: center; gap: 0.75rem;
    padding: 1rem 1.5rem; min-width: 280px;
    background: linear-gradient(135deg, #baa300 0%, #968400 100%);
    border: 2px solid #e7d67a; border-radius: 0.75rem;
    box-shadow: 0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(231,214,122,0.3);
    color: #fff; font-family: system-ui, sans-serif;
    animation: achSlideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
  `;
  toast.innerHTML = `
    <span style="font-size: 2rem;">${ach.icon}</span>
    <div>
      <div style="font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #e7d67a; font-weight: 700;">Achievement Unlocked</div>
      <div style="font-size: 1.1rem; font-weight: 700; margin-top: 0.15rem;">${ach.name}</div>
      <div style="font-size: 0.8rem; opacity: 0.8; margin-top: 0.15rem;">${ach.desc}</div>
    </div>
  `;
  document.body.appendChild(toast);

  if (!document.getElementById("ach-styles")) {
    const style = document.createElement("style");
    style.id = "ach-styles";
    style.textContent = `
      @keyframes achSlideIn {
        from { transform: translateX(120%) scale(0.9); opacity: 0; }
        to { transform: translateX(0) scale(1); opacity: 1; }
      }
      @keyframes achSlideOut {
        to { transform: translateX(120%) scale(0.9); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  setTimeout(() => {
    toast.style.animation = "achSlideOut 0.3s ease-in forwards";
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// --- Visual effects ----------------------------------------------------

function applyEffect(className: string, duration = 0): void {
  document.documentElement.classList.remove(
    "fx-gold", "fx-caffeine", "fx-neon", "fx-entropy",
  );
  if (className) document.documentElement.classList.add(className);
  if (duration > 0) {
    setTimeout(() => document.documentElement.classList.remove(className), duration);
  }
}

function ensureFxStyles(): void {
  if (document.getElementById("fx-styles")) return;
  const style = document.createElement("style");
  style.id = "fx-styles";
  style.textContent = `
    /* Gold effect */
    .fx-gold body {
      filter: sepia(0.6) hue-rotate(-15deg) saturate(2.5) brightness(1.05);
      transition: filter 0.6s ease;
    }
    .fx-gold h1, .fx-gold h2, .fx-gold h3 {
      background: linear-gradient(135deg, #ffd700, #ffaa00, #ffd700) !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      animation: goldShimmer 2s ease-in-out infinite;
    }
    @keyframes goldShimmer {
      0%, 100% { filter: brightness(1); }
      50% { filter: brightness(1.3); }
    }

    /* Caffeine — hyper focus mode (not jitter!) */
    .fx-caffeine body {
      filter: contrast(1.12) saturate(1.2) brightness(1.03);
      transition: filter 0.4s ease;
    }
    .fx-caffeine main {
      filter: drop-shadow(0 0 0.5px rgba(186,163,0,0.15));
    }
    .fx-caffeine pre,
    .fx-caffeine code,
    .fx-caffeine .asciichem-render {
      box-shadow: 0 0 12px rgba(186,163,0,0.12);
      transition: box-shadow 0.4s ease;
    }
    .fx-caffeine::after {
      content: '';
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 99997;
      background: radial-gradient(
        ellipse at center,
        transparent 30%,
        rgba(0,0,0,0.15) 70%,
        rgba(0,0,0,0.35) 100%
      );
      animation: focusFade 0.4s ease forwards;
    }
    .fx-caffeine .focus-badge {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 99999;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1.25rem;
      background: linear-gradient(135deg, #baa300, #968400);
      color: #fff;
      font-size: 0.85rem;
      font-weight: 700;
      border-radius: 999px;
      box-shadow: 0 4px 20px rgba(186,163,0,0.4);
      animation: badgePop 0.3s ease;
    }
    .fx-caffeine .focus-badge .focus-bar {
      width: 60px;
      height: 4px;
      background: rgba(255,255,255,0.2);
      border-radius: 999px;
      overflow: hidden;
    }
    .fx-caffeine .focus-badge .focus-bar-fill {
      height: 100%;
      background: #e7d67a;
      border-radius: 999px;
      animation: focusDrain 10s linear forwards;
    }
    @keyframes focusFade {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes focusDrain {
      from { width: 100%; }
      to { width: 0%; }
    }

    /* Neon glow */
    .fx-neon h1, .fx-neon h2, .fx-neon h3, .fx-neon .site-title {
      text-shadow:
        0 0 5px #ff00de,
        0 0 10px #ff00de,
        0 0 20px #ff00de,
        0 0 40px #00ffff,
        0 0 10px #00ffff;
      animation: neonFlicker 3s linear infinite;
    }
    @keyframes neonFlicker {
      0%, 100% { opacity: 1; }
      41% { opacity: 1; }
      42% { opacity: 0.8; }
      43% { opacity: 1; }
      45% { opacity: 0.4; }
      46% { opacity: 1; }
    }

    /* Entropy — elements drift randomly */
    .fx-entropy *:not(style):not(script) {
      transition: transform 3s ease-in-out !important;
    }
  `;
  document.head.appendChild(style);
}

function rainEffect(): void {
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99998;overflow:hidden;";
  document.body.appendChild(overlay);
  for (let i = 0; i < 60; i++) {
    const drop = document.createElement("div");
    drop.textContent = "💧";
    drop.style.cssText = `position:absolute;font-size:1rem;left:${Math.random()*100}vw;top:-5vh;animation:rainFall ${1+Math.random()*2}s linear forwards;animation-delay:${Math.random()*2}s;`;
    overlay.appendChild(drop);
  }
  if (!document.getElementById("rain-styles")) {
    const s = document.createElement("style");
    s.id = "rain-styles";
    s.textContent = "@keyframes rainFall { to { transform: translateY(110vh); } }";
    document.head.appendChild(s);
  }
  setTimeout(() => overlay.remove(), 5000);
}

function moleEffect(): void {
  const overlay = document.createElement("div");
  overlay.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:99998;overflow:hidden;";
  document.body.appendChild(overlay);
  const molecules = ["⚛️","🧪","⚗️","🔬","🧬","💎","✨"];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement("div");
    el.textContent = molecules[Math.floor(Math.random()*molecules.length)];
    el.style.cssText = `position:absolute;font-size:${1+Math.random()*1.5}rem;left:${Math.random()*100}vw;top:-5vh;opacity:${0.5+Math.random()*0.5};animation:moleFall ${3+Math.random()*3}s linear forwards;animation-delay:${Math.random()*4}s;`;
    overlay.appendChild(el);
  }
  if (!document.getElementById("mole-styles")) {
    const s = document.createElement("style");
    s.id = "mole-styles";
    s.textContent = "@keyframes moleFall { to { transform: translateY(110vh) rotate(360deg); } }";
    document.head.appendChild(s);
  }
  const banner = document.createElement("div");
  banner.textContent = "🕳️ 6.022 × 10²³ — ONE MOLE! 🧪";
  banner.style.cssText = "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);z-index:99999;padding:1.5rem 3rem;background:#baa300;color:#fff;font-size:1.5rem;font-weight:700;border-radius:1rem;box-shadow:0 8px 32px rgba(0,0,0,0.4);animation:bannerPop 0.5s ease;";
  document.body.appendChild(banner);
  if (!document.getElementById("banner-pop-styles")) {
    const s = document.createElement("style");
    s.id = "banner-pop-styles";
    s.textContent = "@keyframes bannerPop { 0%{transform:translate(-50%,-50%) scale(0)} 50%{transform:translate(-50%,-50%) scale(1.1)} 100%{transform:translate(-50%,-50%) scale(1)} }";
    document.head.appendChild(s);
  }
  setTimeout(() => { overlay.remove(); banner.style.transition="opacity 0.5s"; banner.style.opacity="0"; setTimeout(()=>banner.remove(),500); }, 7000);
}

// --- Learn card (shared educational tooltip) --------------------------

function showLearnCard(syntax: string, explain: string): void {
  const existing = document.querySelector(".learn-card");
  if (existing) existing.remove();

  const card = document.createElement("div");
  card.className = "learn-card";
  card.innerHTML = `
    <div class="learn-card-icon">🧪</div>
    <div class="learn-card-body">
      ${syntax ? `<code class="learn-card-syntax">${syntax}</code>` : ""}
      <p class="learn-card-explain">${explain}</p>
    </div>
    <button class="learn-card-close" aria-label="Dismiss">×</button>
  `;

  if (!document.getElementById("learn-card-cli-styles")) {
    const style = document.createElement("style");
    style.id = "learn-card-cli-styles";
    style.textContent = `
      .learn-card {
        position: fixed; bottom: 5.5rem; right: 1.5rem; z-index: 99999;
        display: flex; align-items: flex-start; gap: 0.75rem;
        max-width: 22rem; padding: 1rem 1.25rem;
        background: var(--sl-color-bg, #fff);
        border: 2px solid var(--color-asciichem-accent, #baa300);
        border-radius: 0.75rem;
        box-shadow: 0 8px 32px rgba(0,0,0,0.15);
        animation: learnCardInCli 0.3s cubic-bezier(0.22,1,0.36,1) forwards;
      }
      [data-theme="dark"] .learn-card { border-color: #e7d67a; }
      .learn-card-icon { font-size: 1.5rem; flex-shrink: 0; }
      .learn-card-body { flex: 1; min-width: 0; }
      .learn-card-syntax {
        display: inline-block; padding: 0.15rem 0.5rem;
        background: var(--color-asciichem-accent-soft, #faf5e0);
        color: var(--color-asciichem-accent, #baa300);
        border-radius: 0.25rem; font-size: 0.95rem; font-weight: 700;
        font-family: var(--font-mono, monospace);
        margin-bottom: 0.35rem;
      }
      .learn-card-explain {
        margin: 0; font-size: 0.85rem; line-height: 1.45;
        color: var(--sl-color-text, #333);
      }
      .learn-card-close {
        background: none; border: none; font-size: 1.25rem;
        color: var(--sl-color-gray-3, #999); cursor: pointer;
        padding: 0; line-height: 1; flex-shrink: 0;
      }
      .learn-card-close:hover { color: var(--sl-color-text, #333); }
      @keyframes learnCardInCli {
        from { transform: translateY(20px) scale(0.95); opacity: 0; }
        to { transform: translateY(0) scale(1); opacity: 1; }
      }
      @keyframes learnCardOutCli {
        to { transform: translateY(20px) scale(0.95); opacity: 0; }
      }
      @media (max-width: 640px) {
        .learn-card { bottom: 4.5rem; right: 1rem; left: 1rem; max-width: none; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(card);
  card.querySelector(".learn-card-close")?.addEventListener("click", () => {
    card.style.animation = "learnCardOutCli 0.2s ease-in forwards";
    setTimeout(() => card.remove(), 200);
  });
  setTimeout(() => {
    if (card.parentElement) {
      card.style.animation = "learnCardOutCli 0.2s ease-in forwards";
      setTimeout(() => card.remove(), 200);
    }
  }, 6000);
}

// --- Quiz game state ---------------------------------------------------

interface QuizQuestion { q: string; a: string; }
interface QuizState { questions: QuizQuestion[]; idx: number; correct: number; total: number; }
let quizState: QuizState | null = null;

function generateQuizQuestions(count: number): QuizQuestion[] {
  const pool: QuizQuestion[] = [
    { q: "What is the atomic number of Carbon?", a: "6" },
    { q: "What is the atomic number of Oxygen?", a: "8" },
    { q: "What is the atomic number of Gold?", a: "79" },
    { q: "What is the atomic number of Iron?", a: "26" },
    { q: "What is the atomic number of Hydrogen?", a: "1" },
    { q: "What element has the symbol Na?", a: "sodium" },
    { q: "What element has the symbol K?", a: "potassium" },
    { q: "What element has the symbol Fe?", a: "iron" },
    { q: "What element has the symbol Au?", a: "gold" },
    { q: "What element has the symbol Pb?", a: "lead" },
    { q: "What element has the symbol Hg?", a: "mercury" },
    { q: "What element has the symbol Ag?", a: "silver" },
    { q: "What is the symbol for Sodium?", a: "Na" },
    { q: "What is the symbol for Potassium?", a: "K" },
    { q: "What is the symbol for Iron?", a: "Fe" },
    { q: "What is the symbol for Helium?", a: "He" },
    { q: "What is the symbol for Magnesium?", a: "Mg" },
    { q: "What is the symbol for Calcium?", a: "Ca" },
    { q: "How many atoms are in one mole? (scientific notation)", a: "6.022e23" },
    { q: "What gas makes up 78% of Earth's atmosphere?", a: "nitrogen" },
    { q: "What is the lightest element?", a: "hydrogen" },
    { q: "What is the most abundant element in the universe?", a: "hydrogen" },
    { q: "What element is diamond made of?", a: "carbon" },
    { q: "What is the only liquid metal at room temperature?", a: "mercury" },
    { q: "What noble gas is used in 'neon' signs (orange-red)?", a: "neon" },
  ];
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// --- Console API -------------------------------------------------------

function compose(formula: string): void {
  const sound = (window as any).asciichemSound;
  if (!sound) { console.log("Sound engine not loaded."); return; }
  if (!sound.isEnabled()) {
    sound.setEnabled(true);
    sound.ensureContext();
  }
  const atoms = extractAtoms(formula);
  if (atoms.length === 0) {
    console.log(`%c🎵 No atoms found in "${formula}". Try: H_2O, CH_4, C_6H_12O_6`, "color: #e06633");
    return;
  }
  const atomList = atoms.map((a) => a.count > 1 ? `${a.element}×${a.count}` : a.element).join(" + ");
  console.log(
    `%c🎵 Playing %c${formula}%c\n%c   Atoms: %c${atomList}%c\n%c   Each element → unique tone (pentatonic scale by atomic number)`,
    "color: #baa300; font-weight: bold;",
    "color: #e7d67a; font-weight: bold; font-size: 1.2em;",
    "color: #666;",
    "color: #666;",
    "color: #baa300; font-family: monospace;",
    "color: #666;",
    "color: #888; font-size: 0.85em;",
  );
  sound.playSequence(atoms);
  showLearnCard(formula, `${atomList}. Each element plays a unique tone based on its atomic number.`);
  unlock("composer");
}

function extractAtoms(formula: string): Array<{ element: string; count: number }> {
  const atoms: Array<{ element: string; count: number }> = [];
  const clean = formula.replace(/\([^)]*\)/g, "").replace(/\^[0-9ICXV]+/g, "");
  const re = /([A-Z][a-z]?)(?:_(\d+))?/g;
  let m;
  while ((m = re.exec(clean)) !== null) {
    const el = m[1];
    const count = m[2] ? parseInt(m[2], 10) : 1;
    if (ELEMENTS[el] || el.length <= 2) atoms.push({ element: el, count });
  }
  return atoms;
}

function sing(): void {
  const sound = (window as any).asciichemSound;
  if (!sound) return;
  if (!sound.isEnabled()) { sound.setEnabled(true); sound.ensureContext(); }

  const order = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne",
    "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca"];
  console.log(`%c🎼 Singing the periodic table: ${order.join(" · ")}`, "color: #baa300; font-weight: bold;");
  sound.playSequence(order.map((el) => ({ element: el, count: 1 })));
  unlock("singer");
}

function fact(element: string): void {
  const sym = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  const info = ELEMENTS[sym];
  if (!info) {
    console.log(`%c🤷 No data for "${element}". Try: H, He, C, O, Fe, Au, Hg, Pb, U`, "color: #e06633");
    return;
  }
  const randomFact = info.facts[Math.floor(Math.random() * info.facts.length)];
  console.log(
    `%c${sym}%c — %c${info.name}%c (Z=${info.z}, ${info.mass} u)\n%c${randomFact}`,
    "color: #e7d67a; font-weight: bold; font-size: 1.5em;",
    "color: #666;",
    "color: #baa300; font-weight: bold;",
    "color: #666;",
    "color: #1a1a1a; font-size: 1.1em;",
  );
  showLearnCard(sym, `${info.name} (Z=${info.z}). In AsciiChem, just type the symbol: ${sym}`);
  const sound = (window as any).asciichemSound;
  if (sound?.isEnabled()) sound.playAtom(sym, { duration: 0.5 });
}

function quiz(): void {
  quizState = { questions: generateQuizQuestions(5), idx: 0, correct: 0, total: 5 };
  console.log("%c🧪 AsciiChem Element Quiz — 5 questions", "color: #baa300; font-weight: bold; font-size: 1.2em;");
  console.log("%cType your answer: asciichem.a(\"your answer\")", "color: #666; font-style: italic;");
  askNext();
}

function askNext(): void {
  if (!quizState) return;
  const q = quizState.questions[quizState.idx];
  console.log(
    `%cQuestion ${quizState.idx + 1}/${quizState.total}: %c${q.q}`,
    "color: #baa300; font-weight: bold;",
    "color: #1a1a1a;",
  );
}

function answer(input: string): void {
  if (!quizState) {
    console.log("%cNo active quiz. Start one with asciichem.quiz()", "color: #e06633");
    return;
  }
  const q = quizState.questions[quizState.idx];
  const normalized = input.toLowerCase().trim();
  const correct = normalized === q.a.toLowerCase();
  if (correct) {
    quizState.correct++;
    console.log("%c✅ Correct!", "color: #e7d67a; font-weight: bold;");
    const sound = (window as any).asciichemSound;
    if (sound?.isEnabled()) sound.playAtom("C", { duration: 0.15, gain: 0.5 });
  } else {
    console.log(`%c❌ Nope. The answer was: %c${q.a}`, "color: #e06633;", "color: #baa300; font-weight: bold;");
    const sound = (window as any).asciichemSound;
    if (sound?.isEnabled()) sound.playAtom("H", { duration: 0.3, gain: 0.3 });
  }
  quizState.idx++;
  if (quizState.idx >= quizState.total) {
    console.log(
      `%c🏁 Quiz complete! %c${quizState.correct}/${quizState.total}%c correct.`,
      "color: #baa300; font-weight: bold; font-size: 1.2em;",
      "color: #e7d67a; font-weight: bold;",
      "color: #666;",
    );
    if (quizState.correct >= 4) unlock("quiz-master");
    quizState = null;
  } else {
    askNext();
  }
}

function weight(formula: string): void {
  const atoms = extractAtoms(formula);
  if (atoms.length === 0) {
    console.log(`%c🤷 Could not parse "${formula}"`, "color: #e06633");
    return;
  }
  let total = 0;
  const breakdown: string[] = [];
  for (const atom of atoms) {
    const info = ELEMENTS[atom.element];
    if (info) {
      const contrib = info.mass * atom.count;
      total += contrib;
      breakdown.push(`${atom.count > 1 ? `${atom.count}` : ""}${atom.element} (${info.mass} × ${atom.count} = ${contrib.toFixed(3)})`);
    }
  }
  console.log(
    `%c⚖️ Molecular weight of %c${formula}%c: %c${total.toFixed(3)} g/mol`,
    "color: #baa300; font-weight: bold;",
    "color: #e7d67a; font-weight: bold;",
    "color: #666;",
    "color: #baa300; font-weight: bold; font-size: 1.3em;",
  );
  console.log(`%c  ${breakdown.join(" + ")}`, "color: #666; font-size: 0.9em;");
  const sound = (window as any).asciichemSound;
  if (sound?.isEnabled()) {
    const freq = 200 + Math.min(total * 2, 800);
    sound.ensureContext();
    const ctx = (sound as any).ensureContext();
    if (ctx) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = freq;
      osc.type = "triangle";
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1);
      osc.connect(gain); gain.connect(ctx.destination);
      osc.start(); osc.stop(ctx.currentTime + 1);
    }
  }
  unlock("alchemist");
}

function decay(element: string, isotopeNum?: number): void {
  const sym = element.charAt(0).toUpperCase() + element.slice(1).toLowerCase();
  const info = ELEMENTS[sym];
  if (!info) {
    console.log(`%c🤷 Unknown element "${element}"`, "color: #e06633");
    return;
  }
  const iso = isotopeNum || (info.z + Math.ceil(info.mass - info.z));
  console.log(
    `%c☢️ Simulating decay of %c${sym}-${iso}%c (half-life simulation)`,
    "color: #baa300; font-weight: bold;",
    "color: #e7d67a; font-weight: bold;",
    "color: #666;",
  );
  const sound = (window as any).asciichemSound;
  if (!sound?.isEnabled()) return;
  sound.ensureContext();
  let remaining = 100;
  let step = 0;
  const interval = setInterval(() => {
    remaining *= 0.5;
    step++;
    const count = Math.max(1, Math.round(remaining / 10));
    for (let i = 0; i < count; i++) {
      const freq = 800 - step * 80 + Math.random() * 100;
      sound.playAtom("H", { duration: 0.05, gain: 0.2 });
    }
    console.log(`%c  Step ${step}: ${remaining.toFixed(1)}% remaining`, "color: #666;");
    if (remaining < 1) {
      clearInterval(interval);
      console.log("%c☢️ Fully decayed. ☠️", "color: #e06633; font-weight: bold;");
      sound.playAtom("Au", { duration: 1, gain: 0.5 });
    }
  }, 800);
}

function mole(): void {
  console.log("%c🕳️ Celebrating one mole — Avogadro's number!", "color: #baa300; font-weight: bold; font-size: 1.2em;");
  moleEffect();
  const sound = (window as any).asciichemSound;
  if (sound?.isEnabled()) {
    sound.playSequence([
      { element: "C", count: 1 }, { element: "O", count: 1 },
      { element: "H", count: 1 }, { element: "N", count: 1 },
    ]);
  }
  unlock("mole-day");
}

function gold(): void {
  ensureFxStyles();
  applyEffect("fx-gold");
  console.log("%c🥇 Everything is now golden! (asciichem.reset() to undo)", "color: #b8860b; font-weight: bold; font-size: 1.2em;");
  unlock("gold-rush");
}

function caffeine(): void {
  ensureFxStyles();
  applyEffect("fx-caffeine", 10000);

  const badge = document.createElement("div");
  badge.className = "focus-badge";
  badge.innerHTML = `
    <span>⚡</span>
    <span>HYPER FOCUS</span>
    <div class="focus-bar"><div class="focus-bar-fill"></div></div>
  `;
  document.body.appendChild(badge);
  setTimeout(() => badge.remove(), 10000);

  console.log("%c☕ Hyper focus activated! The world fades away — 10 seconds of peak concentration.", "color: #baa300; font-weight: bold; font-size: 1.1em;");
  unlock("caffeinated");
}

function neon(): void {
  ensureFxStyles();
  applyEffect("fx-neon");
  console.log("%c💡 Neon lights! (asciichem.reset() to undo)", "color: #ff00de; font-weight: bold; font-size: 1.2em;");
  unlock("neon-nights");
}

function entropy(): void {
  ensureFxStyles();
  applyEffect("fx-entropy");
  document.querySelectorAll<HTMLElement>("p, li, h1, h2, h3, img, code, a").forEach((el) => {
    const rx = (Math.random() - 0.5) * 30;
    const ry = (Math.random() - 0.5) * 30;
    const rot = (Math.random() - 0.5) * 10;
    el.style.transform = `translate(${rx}px, ${ry}px) rotate(${rot}deg)`;
  });
  console.log("%c🌪️ Entropy increases. The universe tends toward chaos. (asciichem.reset() to restore order)", "color: #666; font-weight: bold; font-style: italic;");
  unlock("entropic");
}

function reset(): void {
  applyEffect("");
  document.querySelectorAll<HTMLElement>("*").forEach((el) => {
    el.style.transform = "";
  });
  console.log("%c✨ Back to normal.", "color: #baa300; font-weight: bold;");
}

function achievements(): void {
  const unlocked = getUnlocked();
  console.log(
    `%c🏆 Achievements %c${unlocked.size}%c/%c${ACHIEVEMENTS.length}%c unlocked`,
    "color: #baa300; font-weight: bold; font-size: 1.3em;",
    "color: #e7d67a; font-weight: bold;",
    "color: #666;",
    "color: #baa300; font-weight: bold;",
    "color: #666;",
  );
  ACHIEVEMENTS.forEach((a) => {
    const got = unlocked.has(a.id);
    console.log(
      `%c  ${got ? a.icon : "🔒"}  ${got ? "" : "???"} ${got ? a.name : ""} %c${got ? a.desc : ""}`,
      got ? "color: #baa300; font-weight: bold;" : "color: #ccc;",
      got ? "color: #666; font-size: 0.9em;" : "color: #ccc; font-size: 0.9em;",
    );
  });
  if (unlocked.size === ACHIEVEMENTS.length) {
    console.log("%c⚗️  You are the ULTIMATE ALCHEMIST. All achievements unlocked!", "color: #ffd700; font-weight: bold; font-size: 1.5em;");
  }
}

function help(): void {
  const unlocked = getUnlocked();
  console.log(
    "%c╔═══════════════════════════════════════════════════════════╗\n" +
    "║     🧪  AsciiChem Easter Egg Console  🧪                  ║\n" +
    "║     ASCII in, chemistry out — and fun too!                ║\n" +
    "╚═══════════════════════════════════════════════════════════╝",
    "color: #baa300; font-weight: bold; font-size: 13px;",
  );

  const cat = (icon: string, label: string) =>
    console.log(`%c${icon} ${label}`, "color: #e7d67a; font-weight: bold; font-size: 13px; margin-top: 4px;");

  const cmd = (syntax: string, desc: string) =>
    console.log(`%c  ${syntax.padEnd(34)}%c${desc}`,
      "color: #b8860b; font-family: monospace;",
      "color: #666;");

  cat("🎵", "SOUND & MUSIC");
  cmd('asciichem.compose("H_2O")', "Play any molecule as music");
  cmd("asciichem.sing()", "The periodic table melody");
  cmd('asciichem.fact("Au")', "Random element fact + tone");

  cat("🎮", "GAMES");
  cmd("asciichem.quiz()", "5-question element quiz");
  cmd('asciichem.a("your answer")', "Answer a quiz question");
  cmd("asciichem.achievements()", `Badge collection (${unlocked.size}/${ACHIEVEMENTS.length})`);

  cat("⚗️", "CHEMISTRY");
  cmd('asciichem.weight("H_2O")', "Molecular weight calculator");
  cmd('asciichem.decay("C", 14)', "Radioactive decay simulation");
  cmd("asciichem.mole()", "Avogadro's number celebration");

  cat("🌈", "VISUAL EFFECTS");
  cmd("asciichem.gold()", "Turn everything golden 🥇");
  cmd("asciichem.caffeine()", "Hyper focus mode ☕");
  cmd("asciichem.neon()", "Neon glow mode 💡");
  cmd("asciichem.entropy()", "Embrace the chaos 🌪️");
  cmd("asciichem.reset()", "Return to normal ✨");

  cat("🔮", "SYNTAX TRIGGERS — type anywhere on the site to learn");
  cmd('"H_2O"', "🌧️ Teaches subscripts: _2 means ×2");
  cmd('"Au"', "🥇 Teaches element symbols: Au = gold");
  cmd('"Ne"', "💡 Teaches noble gases (sine waveform)");
  cmd('"^14C"', "☢️ Teaches prefix isotopes");
  cmd('"Ca^2+"', "⚡ Teaches charges (number-then-sign)");
  cmd('"Fe^(II)"', "🔬 Teaches oxidation states");
  cmd('"<=>"', "⚖️ Teaches equilibrium arrows");
  cmd('"2H_2 + O_2"', "💥 Teaches stoichiometry + reactions");
  cmd('"caffeine"', "☕ Hyper focus + caffeine formula C_8H_10N_4O_2");

  cat("🎮", "GAMES (also on /playground/)");
  cmd("Visit /playground/", "Quiz, Molecule Builder, Sound Player");
  cmd("Or click the 🎮 button", "Bottom-right corner of every page");

  cat("🏆", `ACHIEVEMENTS (${unlocked.size}/${ACHIEVEMENTS.length})`);
  ACHIEVEMENTS.forEach((a) => {
    const got = unlocked.has(a.id);
    console.log(`%c  ${got ? a.icon : "🔒"} ${got ? a.name : "???"}%c${got ? " — " + a.desc : ""}`,
      got ? "color: #baa300;" : "color: #ccc;", got ? "color: #888; font-size: 0.85em;" : "");
  });

  console.log(
    "\n%c💡 Try: %casciichem.compose(\"C_8H_10N_4O_2\")%c (that's caffeine!)\n",
    "color: #666;", "color: #b8860b; font-family: monospace; font-weight: bold;", "color: #666;",
  );
  unlock("reader");
}

// --- Register globally -------------------------------------------------

const cli = {
  help,
  compose,
  sing,
  fact,
  quiz,
  a: answer,
  answer,
  weight,
  decay,
  mole,
  gold,
  caffeine,
  neon,
  entropy,
  reset,
  achievements,
  unlock: (id: string) => unlock(id),
  _unlock: unlock,
  _elements: ELEMENTS,
};

if (typeof window !== "undefined") {
  (window as any).asciichem = cli;
  if (!(window as any).help) {
    (window as any).help = help;
  }
  if (!(window as any).a) {
    (window as any).a = answer;
  }
}

export { cli, unlock, getUnlocked };
export default cli;
