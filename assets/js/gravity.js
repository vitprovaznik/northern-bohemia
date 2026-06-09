/* ═══════════════════════════════════════════════
   ✏  NASTAVENÍ
═══════════════════════════════════════════════ */
/* slova se čtou z <h1 id="heading-source"> v HTML */
const h1El = document.getElementById("heading-source");

/*
 * Nezlomitelné předložky, spojky a částice rozdělené podle jazyka.
 * Aktivní sada se vybere automaticky podle atributu lang na <html>.
 * Přidejte nový jazyk jako další klíč v objektu níže.
 */
const NON_BREAKING_BY_LANG = {
  cs: new Set([
    "k",
    "s",
    "v",
    "z",
    "a",
    "i",
    "o",
    "u",
    "ke",
    "ku",
    "do",
    "na",
    "ne",
    "od",
    "po",
    "se",
    "si",
    "ve",
    "ze",
    "pro",
    "při",
    "než",
    "či",
    "co",
    "že",
    "aby",
    "ale",
    "ani",
    "jak",
    "bez",
    "nad",
    "pod",
    "před",
    "mezi",
    "skrz",
    "přes",
    "za",
  ]),
  de: new Set([
    "der",
    "die",
    "das",
    "dem",
    "den",
    "des",
    "ein",
    "eine",
    "eines",
    "einem",
    "einen",
    "einer",
    "in",
    "an",
    "am",
    "im",
    "um",
    "zu",
    "zur",
    "zum",
    "von",
    "vom",
    "beim",
    "mit",
    "nach",
    "aus",
    "bei",
    "seit",
    "für",
    "vor",
    "über",
    "unter",
    "auf",
    "bis",
    "ab",
    "durch",
    "und",
    "oder",
    "aber",
    "denn",
    "wenn",
    "als",
    "weil",
    "dass",
    "ob",
    "da",
    "wie",
  ]),
  pl: new Set([
    "w",
    "we",
    "z",
    "ze",
    "do",
    "na",
    "po",
    "pod",
    "przy",
    "ku",
    "nad",
    "za",
    "przez",
    "bez",
    "dla",
    "od",
    "nie",
    "czy",
    "że",
    "ale",
    "bo",
    "jak",
    "ni",
    "co",
    "i",
    "o",
    "u",
    "a",
  ]),
  en: new Set(["a", "an", "the", "of"]),
};

/* přečíst jazyk z <html lang="..."> — např. "cs-CZ" → "cs" */
const _pageLang = (document.documentElement.lang || "")
  .split("-")[0]
  .toLowerCase();
const NON_BREAKING = NON_BREAKING_BY_LANG[_pageLang] || new Set();

/* průchod 1 — sloučit nezlomitelné předložky/spojky s následujícím slovem */
const _raw = h1El ? h1El.textContent.trim().split(/\s+/).filter(Boolean) : [];
const _words1 = [];
let _i = 0;
while (_i < _raw.length) {
  if (_i + 1 < _raw.length && NON_BREAKING.has(_raw[_i].toLowerCase())) {
    _words1.push(_raw[_i] + "\u00A0" + _raw[_i + 1]);
    _i += 2;
  } else {
    _words1.push(_raw[_i]);
    _i++;
  }
}

/* průchod 2 — sloučit sousední krátká slova (počet znaků obou dohromady < 5) */
const words = [];
let _j = 0;
while (_j < _words1.length) {
  const curr = _words1[_j];
  if (_j + 1 < _words1.length) {
    const next = _words1[_j + 1];
    const currLen = curr.replace(/\u00A0/g, "").length;
    const nextLen = next.replace(/\u00A0/g, "").length;
    if (currLen + nextLen < 5) {
      words.push(curr + "\u00A0" + next);
      _j += 2;
      continue;
    }
  }
  words.push(curr);
  _j++;
}

const CONFIG = {
  /* fyzika */
  attractorY: -900,
  force: 2.8e-4, // základní síla přitažení — větší = rychlejší nástup
  proximityBoostMax: 8, // jak moc se síla zesílí blízko stropu (1 = žádný, 15 = dramatický)
  /*
   * Rychlost závisí na šířce slova:
   *   frictionMin → nejkratší slovo → nejméně tření → nejrychlejší
   *   frictionMax → nejdelší slovo  → nejvíce tření → nejpomalejší
   */
  frictionMin: 0.02, // odpor vzduchu nejkratšího slova → letí nejrychleji
  frictionMax: 0.16, // odpor vzduchu nejdelšího slova  → letí nejpomaleji
  bounce: 0, // odrazivost při nárazu (0 = žádná, 1 = plná)
  horizontalBoost: 1.5, // zesílení horizontálního tahu ke středu osy x
  /* těžší blok — drží polohu po dopadu */
  density: 0.015, // hmotnost bloků — větší = těžší, méně se odstrčí při kolizi
  frictionStatic: 25.0, // statické tření — brání klouzání po dopadu (větší = pevnější)
  sleepThreshold: 1, // počet klidných kroků než blok usne (1 = co nejdříve)
  horizontalOffDelay: null, // ms po startu fyziky → vypnout tah ke středu (null = nikdy)
  /* timing */
  initialDelay: 400, // ms prodleva po načtení stránky, než se slova zobrazí
  staggerDelay: 150, // ms mezi postupným zobrazením každého slova
  physicsDelay: 400, // ms prodleva po zobrazení všech slov, než se spustí fyzika
  wordGap: 14, // px mezera mezi slovy ve výchozím rozvržení
  containerWidth: 1000, // px maximální šířka výchozího rozvržení (null = celý viewport)
  centerK: 2e-6, // síla pružiny sjíždění ke středu (větší = rychlejší středění)
  sideDelay: 440, // ms prodleva postranních slov po startu prostředního
  mouseStiffness: 0.16, // tuhost uchopení myší (0.05 = volné, 0.5 = pevné)
};
/* ════════════════════════════════════════════════ */

const {
  Engine,
  Runner,
  Bodies,
  Body,
  World,
  Events,
  Mouse,
  MouseConstraint,
  Query,
} = Matter;
const worldEl = document.getElementById("world");
const worldWrapper = document.getElementById("world-wrapper");

const W = worldWrapper ? worldWrapper.offsetWidth : window.innerWidth;
const H = worldWrapper ? worldWrapper.offsetHeight : window.innerHeight;
const CX = W / 2;

const engine = Engine.create({ gravity: { x: 0, y: 0 }, enableSleeping: true });
const ATTR = { x: CX, y: CONFIG.attractorY };

/* ── init ──────────────────────────────────────── */
function init() {
  /* ruler — čte font styly přímo z CSS třídy .word, takže font-size stačí měnit jen v CSS */
  const probe = document.createElement("div");
  probe.className = "word";
  probe.style.cssText =
    "position:fixed;top:-9999px;opacity:0;pointer-events:none;";
  document.body.appendChild(probe);
  const cs = window.getComputedStyle(probe);
  const rulerCSS =
    "position:fixed;visibility:hidden;top:-9999px;left:0;white-space:nowrap;line-height:1;" +
    `font-family:${cs.fontFamily};font-size:${cs.fontSize};` +
    `font-weight:${cs.fontWeight};letter-spacing:${cs.letterSpacing};` +
    `text-transform:${cs.textTransform};`;
  document.body.removeChild(probe);

  const ruler = document.createElement("span");
  ruler.style.cssText = rulerCSS;
  document.body.appendChild(ruler);

  function measure(text) {
    ruler.textContent = text;
    const r = ruler.getBoundingClientRect();
    return { w: r.width, h: r.height };
  }

  /* 1. naměřit rozměry všech slov */
  const dims = words.map((w) => {
    const { w: tw, h: th } = measure(w);
    return { bw: tw, bh: th };
  });

  const maxBW = Math.max(...dims.map((d) => d.bw));
  const minBW = Math.min(...dims.map((d) => d.bw));

  /* 2. responzivní zalamování do řádků
   *    containerWidth nastaví maximální šířku počátečního rozvržení;
   *    pokud je viewport užší, použije se viewport − 40 px */
  const maxRowW = Math.min(CONFIG.containerWidth ?? W, W - 40);

  const rows = [];
  let curRow = [],
    curRowW = 0;
  dims.forEach((dim, i) => {
    const needed = curRow.length > 0 ? CONFIG.wordGap + dim.bw : dim.bw;
    if (curRow.length > 0 && curRowW + needed > maxRowW) {
      rows.push(curRow);
      curRow = [i];
      curRowW = dim.bw;
    } else {
      curRow.push(i);
      curRowW += needed;
    }
  });
  if (curRow.length > 0) rows.push(curRow);

  /* 3. souřadnice každého slova — každý řádek vycentrován */
  const ROW_GAP = 10;
  const positions = {};
  let curY = 210;
  rows.forEach((row) => {
    const rh = Math.max(...row.map((i) => dims[i].bh));
    const rw =
      row.reduce((s, i) => s + dims[i].bw, 0) +
      CONFIG.wordGap * (row.length - 1);
    let x = CX - rw / 2;
    row.forEach((i) => {
      positions[i] = { sx: x + dims[i].bw / 2, sy: curY };
      x += dims[i].bw + CONFIG.wordGap;
    });
    curY += rh + ROW_GAP;
  });

  /* 4. fyzikální těla + HTML elementy */
  const items = words.map((word, i) => {
    const { bw, bh } = dims[i];
    const { sx, sy } = positions[i];

    /*
     * frictionAir se škáluje podle šířky bloku:
     *   kratší slovo → méně odporu → stoupá rychleji
     *   delší slovo  → více odporu → stoupá pomaleji
     */
    const t = maxBW > minBW ? (bw - minBW) / (maxBW - minBW) : 0.5;
    const frictionAir =
      CONFIG.frictionMin + t * (CONFIG.frictionMax - CONFIG.frictionMin);

    const body = Bodies.rectangle(sx, sy, bw, bh, {
      restitution: 0,
      friction: 0.95,
      frictionStatic: CONFIG.frictionStatic,
      density: CONFIG.density,
      frictionAir,
      sleepThreshold: CONFIG.sleepThreshold,
      angle: 0,
      label: word,
    });
    Body.setVelocity(body, { x: 0, y: 0 });

    const el = document.createElement("div");
    el.className = "word";
    el.textContent = word;
    Object.assign(el.style, {
      width: bw + "px",
      height: bh + "px",
    });
    worldEl.appendChild(el);

    return { body, el, bw, bh };
  });

  World.add(
    engine.world,
    items.map((d) => d.body),
  );

  /* počáteční pozice v DOM */
  function syncInitial() {
    items.forEach(({ body, el, bw, bh }) => {
      const x = body.position.x - bw / 2;
      const y = body.position.y - bh / 2;
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${body.angle}rad)`;
    });
  }
  syncInitial();

  /* stěny — strop spodní hranou přesně na y = 0 */
  const T = 500;
  World.add(engine.world, [
    Bodies.rectangle(CX, -T / 2, W * 6, T, { isStatic: true }), // strop  y = 0
    Bodies.rectangle(CX, H + T / 2, W * 6, T, { isStatic: true }), // podlaha y = H
    Bodies.rectangle(-T / 2, H / 2, T, H * 4, { isStatic: true }), // levá stěna
    Bodies.rectangle(W + T / 2, H / 2, T, H * 4, { isStatic: true }), // pravá stěna
  ]);

  /*
   * Levá překážka — fyzikální tělo se vytvoří dle rozměrů HTML elementu #left-barrier.
   * Pozici a velikost měňte v CSS, JS ji jen přečte.
   */
  const barrierEl = document.getElementById("left-barrier");
  if (barrierEl && barrierEl.offsetWidth > 0) {
    const r = barrierEl.getBoundingClientRect();
    World.add(
      engine.world,
      Bodies.rectangle(
        r.left + r.width / 2,
        r.top + r.height / 2,
        r.width,
        r.height,
        { isStatic: true, label: "left-barrier" },
      ),
    );
  }

  /* myš / touch */
  const mMouse = Mouse.create(worldEl);
  mMouse.element.removeEventListener("mousewheel", mMouse.mousewheel);
  mMouse.element.removeEventListener("DOMMouseScroll", mMouse.mousewheel);

  const mc = MouseConstraint.create(engine, {
    mouse: mMouse,
    constraint: {
      stiffness: CONFIG.mouseStiffness,
      damping: 0.22,
      render: { visible: false },
    },
  });
  World.add(engine.world, mc);

  worldEl.addEventListener("mousemove", () => {
    const over = Query.point(
      items.map((d) => d.body),
      mMouse.position,
    );
    worldEl.style.cursor = mc.body
      ? "grabbing"
      : over.length
        ? "grab"
        : "default";
  });

  /* příznaky sil — horizontální se vypne po horizontalOffDelay, všechny po +1 s navíc */
  let horizontalActive = true;
  let allForcesOff = false;

  Events.on(engine, "beforeUpdate", () => {
    items.forEach(({ body }) => {
      if (body === mc.body) return;
      if (allForcesOff) return; // vše zastaveno — žádné síly
      if (body.isSleeping) return;

      const dx = ATTR.x - body.position.x;
      const dy = ATTR.y - body.position.y;
      const d = Math.hypot(dx, dy) || 1;

      const boost = Math.max(
        1,
        Math.min(CONFIG.proximityBoostMax, H / Math.max(5, body.position.y)),
      );

      const hx = horizontalActive
        ? (dx / d) * CONFIG.force * body.mass * CONFIG.horizontalBoost +
          (CX - body.position.x) * CONFIG.centerK * body.mass
        : 0;

      Body.applyForce(body, body.position, {
        x: hx,
        y: (dy / d) * CONFIG.force * body.mass * boost,
      });
    });
  });

  Events.on(engine, "afterUpdate", () => {
    items.forEach(({ body, el, bw, bh }) => {
      const x = body.position.x - bw / 2;
      const y = body.position.y - bh / 2;
      el.style.transform = `translate3d(${x}px,${y}px,0) rotate(${body.angle}rad)`;
    });
  });

  /* ── časovaný start ────────────────────────────── */
  const runner = Runner.create();

  setTimeout(() => {
    items.forEach(({ el }, i) => {
      setTimeout(() => el.classList.add("visible"), i * CONFIG.staggerDelay);
    });

    const physStart =
      (items.length - 1) * CONFIG.staggerDelay + CONFIG.physicsDelay;
    setTimeout(() => {
      /*
       * Který index startuje první:
       *   lichý počet slov v řádku  → slovo nejblíže CX (geometrický střed)
       *   sudý počet slov v řádku   → nejlehčí slovo (nejmenší bw = nejkratší = nejrychlejší)
       */
      const firstRow = rows[0];
      const centerIdx =
        firstRow.length % 2 !== 0
          ? firstRow.reduce(
              (best, i) =>
                Math.abs(positions[i].sx - CX) <
                Math.abs(positions[best].sx - CX)
                  ? i
                  : best,
              firstRow[0],
            )
          : firstRow.reduce(
              (best, i) => (dims[i].bw < dims[best].bw ? i : best),
              firstRow[0],
            );
      items.forEach(({ body }, i) => {
        if (i !== centerIdx) Body.setStatic(body, true);
      });

      Runner.run(runner, engine);

      /* po horizontalOffDelay ms vypnout horizontální tah (null = nikdy) */
      if (CONFIG.horizontalOffDelay !== null) {
        setTimeout(() => {
          horizontalActive = false;
          setTimeout(() => {
            allForcesOff = true;
            items.forEach(({ body }) => {
              Body.setVelocity(body, { x: 0, y: 0 });
              Body.setAngularVelocity(body, 0);
            });
          }, 1000);
        }, CONFIG.horizontalOffDelay);
      }

      /* po prodlevě se postranní slova uvolní */
      setTimeout(() => {
        items.forEach(({ body }, i) => {
          if (i !== centerIdx) {
            Body.setStatic(body, false);
            Body.setVelocity(body, { x: 0, y: 0 });
          }
        });
      }, CONFIG.sideDelay);
    }, physStart);
  }, CONFIG.initialDelay);
}

Promise.all([
  document.fonts.load('400 100px "Bebas Neue"'),
  document.fonts.ready,
])
  .then(init)
  .catch(init);
