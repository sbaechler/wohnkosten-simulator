/**
 * Provisorische Mietrechts-Logik (CH-012).
 * Prüft Tore und Vorzeichen, nicht kalibrierte Beträge.
 */
import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import {
  alsSpielraum,
  ERHOEHUNG_REFERENZ_PROZENT,
  LIK_PASS_THROUGH,
  REFERENZ_TEUERUNG_PASS_THROUGH,
  REFERENZZINS_SCHRITT_PROZENT,
  referenzzinsAnpassungProzent,
  teuerungAlsGroesse,
  teuerungProzent,
} from '../../mietrecht-regime';
import type { CityContext, ParamsDiff } from '../../../types';

const ZH: CityContext = {
  ownershipBaseline: { privat: 0.39, institutionell: 0.3, genossenschaft: 0.175, oeffentlich: 0.076 },
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 1,
  marktenge: 2,
  teuerung: -1,
};

/**
 * ZH ohne Teuerung: isoliert den Zinsanteil des Referenzzins-Regimes.
 * Mit ZH (Teuerung −1 = 0.25 %) überwälzt das Regime 40 % davon (Art. 16 VMWG).
 */
const ZH_OHNE_TEUERUNG: CityContext = { ...ZH, teuerung: undefined };

/** 40 % von 0.25 % Teuerung, in der gemeinsamen Einheit. */
const ZH_TEUERUNGSANTEIL = alsSpielraum(REFERENZ_TEUERUNG_PASS_THROUGH * teuerungProzent(-1));

function last(context: CityContext, diff: ParamsDiff = {}) {
  invalidatePhasesCache();
  return [...computePhasePipeline(context, diff)].at(-1)!;
}

describe('Mietrecht-Regime, provisorisch', () => {
  it('Status quo: Vergleichsmieten-Tor bleibt zu, auch ohne gesetzten Altanteil', () => {
    const phase = last(ZH);
    expect(phase.marketState.vergleichsmiete_aktiv).toBe(0);
  });

  it('Gesetzter Altanteil öffnet das Tor im heutigen Recht nicht (Wirksamkeit 0)', () => {
    const phase = last({ ...ZH, anteil_altliegenschaft: 0.8 });
    expect(phase.marketState.vergleichsmiete_aktiv).toBe(0);
  });

  it('Gegenvorschlag öffnet das Tor, ohne die Investition per Vorzeichen zu senken', () => {
    const base = last(ZH);
    const gegen = last(ZH, {
      mietrecht_kriterium: { from: 1, to: 2 },
      mietrecht_mietzinsindex: { from: 0, to: 1 },
    });
    expect(gegen.marketState.vergleichsmiete_aktiv).toBe(1);
    expect(gegen.marketState.investitionsattraktivitaet)
      .toBeCloseTo(base.marketState.investitionsattraktivitaet, 5);
  });

  it('Ohne Durchsetzung bleibt die Bestandsmiete trotz tiefem Zins liegen', () => {
    // Zinsanteil isoliert: tiefes Niveau, keine Änderung, keine Teuerung → nichts.
    expect(last(ZH_OHNE_TEUERUNG).marketState.bestandsmiete).toBeCloseTo(0, 5);
    // Mit der Teuerung 2025 steigt sie leicht, um 40 % von 0.25 % je Phase,
    // über drei Phasen mit (1 − Persistenz) = 0.2 gewichtet. Kein Senkungsanspruch.
    expect(last(ZH).marketState.bestandsmiete).toBeCloseTo(3 * 0.2 * ZH_TEUERUNGSANTEIL, 9);
  });

  it('Tiefes, unverändertes Zinsniveau ist kein Senkungsanspruch: Durchsetzung allein senkt nichts', () => {
    // ZH: zinsniveau −1 (tief), Referenzzinssatz unverändert (Feld fehlt = 0).
    const durchsetzung: ParamsDiff = { mietrecht_durchsetzung: { from: 0, to: 2 } };
    const isoliert = last(ZH_OHNE_TEUERUNG, durchsetzung);
    expect(isoliert.marketState.erhoehungsspielraum).toBe(0);
    expect(isoliert.marketState.bestandsmiete).toBeCloseTo(0, 5);
    // Mit Teuerung: der Spielraum ist nur der Teuerungsanteil, der Zinsanteil 0.
    const phase = last(ZH, durchsetzung);
    expect(phase.marketState.erhoehungsspielraum).toBeCloseTo(ZH_TEUERUNGSANTEIL, 12);
    expect(phase.marketState.bestandsmiete).toBeGreaterThanOrEqual(0);
  });

  it('Initiative ohne gesetzte Mietlücke und ohne Zinsänderung senkt nichts (CH-012)', () => {
    const initiative: ParamsDiff = {
      mietrecht_kriterium: { from: 1, to: 0 },
      mietrecht_durchsetzung: { from: 0, to: 2 },
    };
    const isoliert = last({ ...ZH_OHNE_TEUERUNG, referenzzins_aenderung: 0 }, initiative);
    expect(isoliert.marketState.bestandsmiete).toBeCloseTo(0, 5);
    expect(isoliert.marketState.anfangsmiete).toBeCloseTo(0, 5);
    // Mit Teuerung 2025: nichts fällt unter null.
    const phase = last({ ...ZH, referenzzins_aenderung: 0 }, initiative);
    expect(phase.marketState.bestandsmiete).toBeGreaterThanOrEqual(0);
    expect(phase.marketState.anfangsmiete).toBeGreaterThanOrEqual(0);
  });

  it('Durchsetzung vollzieht eine Referenzzinssenkung, auch ohne gesetzte Mietlücke', () => {
    const gesenkt: CityContext = { ...ZH, referenzzins_aenderung: -1 };
    expect(last(gesenkt).marketState.bestandsmiete).toBeCloseTo(0, 5);
    const phase = last(gesenkt, { mietrecht_durchsetzung: { from: 0, to: 2 } });
    expect(phase.marketState.vergleichsmiete_aktiv).toBe(0);
    expect(phase.marketState.bestandsmiete).toBeLessThan(0);
  });

  it('Referenzzinserhöhung hebt die Bestandsmiete, unabhängig vom Zinsniveau', () => {
    const erhoeht = last({ ...ZH, referenzzins_aenderung: 1 });
    expect(erhoeht.marketState.erhoehungsspielraum).toBeGreaterThan(0);
    expect(erhoeht.marketState.bestandsmiete).toBeGreaterThan(0);
    // Das Niveau spielt keine Rolle: hoch und stabil = tief und stabil.
    const hochAberStabil = last({ ...ZH, zinsniveau: 2, referenzzins_aenderung: 0 });
    expect(hochAberStabil.marketState.bestandsmiete)
      .toBeCloseTo(last({ ...ZH, referenzzins_aenderung: 0 }).marketState.bestandsmiete, 12);
    const hochOhneTeuerung = last({ ...ZH_OHNE_TEUERUNG, zinsniveau: 2, referenzzins_aenderung: 0 });
    expect(hochOhneTeuerung.marketState.bestandsmiete).toBeCloseTo(0, 5);
  });

  it('Initiative mit gesetzter Lücke zieht die Bestandsmiete herunter und die Investition mit', () => {
    const offen = last({ ...ZH, mietluecke: 0.4, mietlueckeEstimated: true });
    const gezogen = last(
      { ...ZH, mietluecke: 0.4, mietlueckeEstimated: true },
      {
        mietrecht_kriterium: { from: 1, to: 0 },
        mietrecht_durchsetzung: { from: 0, to: 2 },
      },
    );
    expect(gezogen.marketState.bestandsmiete).toBeLessThan(offen.marketState.bestandsmiete);
    expect(gezogen.marketState.investitionsattraktivitaet)
      .toBeLessThan(offen.marketState.investitionsattraktivitaet);
  });

  it('Regime-Abzug auf die Investition wird nicht über die Phasen aufsummiert', () => {
    const ctx: CityContext = { ...ZH, mietluecke: 0.2, mietlueckeEstimated: true };
    const diff: ParamsDiff = { mietrecht_durchsetzung: { from: 0, to: 2 } };
    invalidatePhasesCache();
    const ohne = [...computePhasePipeline(ctx, {})];
    const mit = [...computePhasePipeline(ctx, diff)];
    const abzug = mit.map((p, i) =>
      p.marketState.investitionsattraktivitaet - ohne[i].marketState.investitionsattraktivitaet);
    // CAP_INVEST_WEIGHT (0.3) × Durchsetzung (1) × Mietlücke (0.2) = −0.06, in jeder Phase gleich.
    for (const a of abzug) expect(a).toBeCloseTo(-0.06, 5);
  });

  it('Gesperrte Teuerung senkt die Anfangsmiete nicht, wenn die Verweildauer negativ ist', () => {
    // Hohe Teuerung, Kostenbindung (Index 2) sperrt sie ganz. Die Lücke startet
    // die Bestandsmiete über der Anfangsmiete → Verweildauer wird negativ.
    const ctx: CityContext = { ...ZH, teuerung: 2, mietluecke: 0.5, mietlueckeEstimated: true };
    const diff: ParamsDiff = {
      mietrecht_mietzinsindex: { from: 0, to: 2 },
      mietrecht_durchsetzung: { from: 0, to: 1 },
    };
    invalidatePhasesCache();
    const phasen = [...computePhasePipeline(ctx, diff)];
    const ohneTeuerung = [...computePhasePipeline({ ...ctx, teuerung: 0 }, diff)];
    phasen.forEach((p, i) => {
      expect(p.marketState.anfangsmiete)
        .toBeGreaterThanOrEqual(ohneTeuerung[i].marketState.anfangsmiete - 1e-9);
    });
  });

  it('Index auf LIK erhöht das Schutzlevel nicht mehr', () => {
    const base = last(ZH);
    const lik = last(ZH, { mietrecht_mietzinsindex: { from: 0, to: 1 } });
    expect(lik.marketState.mietpreis_schutzlevel)
      .toBeCloseTo(base.marketState.mietpreis_schutzlevel, 5);
  });

  it('Tiefe, positive Teuerung (Stufe −1) ist im LIK-Regime kein Senkungsanspruch', () => {
    // LIK 2025: +0.2 %. Die Stufe −1 heisst «0 bis 0.5 %», nicht «Preise sinken».
    const diff: ParamsDiff = {
      mietrecht_mietzinsindex: { from: 0, to: 1 },
      mietrecht_durchsetzung: { from: 0, to: 2 },
    };
    const phase = last(ZH, diff);
    expect(phase.marketState.erhoehungsspielraum).toBeGreaterThan(0);
    expect(phase.marketState.bestandsmiete).toBeGreaterThanOrEqual(0);
  });

  it('Nur negative Teuerung (Stufe −2) gibt im LIK-Regime einen Senkungsanspruch', () => {
    const diff: ParamsDiff = {
      mietrecht_mietzinsindex: { from: 0, to: 1 },
      mietrecht_durchsetzung: { from: 0, to: 2 },
    };
    const phase = last({ ...ZH, teuerung: -2 }, diff);
    expect(phase.marketState.erhoehungsspielraum).toBeLessThan(0);
    expect(phase.marketState.bestandsmiete).toBeLessThan(0);
  });

  it('Erhöhungsspielraum im LIK-Regime steigt mit jeder Teuerungsstufe', () => {
    const lik: ParamsDiff = { mietrecht_mietzinsindex: { from: 0, to: 1 } };
    const werte = ([-2, -1, 0, 1, 2] as const).map(
      stufe => last({ ...ZH, teuerung: stufe }, lik).marketState.erhoehungsspielraum,
    );
    for (let i = 1; i < werte.length; i++) expect(werte[i]).toBeGreaterThan(werte[i - 1]);
  });

  it('Teuerung als Grösse: null liegt zwischen Stufe −2 und −1, fehlender Wert = keine Teuerung', () => {
    expect(teuerungAlsGroesse(-2)).toBeLessThan(0);
    expect(teuerungAlsGroesse(-1)).toBeGreaterThan(0);
    expect(teuerungAlsGroesse(2)).toBeCloseTo(3.0 / ERHOEHUNG_REFERENZ_PROZENT, 9);
    expect(teuerungAlsGroesse(undefined)).toBe(0);
  });
});

describe('Erhöhungsspielraum: eine Einheit für alle Regimes (Art. 13 und 16 VMWG)', () => {
  const LIK: ParamsDiff = { mietrecht_mietzinsindex: { from: 0, to: 1 } };
  const STUFEN = [-2, -1, 0, 1, 2] as const;
  const spielraum = (ctx: CityContext, diff: ParamsDiff = {}) =>
    last(ctx, diff).marketState.erhoehungsspielraum;
  /** Spielraum zurück in Prozent Mietzinsänderung. */
  const prozent = (ctx: CityContext, diff: ParamsDiff = {}) =>
    spielraum(ctx, diff) * ERHOEHUNG_REFERENZ_PROZENT;

  it('Ein Zinsschritt von 0.25 Punkten erlaubt 3 % (Art. 13 Abs. 1 Bst. c), eine Senkung 2.91 %', () => {
    expect(referenzzinsAnpassungProzent(1)).toBeCloseTo(REFERENZZINS_SCHRITT_PROZENT, 12);
    expect(referenzzinsAnpassungProzent(-1)).toBeCloseTo(-(1 - 1 / 1.03) * 100, 12);
    expect(referenzzinsAnpassungProzent(-1)).toBeCloseTo(-2.91, 2);
    expect(referenzzinsAnpassungProzent(0)).toBe(0);
    expect(referenzzinsAnpassungProzent(undefined)).toBe(0);
    // Erhöhung und Senkung um denselben Schritt heben sich auf (Kehrwert).
    const hin = 1 + referenzzinsAnpassungProzent(1) / 100;
    const zurueck = 1 + referenzzinsAnpassungProzent(-1) / 100;
    expect(hin * zurueck).toBeCloseTo(1, 12);
  });

  it('In der Engine: Zinsschritt ohne Teuerung = 3 % bzw. −2.91 %', () => {
    expect(prozent({ ...ZH_OHNE_TEUERUNG, referenzzins_aenderung: 1 })).toBeCloseTo(3, 9);
    expect(prozent({ ...ZH_OHNE_TEUERUNG, referenzzins_aenderung: -1 })).toBeCloseTo(-2.9126, 4);
  });

  it('LIK-Regime: x % Teuerung erlaubt 0.85 · x %', () => {
    for (const s of STUFEN) {
      expect(prozent({ ...ZH, teuerung: s }, LIK)).toBeCloseTo(LIK_PASS_THROUGH * teuerungProzent(s), 9);
    }
  });

  it('Referenzzins-Regime: x % Teuerung erlaubt 0.4 · x % (Art. 16), nur bei Steigerung', () => {
    for (const s of STUFEN) {
      const x = teuerungProzent(s);
      expect(prozent({ ...ZH, teuerung: s, referenzzins_aenderung: 0 }))
        .toBeCloseTo(REFERENZ_TEUERUNG_PASS_THROUGH * Math.max(0, x), 9);
    }
  });

  it('Referenzzins-Regime: Zinsanteil und Teuerungsanteil addieren sich', () => {
    expect(prozent({ ...ZH, teuerung: 1, referenzzins_aenderung: 1 }))
      .toBeCloseTo(3 + 0.4 * 2.0, 9);
  });

  it('Verhältnisse hängen nicht von der Referenz ab', () => {
    // Quotienten zweier Spielräume: die Referenz kürzt sich heraus.
    const zinsschritt = spielraum({ ...ZH_OHNE_TEUERUNG, referenzzins_aenderung: 1 });
    for (const s of [-1, 0, 1, 2] as const) {
      const x = teuerungProzent(s);
      const lik = spielraum({ ...ZH, teuerung: s }, LIK);
      const ref = spielraum({ ...ZH, teuerung: s, referenzzins_aenderung: 0 });
      expect(lik / zinsschritt).toBeCloseTo((0.85 * x) / 3, 9);
      expect(ref / zinsschritt).toBeCloseTo((0.4 * x) / 3, 9);
      expect(lik / ref).toBeCloseTo(0.85 / 0.4, 9);
    }
  });

  it('Kein Bin-Fall sättigt: alle Kombinationen liegen in [−1, +1]', () => {
    const indexe = [0, 1, 2] as const;
    for (const t of STUFEN) for (const r of STUFEN) for (const i of indexe) {
      const diff: ParamsDiff = i === 0 ? {} : { mietrecht_mietzinsindex: { from: 0, to: i } };
      const v = spielraum({ ...ZH, teuerung: t, referenzzins_aenderung: r }, diff);
      expect(Math.abs(v)).toBeLessThan(1);
    }
  });

  it('Kostenbindung (Index 2) lässt keinen Spielraum, auch bei Zinsänderung', () => {
    const kosten: ParamsDiff = { mietrecht_mietzinsindex: { from: 0, to: 2 } };
    expect(spielraum({ ...ZH, teuerung: 2, referenzzins_aenderung: 2 }, kosten)).toBe(0);
  });
});
