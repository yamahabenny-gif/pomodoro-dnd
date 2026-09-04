import { head, tail, write } from './_dir.mjs'

/* ══ RICHTUNG A · Ölgemälde am Lagerfeuer ═══════════════════════════════
   Eine Lichtquelle, tiefe Dunkelheit, gemalte Tiefe. Chiaroscuro:
   Die Oberfläche verschwindet fast, das Feuer trägt alles.            */

const css = `
    body{background:#08060a;font-family:"Cormorant Garamond",Georgia,serif;color:#e9d9be}
    .disp{font-family:"Cinzel",Georgia,serif;letter-spacing:.06em}
    .num{font-variant-numeric:tabular-nums}
    /* Bedienelemente treten aus dem Dunkel, statt darauf zu liegen */
    .act{position:relative;display:inline-flex;align-items:center;gap:11px;
      min-height:52px;padding:14px 26px;border-radius:3px;cursor:pointer;
      font-family:"Cinzel",serif;font-size:14px;font-weight:600;letter-spacing:.14em;
      text-transform:uppercase;color:#f6e4c2;background:transparent;
      border:1px solid rgba(214,152,74,.34);
      box-shadow:inset 0 1px 0 rgba(255,206,138,.14), inset 0 -14px 26px rgba(0,0,0,.55),
                 0 10px 28px -12px rgba(0,0,0,.9);
      text-shadow:0 0 18px rgba(255,150,60,.5), 0 1px 0 rgba(0,0,0,.8)}
    .act:hover{border-color:rgba(255,183,96,.62);color:#fff2d8;
      box-shadow:inset 0 1px 0 rgba(255,214,150,.24), inset 0 -14px 26px rgba(0,0,0,.45),
                 0 0 34px -6px rgba(255,150,60,.4), 0 10px 28px -12px rgba(0,0,0,.9)}
    .act:focus-visible{outline:2px solid #ffbe6a;outline-offset:3px}
    .obj{background:none;border:0;cursor:pointer;color:inherit;font-family:inherit;
      display:flex;flex-direction:column;align-items:center;gap:10px;padding:12px 16px;
      min-height:52px;border-radius:4px}
    .obj:hover{background:radial-gradient(60% 60% at 50% 45%,rgba(255,146,52,.14),transparent 72%)}
    .obj:focus-visible{outline:2px solid #ffbe6a;outline-offset:2px}
    .obj span{font-family:"Cinzel",serif;font-size:11px;font-weight:600;letter-spacing:.2em;
      text-transform:uppercase;color:#a98a63;text-shadow:0 1px 0 rgba(0,0,0,.8)}
    .obj:hover span{color:#ffcf90;text-shadow:0 0 16px rgba(255,150,60,.6)}
    ::selection{background:#d6984a;color:#0d0a08}`

write('RichtungA.dc.html', head('family=Cinzel:wght@500;600;700&family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400', css) + `
<div style="width:1280px;height:900px;position:relative;overflow:hidden;background:#08060a">

  <!-- ── Gemalter Grund: Luftperspektive in vier Ebenen ── -->
  <svg viewBox="0 0 1280 900" style="position:absolute;inset:0;width:100%;height:100%" aria-hidden="true">
    <defs>
      <radialGradient id="glut" cx="50%" cy="72%" r="62%">
        <stop offset="0%" stop-color="#ffb463" stop-opacity=".92"/>
        <stop offset="14%" stop-color="#f08a34" stop-opacity=".62"/>
        <stop offset="34%" stop-color="#b4501d" stop-opacity=".34"/>
        <stop offset="62%" stop-color="#511f14" stop-opacity=".18"/>
        <stop offset="100%" stop-color="#08060a" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="himmel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#0d1424"/><stop offset="42%" stop-color="#141527"/>
        <stop offset="76%" stop-color="#180f13"/><stop offset="100%" stop-color="#0a0709"/>
      </linearGradient>
      <linearGradient id="fern" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#1b2137" stop-opacity=".85"/>
        <stop offset="100%" stop-color="#0e0c14" stop-opacity=".95"/>
      </linearGradient>
      <linearGradient id="mittel" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#161520"/><stop offset="100%" stop-color="#090710"/>
      </linearGradient>
      <linearGradient id="boden" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#2a170e"/><stop offset="40%" stop-color="#150c09"/>
        <stop offset="100%" stop-color="#070506"/>
      </linearGradient>
      <filter id="dunst" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="16"/></filter>
      <filter id="weich" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="30"/></filter>
      <filter id="lasur" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="4" seed="7"/>
        <feColorMatrix type="saturate" values="0"/>
        <feComponentTransfer><feFuncA type="linear" slope=".055"/></feComponentTransfer>
        <feComposite operator="in" in2="SourceGraphic"/></filter>
    </defs>

    <rect width="1280" height="900" fill="url(#himmel)"/>
    <g opacity=".5">
      <circle cx="1092" cy="118" r="1.4" fill="#dfe6ff"/><circle cx="1148" cy="186" r="1" fill="#c8d4ff"/>
      <circle cx="996" cy="88" r="1.2" fill="#eef2ff"/><circle cx="1214" cy="132" r="1.6" fill="#dfe6ff"/>
      <circle cx="884" cy="146" r=".9" fill="#c8d4ff"/><circle cx="1046" cy="212" r="1.1" fill="#dfe6ff"/>
      <circle cx="164" cy="104" r="1.3" fill="#dfe6ff"/><circle cx="268" cy="168" r="1" fill="#c8d4ff"/>
      <circle cx="92" cy="196" r="1.5" fill="#eef2ff"/><circle cx="352" cy="122" r=".9" fill="#c8d4ff"/>
    </g>

    <!-- ferne Bergkette, entsättigt und aufgehellt: Luftperspektive -->
    <path d="M0 486 L128 402 L232 452 L336 372 L452 448 L556 396 L668 462 L788 386 L908 458 L1024 404 L1148 468 L1280 414 L1280 900 L0 900Z"
      fill="url(#fern)" filter="url(#dunst)" opacity=".72"/>
    <!-- Mittelgrund: Baumkante -->
    <path d="M0 566 L64 512 L108 552 L166 486 L214 540 L272 498 L318 556 L382 504 L438 560 L498 512 L556 566 L620 520 L682 570 L746 516 L806 566 L872 522 L930 572 L996 526 L1058 574 L1122 530 L1188 578 L1280 534 L1280 900 L0 900Z"
      fill="url(#mittel)"/>
    <path d="M0 566 L64 512 L108 552 L166 486 L214 540 L272 498 L318 556 L382 504 L438 560 L498 512 L556 566 L620 520 L682 570 L746 516 L806 566 L872 522 L930 572 L996 526 L1058 574 L1122 530 L1188 578 L1280 534"
      fill="none" stroke="#3a2a1c" stroke-width="1.6" opacity=".5"/>

    <!-- Lichtungsboden -->
    <ellipse cx="640" cy="784" rx="620" ry="188" fill="url(#boden)"/>
    <!-- Das Feuer als einzige Lichtquelle -->
    <ellipse cx="640" cy="712" rx="520" ry="290" fill="url(#glut)" filter="url(#weich)"/>

    <!-- Baumstämme, vom Feuer angeschnitten -->
    <g opacity=".92">
      <path d="M148 900 L162 508 L186 506 L196 900Z" fill="#0d0a0c"/>
      <path d="M162 508 L186 506 L184 640 L166 642Z" fill="#3a2314" opacity=".55"/>
      <path d="M1094 900 L1104 496 L1130 494 L1146 900Z" fill="#0d0a0c"/>
      <path d="M1104 496 L1130 494 L1128 632 L1108 634Z" fill="#3a2314" opacity=".5"/>
      <path d="M292 900 L300 552 L316 550 L324 900Z" fill="#0b090b"/>
      <path d="M964 900 L972 540 L988 538 L998 900Z" fill="#0b090b"/>
    </g>

    <!-- Zelt, Rückseite im Dunkeln, Vorderkante im Feuerschein -->
    <path d="M232 806 L376 596 L520 806Z" fill="#120d0f"/>
    <path d="M376 596 L520 806 L448 806 L376 640Z" fill="#5a3418" opacity=".62"/>
    <path d="M376 596 L520 806" stroke="#c07a34" stroke-width="1.6" opacity=".5"/>
    <path d="M376 640 L376 806" stroke="#2a1c12" stroke-width="2"/>

    <!-- Sitzende Gestalt: Silhouette mit Randlicht -->
    <g>
      <path d="M796 806 c0-52 22-88 54-88 s54 36 54 88Z" fill="#0a0709"/>
      <circle cx="850" cy="690" r="26" fill="#0a0709"/>
      <path d="M824 700 a26 26 0 0 0 26 16 v-42 a26 26 0 0 0-26 26Z" fill="#ffb463" opacity=".2"/>
      <path d="M796 806 c0-52 22-88 54-88 v88Z" fill="#f0913c" opacity=".13"/>
      <path d="M826 668 a26 26 0 0 1 6-4" stroke="#ffcf90" stroke-width="2" fill="none" opacity=".7"/>
      <path d="M800 782 c2-40 20-64 44-64" stroke="#ffb463" stroke-width="2" fill="none" opacity=".5"/>
    </g>

    <!-- Feuerstelle -->
    <g>
      <ellipse cx="640" cy="806" rx="96" ry="26" fill="#0c0809"/>
      <path d="M566 806 l40-34 M714 806 l-40-34 M600 812 h80" stroke="#2e1c10" stroke-width="7" stroke-linecap="round"/>
      <path d="M576 800 l52-40 M704 800 l-52-40" stroke="#4a2c16" stroke-width="6" stroke-linecap="round" opacity=".9"/>
      <ellipse cx="640" cy="792" rx="52" ry="16" fill="#c2541c" opacity=".55" filter="url(#dunst)"/>
      <path d="M640 664 c34 40 52 62 52 88 a52 52 0 0 1-104 0 c0-26 18-48 52-88Z" fill="#f5911f" opacity=".9" filter="url(#weich)"/>
      <path d="M640 700 c22 28 34 42 34 60 a34 34 0 0 1-68 0 c0-18 12-32 34-60Z" fill="#ffc35e"/>
      <path d="M640 736 c12 16 18 24 18 34 a18 18 0 0 1-36 0 c0-10 6-18 18-34Z" fill="#fff0c0"/>
      <circle cx="612" cy="620" r="2.4" fill="#ffb463" opacity=".7"/>
      <circle cx="672" cy="586" r="1.8" fill="#ffcf90" opacity=".6"/>
      <circle cx="648" cy="546" r="1.4" fill="#ffb463" opacity=".45"/>
    </g>

    <!-- Lasur über allem: nimmt die digitale Sauberkeit heraus -->
    <rect width="1280" height="900" filter="url(#lasur)" fill="#c8a06a" opacity=".5"/>
    <rect width="1280" height="900" fill="none"
      style="box-shadow:inset 0 0 200px 60px #000"/>
    <radialGradient id="vig" cx="50%" cy="62%" r="78%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity=".82"/></radialGradient>
    <rect width="1280" height="900" fill="url(#vig)"/>
  </svg>

  <!-- ── Oberfläche: schwebt im Licht, hat keinen eigenen Kasten ── -->
  <div style="position:relative;height:100%;display:flex;flex-direction:column;
    justify-content:space-between;padding:44px 56px">

    <div style="display:flex;align-items:flex-start;justify-content:space-between">
      <h1 class="disp" style="font-size:14px;font-weight:600;letter-spacing:.4em;
        margin:0;color:#c9a373;text-shadow:0 0 20px rgba(255,150,60,.35),0 1px 0 rgba(0,0,0,.8)">
        POMODORO&nbsp;D&amp;D</h1>
      <div style="display:flex;align-items:center;gap:9px;color:#a98a63;font-size:13px;
        text-shadow:0 1px 0 rgba(0,0,0,.8)">Mara · Magier · Stufe&nbsp;7</div>
    </div>

    <!-- ── Textinsel im dunklen Himmel: liest sich gegen die Nacht, nicht gegen das Feuer ── -->
    <div style="max-width:420px;display:flex;flex-direction:column;gap:18px;margin-top:6px">
      <div class="disp" style="font-size:12px;font-weight:600;letter-spacing:.28em;
        text-transform:uppercase;color:#e0a05c;text-shadow:0 0 16px rgba(255,150,60,.5),0 1px 0 rgba(0,0,0,.8)">
        Rast am Lagerfeuer</div>
      <div class="num" style="font-size:64px;font-weight:700;line-height:1;color:#f6e4c2;
        text-shadow:0 0 26px rgba(255,150,60,.4),0 2px 4px rgba(0,0,0,.85)">07:14</div>
      <p style="font-size:17px;line-height:1.5;color:#e9d9be;margin:0;
        text-shadow:0 1px 3px rgba(0,0,0,.85)">
        Zeit für eine Rast. Steh auf, streck dich, trink was.</p>
      <p style="font-size:13px;line-height:1.5;color:#a98a63;margin:0;max-width:46ch;
        text-shadow:0 1px 3px rgba(0,0,0,.85)">
        Nach dieser Rast wartet Quest&nbsp;3 von&nbsp;4. Danach die lange Rast in der Taverne.</p>

      <div style="display:flex;align-items:center;gap:22px;margin-top:8px">
        <button class="act">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="1.5" stroke-linecap="round" aria-hidden="true">
            <path d="M9.4 5.6v12.8M14.6 5.6v12.8"/></svg>
          Rast anhalten
        </button>
        <button class="obj" style="flex-direction:row;padding:10px 4px">
          <span style="text-decoration:underline;text-underline-offset:3px">Rast überspringen</span>
        </button>
      </div>
    </div>

    <!-- ── Truhen-Hinweis: unten, außerhalb des Feuerscheins, kaum lauter als ein Flüstern ── -->
    <div style="display:flex;align-items:center;gap:10px;color:#8a7a5f;font-size:12.5px;
      text-shadow:0 1px 3px rgba(0,0,0,.85);max-width:480px">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#8a7a5f"
        stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3.6 9.4h16.8v9.8H3.6V9.4Z"/><path d="M3.6 9.4 6.2 4.8h11.6l2.6 4.6"/>
        <path d="M3.6 13.2h16.8"/><path d="M10.4 13.2h3.2v3h-3.2v-3Z"/></svg>
      Eine ungeöffnete Truhe wartet in deinem Gepäck — sie läuft nicht weg.
    </div>
  </div>
</div>` + tail)
