/*
 * Hand-written SEO copy for the catalogue's parent products, keyed by the slug
 * `parse.ts` produces. `parse.ts` merges these into the manifest; parts get copy
 * generated from their fits/finish (see `partCopy` below).
 *
 *   blurb       — one line: cards + the <meta> / og:description
 *   description — the full product-page copy, blank line between paragraphs
 *
 * No prices here — they change. Every price lives in the variant table + the
 * JSON-LD offers + the on-page price UI, all rendered live from the variants.
 *
 * Re-generated into catalog.sql on `npm run catalog:sql`.
 */
export type Copy = { blurb: string; description: string };

const SPC_LINE =
  "Sold by Street Pro Culture, a motorcycle gear shop in Paco, Manila. Reserve online for in-store pickup or nationwide delivery — pay by GCash, Maya, GrabPay, card, or cash on collection.";

export const DESCRIPTIONS: Record<string, Copy> = {
  // ── X-Land — motorcycle top cases ──────────────────────────────────────
  "x-land-s-series-top-case": {
    blurb:
      "X-Land S-Series 45L motorcycle top case — hard-plastic rear box that locks to a standard luggage rack, room for one full-face helmet.",
    description: `The X-Land S-Series is the entry-level top case in the X-Land line: a 45-litre hard-plastic rear box that bolts to a standard motorcycle luggage rack and locks shut, swallowing a full-face helmet or a day's shopping without a bungee net in sight.

External size is 42×36×34 cm. It ships in black.

${SPC_LINE}`,
  },
  "x-land-h-series-aluminium-top-case": {
    blurb:
      "X-Land H-Series aluminium top case in 45 / 55 / 65 L — 1.2 mm alloy shell, lockable, mounts to a standard rear rack. Five finishes.",
    description: `The X-Land H-Series is X-Land's core aluminium top case — a 1.2 mm alloy shell with welded seams, a weather lip and a barrel lock, built for commuters and weekend tourers who want a box that shrugs off knocks and looks the part.

Pick your capacity: 45 L holds one full-face helmet, 55 L takes a helmet plus a jacket, and 65 L is a genuine two-up touring box. External sizes run 42×36×34 cm to 57×38×34 cm. Every size comes in Black, Silver, Chrome Black, Colorful and Special Silver — 15 combinations in all. Sizes and part numbers are listed on this page.

${SPC_LINE}`,
  },
  "x-land-m-series-aluminium-top-case": {
    blurb:
      "X-Land M-Series aluminium top case, 45 / 55 / 65 L — smooth-sided 1.2 mm alloy shell, lockable rear box in black or silver.",
    description: `The X-Land M-Series is a cleaner-lined 1.2 mm aluminium top case for riders who want the alloy build without the textured panels — a smooth-sided lockable rear box in three capacities.

45, 55 and 65 L, each in Black or Silver. External sizes 42×36×34 cm to 57×38×34 cm. It mounts to a standard motorcycle luggage rack.

${SPC_LINE}`,
  },
  "x-land-y-series-aluminium-top-case": {
    blurb:
      "X-Land Y-Series heavy-duty aluminium top case — thicker 1.5 mm alloy shell, 45 / 55 / 65 L, black or silver.",
    description: `The X-Land Y-Series is the heavy-duty option: the same lockable X-Land top-case design in a thicker 1.5 mm aluminium alloy for riders loading the box hard — long tours, rough roads, daily heavy use.

Three capacities (45 / 55 / 65 L) in Black or Silver, external sizes 42×36×34 cm to 57×38×34 cm. Fits a standard rear luggage rack.

${SPC_LINE}`,
  },

  // ── NZI Fibra — Spanish fibreglass helmets ────────────────────────────
  "nzi-fibra-atto-duo": {
    blurb:
      "NZI Fibra Atto Duo modular helmet — Spanish fibreglass flip-up with a drop-down sun visor and a clear outer visor. Four graphics.",
    description: `The NZI Fibra Atto Duo is a modular (flip-up) helmet from NZI of Spain, built on a fibreglass shell and finished to European ECE safety standards. The chin bar lifts for a full open-face feel at the lights; drop the internal sun visor and you're covered without swapping the clear outer visor.

Four finishes — Olas Black & Blue, Olas Black & Red, Matt Black and White. Each ships with a clear visor fitted.

${SPC_LINE}`,
  },
  "nzi-fibra-exa-duo": {
    blurb:
      "NZI Fibra Exa Duo full-face helmet — fibreglass shell, dual-visor (clear outer + drop-down sun visor). Bobber, Braden and Delvon graphics.",
    description: `The NZI Fibra Exa Duo is a dual-visor full-face from NZI Spain — a fibreglass shell with a built-in retractable sun visor alongside the clear outer visor, so you're set for a bright ride home without carrying a tinted spare.

Four graphics — Bobber White & Red, Bobber White & Grey, Braden Black & Neon Matt and Delvon Black & Red — each with a clear visor included.

${SPC_LINE}`,
  },
  "nzi-fibra-giga": {
    blurb:
      "NZI Fibra Giga full-face helmet — lightweight Spanish fibreglass shell, single clear visor, seven graphics.",
    description: `The NZI Fibra Giga is NZI Spain's everyday full-face: a light fibreglass lay-up, a wide single clear visor and a snug fit favoured by commuters and cafe riders. Built to European ECE standards.

Seven finishes — Veneno Antracite, Tecno Black & Orange, Falcon Black & Pink Matt, Global Black & Red Matt, Global Black & Blue, Venom Black & Red and Solid Noveau White. Graphic names and part numbers are on this page.

${SPC_LINE}`,
  },
  "nzi-fibra-byte-stream": {
    blurb:
      "NZI Fibra Byte Stream full-face helmet — fibreglass shell, single clear visor, three graphics.",
    description: `The NZI Fibra Byte Stream is a single-visor full-face from NZI Spain on a fibreglass shell — a straightforward, road-legal lid for daily riding.

Three finishes — Extreme Black & Antracite & Red, Plieger Blue & White & Red and Matt Black — each with a clear visor fitted.

${SPC_LINE}`,
  },
  "nzi-fibra-one-bit": {
    blurb:
      "NZI Fibra One Bit open-face helmet — fibreglass three-quarter lid with a clear flip visor, seven graphics.",
    description: `The NZI Fibra One Bit is a fibreglass open-face (three-quarter) helmet from NZI Spain — the classic cafe and city silhouette with a clip-in clear visor and an ECE-standard build.

Seven finishes across the Lander, Thunder and Solid Nouveau lines. Colourways and part numbers are listed below.

${SPC_LINE}`,
  },

  // ── CGM Italia — full-face ─────────────────────────────────────────────
  "cgm-361-avent": {
    blurb:
      "CGM 361 Avent Pro — carbon-shell full-face helmet from CGM Italia, Pinlock 70 anti-fog lens included. Four carbon finishes.",
    description: `The CGM 361 Avent Pro is CGM Italia's flagship full-face: a real carbon-fibre shell for low weight and high rigidity, with a Pinlock 70 anti-fog lens already in the box and the visor pinned to take it. Built to European ECE standards.

Four carbon finishes across the Avent Pro and Avent Pro Sport lines — Carbon Nero Opaco, Carbon Nero, Carbon Rosso Opaco and Carbon Giallo Fluo Opaco.

${SPC_LINE}`,
  },
  "cgm-363-shot": {
    blurb:
      "CGM 363 Shot full-face helmet — CGM Italia, high-performance terpolymer shell, Pinlock 70-ready visor. Mono, Race, Nippo and Run graphics.",
    description: `The CGM 363 Shot is a sport-styled full-face from CGM Italia on a high-performance terpolymer shell, with a visor that's already pinned for a Pinlock 70 anti-fog lens (lens optional, DKS002CGMCL). ECE-standard European build.

Five finishes across the Mono, Race, Nippo and Run lines — colourways and part numbers on this page.

${SPC_LINE}`,
  },
  "cgm-333-onyx": {
    blurb:
      "CGM 333 Onyx full-face helmet — CGM Italia, terpolymer shell, Pinlock 70-ready visor. Nine Mono and Sport colourways.",
    description: `The CGM 333 Onyx is CGM Italia's value full-face — a high-performance terpolymer shell, a wide clear visor pinned for a Pinlock 70 anti-fog lens (optional, DKS002CGMCL), and an easy all-day fit. Built to European ECE safety standards.

Nine colourways: the plain-styled Mono line (Nero Opaco, Blu Satinato, Grafite Opaco, Bianco) and the graphic Sport line (Nero Rosso Opaco, Grigio Verde Fluo Opaco, Nero Giallo Fluo Opaco, Blu Giallo Fluo, Grigio Rosa Fluo). Every colourway and its part number is listed below.

${SPC_LINE}`,
  },
  "cgm-311-blast": {
    blurb:
      "CGM 311 Blast full-face helmet — CGM Italia, terpolymer shell with a Fog City anti-fog insert included. Ten graphics.",
    description: `The CGM 311 Blast is a graphic-heavy full-face from CGM Italia built on a terpolymer shell, and it ships with a Fog City anti-fog insert already included — clear vision on cold and wet mornings with nothing extra to buy. ECE-standard European build.

Ten finishes across the Mono, Sport, Maya, Race, Jelly and Skull lines. Colourways and part numbers are on this page.

${SPC_LINE}`,
  },
  "cgm-330-riot": {
    blurb:
      "CGM 330 Riot full-face helmet — CGM Italia's most affordable full-face, terpolymer shell, Pinlock 70-ready visor. Six graphics.",
    description: `The CGM 330 Riot is CGM Italia's most affordable full-face — a terpolymer shell, a clear visor pinned for a Pinlock 70 anti-fog lens (optional), and bold youth-market graphics. A solid first proper helmet, built to European ECE standards.

Six finishes across the Mono, Sport, Ripper, Space and Undead lines — see the table below for colourways and part numbers.

${SPC_LINE}`,
  },

  // ── CGM Italia — modular (flip-up) ─────────────────────────────────────
  "cgm-560-mad": {
    blurb:
      "CGM 560 Mad modular helmet — CGM Italia, fibreglass shell flip-up with a Pinlock 70 lens included and a drop-down sun visor.",
    description: `The CGM 560 Mad is CGM Italia's premium modular (flip-up) helmet: a fibreglass shell, an internal drop-down sun visor, and a Pinlock 70 anti-fog lens already in the box. Ride it closed as a full-face or flip the chin bar up at a stop. ECE-standard European build.

Four finishes across the Mad Mono and Mad Ride lines — Nero Opaco, Bianco, Nero Rosso Opaco and Grafite Giallo Fluo Opaco.

${SPC_LINE}`,
  },
  "cgm-568-ber": {
    blurb:
      "CGM 568 Ber modular helmet — CGM Italia flip-up on a terpolymer shell with a drop-down sun visor, Pinlock 70-ready. Eight colourways.",
    description: `The CGM 568 Ber is a mid-range modular from CGM Italia — a terpolymer-shell flip-up with an internal sun visor and a clear outer visor pinned for a Pinlock 70 anti-fog lens (optional). Full-face protection with open-face convenience at the lights. Built to European ECE standards.

Eight finishes across the Mono, Dresda and Sport lines. Colourways and part numbers are listed on this page.

${SPC_LINE}`,
  },
  "cgm-569-c-max": {
    blurb:
      "CGM 569 C-Max modular helmet — CGM Italia flip-up, terpolymer shell, drop-down sun visor, Pinlock 70-ready. Ten colourways.",
    description: `The CGM 569 C-Max is CGM Italia's everyday modular (flip-up) helmet — a terpolymer shell, an internal drop-down sun visor and a clear visor pinned for a Pinlock 70 anti-fog lens (optional). A practical touring and commuting lid. ECE-standard European build.

Ten finishes across the C-Max Mono and C-Max City lines — see the table below for every colourway and part number.

${SPC_LINE}`,
  },

  // ── CGM Italia — jet / open-face ───────────────────────────────────────
  "cgm-160-jad": {
    blurb:
      "CGM 160 Jad jet helmet — CGM Italia fibreglass open-face with a clear visor, Pinlock 70-ready. Five finishes.",
    description: `The CGM 160 Jad is a premium jet (open-face) helmet from CGM Italia on a fibreglass shell, with a clear flip-down visor pinned for a Pinlock 70 anti-fog lens (optional). The classic three-quarter shape with a proper Italian build. ECE-standard.

Five finishes across the Jad Mono and Jad Ride lines — Nero Opaco, Blu Satinato, Bianco, Nero Rosso Opaco and Grafite Giallo Fluo Opaco.

${SPC_LINE}`,
  },
  "cgm-136-rna": {
    blurb:
      "CGM 136 RNA jet helmet — CGM Italia open-face in carbon or terpolymer, Pinlock 70 lens included. 13 finishes.",
    description: `The CGM 136 RNA is CGM Italia's jet (open-face) helmet, offered in two builds: a carbon-fibre shell for the RNA Pro and Pro Street lines, and a high-performance terpolymer shell for the Mono, Race and Sport lines. Every version ships with a Pinlock 70 anti-fog lens and meets European ECE standards.

13 finishes in total. Shell material, colourway and part number for each are listed on this page.

${SPC_LINE}`,
  },
  "cgm-127-deep": {
    blurb:
      "CGM 127 Deep jet helmet — CGM Italia open-face, terpolymer shell, clear visor, Pinlock 70-ready. Ten finishes.",
    description: `The CGM 127 Deep is a jet (open-face) helmet from CGM Italia on a terpolymer shell, with a clear flip visor pinned for a Pinlock 70 anti-fog lens (optional). A clean, city-friendly three-quarter lid. Built to European ECE standards.

Ten finishes across the Mono, Race, Rune and Freaker lines — colourways and part numbers below.

${SPC_LINE}`,
  },
  "cgm-116-air": {
    blurb:
      "CGM 116 Air jet helmet — CGM Italia's lightweight open-face on a terpolymer shell with a clear visor. Six finishes.",
    description: `The CGM 116 Air is CGM Italia's light, no-fuss jet (open-face) helmet — a terpolymer shell and a clear flip visor, made for short city hops and scooter riders. ECE-standard European build.

Six finishes across the Air Mono and Air Bico lines — Nero Opaco, Verde Opaco, Bianco, Bigio, Grafite Giallo Fluo Opaco and Bianco Blu.

${SPC_LINE}`,
  },
  "cgm-167-flo": {
    blurb:
      "CGM 167 Flo jet helmet — CGM Italia open-face with a choice of long or shape visor. 34 colourway and visor combinations.",
    description: `The CGM 167 Flo is CGM Italia's most-configurable jet (open-face) helmet — a terpolymer shell offered with two visor profiles: the Long visor for maximum coverage, or the shorter Shape visor for a retro cut. Built to European ECE standards.

Six style lines — Mono, City, Bico, Joy, Sport and Dot — across a wide colour range, each available with either visor, for 34 combinations in all. Pick your exact colourway and visor from the table below; each has its own part number.

${SPC_LINE}`,
  },
  "cgm-191-pix": {
    blurb:
      "CGM 191 Pix jet helmet — compact CGM Italia open-face with long- or shape-visor options. 18 combinations.",
    description: `The CGM 191 Pix is a compact jet (open-face) helmet from CGM Italia — a terpolymer shell with a slim profile, offered with a Long visor or a shorter Shape visor. ECE-standard European build.

Style lines Mono, Sprint, It and Vintage across several colourways, each with a choice of visor — 18 combinations. Colourways, visor type and part numbers are on this page.

${SPC_LINE}`,
  },

  // ── SKAP — CGM Italia's value line ────────────────────────────────────
  "skap-3mh-speeder": {
    blurb:
      "SKAP 3MH Speeder full-face helmet — value line from CGM Italia, terpolymer shell, Pinlock 70-ready visor. Six graphics.",
    description: `The SKAP 3MH Speeder is a full-face helmet from SKAP, CGM Italia's value brand — a terpolymer shell and a clear visor pinned for a Pinlock 70 anti-fog lens (optional), at a keen price. Built to European ECE standards.

Six finishes across the Speeder Mono, Sport and Rainbow lines. Colourways and part numbers below.

${SPC_LINE}`,
  },
  "skap-5th-falcon": {
    blurb:
      "SKAP 5TH Falcon modular helmet — flip-up from CGM Italia's value line, terpolymer shell, Pinlock 70-ready. Four finishes.",
    description: `The SKAP 5TH Falcon is a modular (flip-up) helmet from SKAP, CGM Italia's value brand — a terpolymer-shell flip-up with a clear visor pinned for a Pinlock 70 anti-fog lens (optional). Full-face and open-face in one, at an entry price. ECE-standard.

Four finishes across the Falcon Mono and Sport lines — Nero Opaco, Antracite Satinato, Bianco and Nero Giallo Fluo Opaco.

${SPC_LINE}`,
  },
  "skap-1lh-luke": {
    blurb:
      "SKAP 1LH Luke jet helmet — affordable open-face from CGM Italia's value line, terpolymer shell. Six finishes.",
    description: `The SKAP 1LH Luke is a jet (open-face) helmet from SKAP, CGM Italia's value brand — a simple terpolymer-shell three-quarter lid for city riding and scooters, at the sharp end of the range. Built to European ECE standards.

Six finishes across the Luke Mono and Sport lines — colourways and part numbers on this page.

${SPC_LINE}`,
  },
};

/** Generated copy for a grouped spare-part product. */
export function partCopy(
  name: string,
  info: { fits: string; type: string; tints: string[]; profiles: string[] },
): Copy {
  const { fits, tints, profiles } = info;

  // Pinlock 70 lens
  if (/pinlock/i.test(name)) {
    return {
      blurb:
        "Genuine CGM Pinlock 70 anti-fog lens — clips inside a Pinlock-ready visor to stop it misting up. In stock at Street Pro Culture, Manila.",
      description: `The Pinlock 70 lens is a thin inner shield that snaps onto the pins inside a Pinlock-ready visor and seals against it, forming a double-glazed pane that stays clear in cold and wet weather.

Pick the lens that matches your helmet — most CGM and SKAP models take the standard DKS002CGMCL; the 361 Avent Pro and 560 Mad use their own. Your helmet's spec sheet says which, and each part number is listed on this page.

${SPC_LINE}`,
    };
  }

  // Fog City insert
  if (/fog city/i.test(name)) {
    return {
      blurb:
        "CGM Fog City anti-fog insert for the CGM 311 Blast — a stick-on inner film that keeps the visor clear in cold and wet weather. In stock at Street Pro Culture, Manila.",
      description: `The Fog City insert is a self-adhesive anti-fog film that presses onto the inside of the visor. It's the anti-fog fix for the CGM 311 Blast, which isn't cut for a Pinlock lens.

${SPC_LINE}`,
    };
  }

  // Top-case back cushion
  if (/cushion/i.test(name)) {
    return {
      blurb:
        "X-Land top case back cushion — a padded backrest that fixes inside the lid so a pillion has something to lean on. In stock at Street Pro Culture, Manila.",
      description: `A padded backrest pad for X-Land aluminium top cases. It attaches to the inside of the case lid and gives a pillion passenger a comfortable place to rest against on longer rides.

Fits the X-Land H, M and Y-Series cases.

${SPC_LINE}`,
    };
  }

  // NZI's clear visor — one product, a variant per helmet model
  if (/clear visor$/i.test(name)) {
    return {
      blurb: `Genuine NZI Fibra replacement visor — a clear outer visor, one to match each helmet model. In stock at Street Pro Culture, Manila.`,
      description: `A factory replacement clear outer visor for ${fits}. There's a specific visor for each model — Atto Duo, Exa Duo, Giga and Byte Stream — so pick the one that matches your helmet from the list below.

It clips on with the helmet's own visor mechanism, no tools.

${SPC_LINE}`,
    };
  }

  // Visor (default) — one product per helmet model
  const model = name.replace(/\s+visor$/i, "");
  const has = (re: RegExp) => tints.some((t) => re.test(t));
  const tintBits: string[] = [];
  if (has(/clear/i)) tintBits.push("clear for everyday and night riding");
  if (has(/smoke/i)) tintBits.push("smoke 50% for bright days");
  if (has(/iridium/i))
    tintBits.push("an iridium mirror finish that cuts glare hardest");
  const tintList = tints
    .map((t) => t.toLowerCase())
    .join(", ")
    .replace(/, ([^,]+)$/, tints.length > 2 ? ", and $1" : " and $1");
  const tintSentence = tintBits.length
    ? ` Choose ${tintBits.join(", ").replace(/, ([^,]+)$/, tintBits.length > 2 ? ", or $1" : " or $1")}.`
    : "";
  const profileSentence = profiles.length
    ? ` It comes in ${profiles
        .map((p) => p.toLowerCase())
        .join(" and ")} profiles — order the one your helmet shipped with.`
    : "";

  return {
    blurb: `Genuine replacement visor for the ${model}, available in ${tintList || "clear"}. In stock at Street Pro Culture, Manila.`,
    description: `A factory replacement outer visor for the ${model}, so a scratched, cracked or hazed visor never keeps you off the bike.${tintSentence}${profileSentence} It swaps on using the helmet's own visor mechanism — no tools.

${SPC_LINE}`,
  };
}
