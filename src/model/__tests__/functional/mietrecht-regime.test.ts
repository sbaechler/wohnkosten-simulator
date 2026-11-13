/**
 * Provisorische Mietrechts-Logik (CH-012).
 * Prüft Tore und Vorzeichen, nicht kalibrierte Beträge.
 */
import { describe, it, expect } from 'vitest';
import { computePhasePipeline, invalidatePhasesCache } from '../../compute-phases';
import type { CityContext, ParamsDiff40 } from '../../../types';

const ZH: CityContext = {
  ownershipBaseline: { privat: 0.39, institutionell: 0.3, genossenschaft: 0.175, oeffentlich: 0.076 },
  zinsniveau: -1,
  zuwanderungsdruck: 2,
  wirtschaftskraft: 2,
  bevoelkerungstrend: 1,
  marktenge: 2,
  mietbelastungs_grenze: 2,
  teuerung: -1,
};

function last(context: CityContext, diff: ParamsDiff40 = {}) {
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
    expect(last(ZH).marketState.bestandsmiete).toBeCloseTo(0, 5);
  });

  it('Tiefes, unverändertes Zinsniveau ist kein Senkungsanspruch: Durchsetzung allein senkt nichts', () => {
    // ZH: zinsniveau −1 (tief), Referenzzinssatz unverändert (Feld fehlt = 0).
    const phase = last(ZH, { mietrecht_durchsetzung: { from: 0, to: 2 } });
    expect(phase.marketState.erhoehungsspielraum).toBe(0);
    expect(phase.marketState.bestandsmiete).toBeCloseTo(0, 5);
  });

  it('Initiative ohne gesetzte Mietlücke und ohne Zinsänderung senkt nichts (CH-012)', () => {
    const phase = last(
      { ...ZH, referenzzins_aenderung: 0 },
      {
        mietrecht_kriterium: { from: 1, to: 0 },
        mietrecht_durchsetzung: { from: 0, to: 2 },
      },
    );
    expect(phase.marketState.bestandsmiete).toBeCloseTo(0, 5);
    expect(phase.marketState.anfangsmiete).toBeCloseTo(0, 5);
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
    const hochAberStabil = last({ ...ZH, zinsniveau: 2, referenzzins_aenderung: 0 });
    expect(hochAberStabil.marketState.bestandsmiete).toBeCloseTo(0, 5);
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

  it('Index auf LIK erhöht das Schutzlevel nicht mehr', () => {
    const base = last(ZH);
    const lik = last(ZH, { mietrecht_mietzinsindex: { from: 0, to: 1 } });
    expect(lik.marketState.mietpreis_schutzlevel)
      .toBeCloseTo(base.marketState.mietpreis_schutzlevel, 5);
    expect(lik.marketState.erhoehungsspielraum).toBeLessThanOrEqual(0);
  });
});
