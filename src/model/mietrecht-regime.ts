// ============================================================
// mietrecht-regime.ts — provisorische Mietrechts-Logik
//
// Nicht die lineare Kantensumme. Knoten mit Schwellen und
// Produkten, eine Phase Verzug, kein Fixpunkt.
//
// Quelle und Grenzen: docs/recherche/CH/CH-012-mietpreisinitiative-gegenvorschlag-2026.md
//
// PROVISORISCH:
// - anteil_altliegenschaft und mietluecke sind nicht belegt und
//   fehlen im Stadt-Kontext. Fehlend ist nicht «null Prozent».
// - FRONTLOAD, VERWEIL_GEWICHT, CAP_INVEST_WEIGHT sind nicht kalibriert.
// - Die Regime-Zustände laufen nicht über den gemeinsamen Nenner
//   (E1_NENNER, compute-phases.ts) und sind nicht kalibriert.
// ============================================================

import type { CityContext, MarketState, ParamsDiff40, ParamValue } from '../types';
import { clamp } from './utils';

/**
 * Gleicher Wert wie `PERSISTENCE` in compute-phases.ts.
 * Hier dupliziert, damit kein Import-Zyklus entsteht.
 * Nicht unabhängig ändern.
 */
const REGIME_PERSISTENCE = 0.8;

/**
 * Orts- und Quartierüblichkeit gilt im Status quo als nicht
 * durchgesetzt. Badran behauptet, noch nie habe ein Bundesgericht
 * den Nachweis als erbracht beurteilt (Tagesanzeiger, 27.09.2026).
 * Das ist eine Behauptung, keine Fallauswertung. Deshalb 0, nicht
 * eine geschätzte kleine Zahl.
 *
 * Der Rang (BGE 144 III 514: Erstellung oder letzter Erwerb
 * ≥ 30 Jahre vor Mietbeginn) bleibt davon getrennt und wird erst
 * verwendet, wenn `anteil_altliegenschaft` gesetzt ist.
 */
export const WIRKSAMKEIT_OQU = 0;

/**
 * Mitte der 80/90-Prozent-Überwälzung des LIK im BWO-Bericht
 * vom 25.09.2026 (Reformpfad Vergleichsmiete und Indexierung).
 * Nicht 80 und nicht 90: der Gegenvorschlag hat die Zahl noch
 * nicht festgelegt.
 */
export const LIK_PASS_THROUGH = 0.85;

/**
 * Vorladung gesperrter Teuerung in die Anfangsmiete.
 * Nicht kalibriert. Größenordnung offen; der Genfer Abstand im
 * Kommentar von phase-weights.ts ist ein Ziel, kein eingesetzter Wert.
 */
export const FRONTLOAD = 0.4;

/** Nicht kalibriert. Gewicht der Mietlücke auf die Verweildauer der nächsten Phase. */
export const VERWEIL_GEWICHT = 0.5;

/**
 * Abzug auf Investition und Angebot, nur wenn der Deckel bindet,
 * die Durchsetzung über 0 liegt und eine Mietlücke gesetzt ist.
 * Nicht kalibriert. Der Gegenvorschlag (Tor auf, Deckel zu) bekommt
 * hier kein Vorzeichen.
 */
export const CAP_INVEST_WEIGHT = 0.3;

/**
 * Anteil des Investitionsabzugs, der auf das Angebotspotenzial durchschlägt.
 * Nicht kalibriert. 0.5 = ein bindender, vollzogener Deckel trifft das
 * Angebot halb so stark wie die Investitionsbereitschaft. Richtung nach
 * GLOBAL-029 (restriktives Mietrecht drückt den Neubau), Grösse eine Setzung:
 * die Studie nimmt Neubau, der vom Deckel ausgenommen ist, ausdrücklich aus.
 */
export const CAP_ANGEBOT_ANTEIL = 0.5;

/**
 * Anteil der Teuerung, der im Referenzzins-Regime (Index 0) auf den
 * laufenden Mietzins überwälzt werden darf: 40 Prozent, entsprechend dem
 * angenommenen Eigenkapitalanteil des geltenden Modells (CH-012, NZZ
 * 18.1.2025 zur IAZI-Studie: «Die Teuerung fliesst heute zu 40 Prozent ein»).
 * Der Rest ist gesperrte Teuerung und kann in die Anfangsmiete vorgeladen
 * werden.
 */
export const REFERENZ_TEUERUNG_PASS_THROUGH = 0.4;

/**
 * Bins für `ctx:teuerung`, geeicht an der BFS-LIK-Jahresteuerung
 * 2016–2025. Siehe CH-012. 2025 (+0.2 %) → −1.
 * Die Stufe ist eine Lage in der Reihe, keine Grösse: gerechnet wird mit
 * `TEUERUNG_STUFE_PROZENT`.
 */
export const TEUERUNG_BINS = {
  minus2: 'unter 0 %',
  minus1: '0 bis 0.5 %',
  zero: '0.5 bis 1.5 %',
  plus1: '1.5 bis 2.5 %',
  plus2: 'über 2.5 %',
} as const;

/**
 * Jahresteuerung in Prozent, für die jede Stufe von `ctx:teuerung` steht.
 * Nötig, weil die Stufe 0 NICHT null Teuerung ist: sie ist der Normalfall
 * der Reihe (0.5 bis 1.5 %). Null Teuerung liegt an der Grenze zwischen
 * −2 und −1. Wer die Stufe direkt als Grösse liest, rechnet eine tiefe,
 * aber positive Teuerung (2025: +0.2 %, Stufe −1) als Preisrückgang und
 * damit als Senkungsanspruch.
 *
 * Werte: Mitte des Bins aus `TEUERUNG_BINS` (0.25, 1.0, 2.0). Die beiden
 * offenen Rand-Bins sind eine Setzung, je eine halbe Bin-Breite jenseits
 * der Grenze: −0.5 % (BFS-LIK 2016: −0.4 %, 2020: −0.7 %) und 3.0 %
 * (2022: 2.8 %). Reihe in CH-012.
 */
export const TEUERUNG_STUFE_PROZENT: Record<-2 | -1 | 0 | 1 | 2, number> = {
  [-2]: -0.5,
  [-1]: 0.25,
  0: 1.0,
  1: 2.0,
  2: 3.0,
};

/**
 * Teuerung in Prozent, die im Regime dem Wert 1 entspricht: der Wert der
 * obersten Stufe. Damit bleibt Stufe +2 wie vor der Korrektur bei 1, und
 * die Skala bleibt in [−1, +1]. Setzung, nicht kalibriert: das Verhältnis
 * zu einem Schritt des Referenzzinssatzes (0.25 Punkte = 0.5) ist damit
 * nicht geeicht.
 */
export const TEUERUNG_REFERENZ_PROZENT = 3.0;

/**
 * Bins für `ctx:referenzzins_aenderung`: Veränderung des hypothekarischen
 * Referenzzinssatzes (BWO) über die letzten zwölf Monate. Der Satz bewegt
 * sich in Schritten von 0.25 Prozentpunkten; jeder Schritt begründet nach
 * VMWG Art. 13 eine Anpassung. Massgebend ist die Änderung, nicht das
 * Niveau. Stand 2.9.2026: 1.25 %, unverändert → 0. Siehe CH-012.
 * Provisorisch: die Zuordnung Schritt → Bin ist nicht kalibriert.
 */
export const REFERENZZINS_BINS = {
  minus2: 'Senkung um 0.5 Punkte oder mehr',
  minus1: 'Senkung um 0.25 Punkte',
  zero: 'unverändert',
  plus1: 'Erhöhung um 0.25 Punkte',
  plus2: 'Erhöhung um 0.5 Punkte oder mehr',
} as const;

export interface RegimeCarry {
  bestandsmiete: number;
  anfangsmiete: number;
  verweildauer: number;
  vergleichsbasis: number;
}

function normContext(value: number | undefined, fallback = 0): number {
  if (typeof value !== 'number') return fallback;
  return value / 2;
}

/**
 * Teuerung als Grösse mit echtem Nullpunkt: 0 = keine Teuerung,
 * 1 = `TEUERUNG_REFERENZ_PROZENT`. Fehlt der Kontextwert, gilt keine
 * Teuerung (0), nicht die Stufe 0.
 */
export function teuerungAlsGroesse(stufe: number | undefined): number {
  if (typeof stufe !== 'number') return 0;
  const prozent = TEUERUNG_STUFE_PROZENT[stufe as -2 | -1 | 0 | 1 | 2];
  if (typeof prozent !== 'number') return 0;
  return prozent / TEUERUNG_REFERENZ_PROZENT;
}

function levelFromDiff(
  diff: ParamsDiff40,
  key: keyof ParamsDiff40,
  fallback: ParamValue,
): ParamValue {
  const entry = diff[key];
  if (!entry) return fallback;
  return entry.to;
}

function enforcementIntensity(level: ParamValue): number {
  if (level === 2) return 1;
  if (level === 1) return 0.5;
  return 0;
}

/**
 * Ohne Diff gilt Index 0 (Referenzzinssatz). Das ist die Baseline
 * in switzerland.yaml, nicht die absoluten Werte der Testfixturen.
 */
function indexLevel(diff: ParamsDiff40): ParamValue {
  return levelFromDiff(diff, 'mietrecht_mietzinsindex', 0);
}

export function applyMietrechtRegime(
  linear: MarketState,
  context: CityContext,
  diff: ParamsDiff40,
  prev: RegimeCarry | null,
): { market: MarketState; carry: RegimeCarry } {
  const kriterium = levelFromDiff(diff, 'mietrecht_kriterium', 1);
  const durchsetzung = levelFromDiff(diff, 'mietrecht_durchsetzung', 0);
  const index = indexLevel(diff);
  const kostenmiete = levelFromDiff(diff, 'mietrecht_kostenmiete', 1);
  const enf = enforcementIntensity(durchsetzung);

  const anteil = context.anteil_altliegenschaft;
  let vergleichsmiete_aktiv = 0;
  if (kriterium === 2) {
    vergleichsmiete_aktiv = 1;
  } else if (kriterium === 1 && typeof anteil === 'number') {
    vergleichsmiete_aktiv = clamp(anteil, 0, 1) * WIRKSAMKEIT_OQU;
  }

  // Vier-Jahres-Anpassung an die Vergleichsmiete ist im BWO-Bericht
  // die Alternative zur laufenden Indexierung, kein eigener Schieber.
  // Provisorisch: im Gegenvorschlag folgt der Bestand der Basis nur,
  // wenn der Index auf dem Landesindex steht.
  const vergleich_bestand = kriterium === 2 && index === 1 ? 1 : 0;

  // Teuerung als Grösse, nicht als Stufe: Stufe −1 ist positive Teuerung.
  const teuerung = teuerungAlsGroesse(context.teuerung);
  // Referenzzins-Regime (Index 0): der Anspruch entsteht aus der ÄNDERUNG
  // des Satzes, nicht aus `ctx:zinsniveau`. Ein tiefes, unverändertes
  // Niveau ist kein laufender Senkungsanspruch.
  const zinsAenderung = normContext(context.referenzzins_aenderung, 0);
  const erhoehungsspielraum = index === 1
    ? teuerung * LIK_PASS_THROUGH
    : index === 2
      ? 0
      : zinsAenderung;

  const lueckeBekannt = typeof context.mietluecke === 'number';
  const start = lueckeBekannt ? clamp(context.mietluecke as number) : 0;
  const prevBestand = prev?.bestandsmiete ?? start;
  const prevAnfang = prev?.anfangsmiete ?? start;
  const prevVerweil = prev?.verweildauer ?? 0;
  const prevBasis = prev?.vergleichsbasis ?? 0;

  const deckelBindet = kriterium !== 2 && kostenmiete !== 0;
  const raise = Math.max(0, erhoehungsspielraum);
  const senkung = enf * Math.max(0, -erhoehungsspielraum);
  const pullBestand = deckelBindet ? enf * Math.max(0, prevBestand) : 0;

  let bestandZiel = prevBestand + raise - pullBestand - senkung;
  if (vergleich_bestand > 0) {
    bestandZiel += vergleich_bestand * (prevBasis - bestandZiel);
  }
  const bestandsmiete = clamp(
    REGIME_PERSISTENCE * prevBestand + (1 - REGIME_PERSISTENCE) * bestandZiel,
  );

  // Gesperrte Teuerung: der Teil der Teuerung, den das Regime im laufenden
  // Vertrag NICHT zulässt. In Teuerungs-Einheiten gerechnet, für jedes
  // Regime gleich. Früher `teuerung − erhoehungsspielraum`: im
  // Referenzzins-Regime wurde so ein Teuerungs-Bin gegen einen Zins-Bin
  // verrechnet.
  const teuerungsUeberwaelzung = index === 1
    ? LIK_PASS_THROUGH
    : index === 2
      ? 0
      : REFERENZ_TEUERUNG_PASS_THROUGH;
  const gesperrt = Math.max(0, teuerung) * (1 - teuerungsUeberwaelzung);
  // Nur eine positive Verweildauer lädt vor. Bei negativer Verweildauer
  // (Anfangsmiete unter Bestandsmiete) würde gesperrte Teuerung sonst die
  // Anfangsmiete SENKEN.
  const vorladung = FRONTLOAD * gesperrt * Math.max(0, prevVerweil) * (1 - enf);
  let anfangZiel = bestandsmiete + vorladung;
  if (vergleichsmiete_aktiv > 0) {
    anfangZiel += vergleichsmiete_aktiv * (prevBasis - anfangZiel);
  }
  if (deckelBindet) {
    anfangZiel -= enf * Math.max(0, anfangZiel);
  }
  const anfangsmiete = clamp(
    REGIME_PERSISTENCE * prevAnfang + (1 - REGIME_PERSISTENCE) * anfangZiel,
  );

  const verweildauer = clamp(
    REGIME_PERSISTENCE * prevVerweil + VERWEIL_GEWICHT * (anfangsmiete - bestandsmiete),
  );

  const umschlag = clamp(0.5 - verweildauer / 2, 0, 1);
  const vergleichsbasis = vergleichsmiete_aktiv > 0
    ? (1 - umschlag) * prevBasis + umschlag * (0.5 * bestandsmiete + 0.5 * anfangsmiete)
    : prevBasis;

  let investDelta = 0;
  let angebotDelta = 0;
  if (deckelBindet && enf > 0 && lueckeBekannt) {
    investDelta = -CAP_INVEST_WEIGHT * enf * (context.mietluecke as number);
    angebotDelta = investDelta * CAP_ANGEBOT_ANTEIL;
  }

  const market: MarketState = {
    ...linear,
    investitionsattraktivitaet: clamp(linear.investitionsattraktivitaet + investDelta),
    angebotspotenzial: clamp(linear.angebotspotenzial + angebotDelta),
    vergleichsmiete_aktiv,
    erhoehungsspielraum,
    bestandsmiete,
    anfangsmiete,
    verweildauer,
  };

  return {
    market,
    carry: { bestandsmiete, anfangsmiete, verweildauer, vergleichsbasis },
  };
}
