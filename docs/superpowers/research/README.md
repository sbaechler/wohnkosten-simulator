# Research-Übersicht: Parameter-Wirkungen

Kompilierte Forschungsergebnisse aus 5 parallelen Recherchen. Gesamtausbeute: **1'630 Zeilen, 60+ Studien/Fallstudien**.

## Dateien

| Datei | Thema | Umfang |
|-------|-------|--------|
| `mietrecht-parameter-wirkung.md` | Mietpreisbremse, Kündigungsschutz, Mietspiegel | 255 Zeilen |
| `bodenrecht-parameter-wirkung.md` | Vorkaufsrecht, Mehrwertabgabe, Land Value Tax, Upzoning | 441 Zeilen |
| `bau-planungs-parameter-wirkung.md` | Ausnützungsziffer, Bewilligungsverfahren, Upzoning | 252 Zeilen |
| `gemeinnuetzig-nutzung-parameter-wirkung.md` | Gemeinnützigkeit, Leerstandsabgabe, Airbnb-Regulierung | 398 Zeilen |
| `steuer-kapital-parameter-wirkung.md` | Grundstückgewinnst., Hypothekarregulierung, Investoren-Steuern | 284 Zeilen |

## Wichtigste quantitative Erkenntnisse (kompiliert)

### Mietrecht
- **Berlin Mietendeckel** → kurzfristig −2–4% Mieten, aber −5–9% Angebot, Spillover nach Brandenburg
- **San Francisco** → −15% Angebot, +5.1% gesamtstädtische Mieten, −20% Mobilität
- **Mietpreisbremse (DIW/IW)** → insgesamt wenig wirksam, Verlagerung in Möblierte/befristete Mieten
- **NYC Rent Stabilization** → unregulierte Mieten 22–25% höher als ohne Regulierung
- Konsistent: Angebot sinkt, Mobilität sinkt, Spillover in unregulierten Sektor

### Bodenrecht & Zonierung
- **Minneapolis 2040 Upzoning** → 16–34% tiefere Preise nach 5 Jahren
- **Auckland Unitary Plan** → 14–35% tiefere Mieten (3–7 Jahre)
- **Zürich (Büchler & Lutz 2024)** → +9% Wohnungen, keine Mietpreiserhöhung
- **Land Value Capture / Bodenwertsteuer** → vollständige Kapitalisierung in Bodenpreise (Dänemark)
- **Inclusionary Zoning** → gemischte Ergebnisse; Policy-Design entscheidend

### Bau & Planung
- **Zeitverzögerung real:** 3–10 Jahre vom Upzoning bis messbare Angebotsänderung
- **Baugenehmigungen** steigen deutlich nach Upzoning (Auckland: "skyrocketed")
- **Neubauten senken Mieten im Umkreis** (Asquith et al.: 500m Radius)
- **Upzoning kurzfristig:** +15–23% Verkaufpreise (Chicago), langfristig erst Preissenkung

### Gemeinnützigkeit & Nutzung
- **Vancouver EHT** → Leerstand 0.9% → 0.49%
- **BC SVT** → 20'000 Einheiten zum Mietmarkt
- **NYC LL18** → 90% Inserate-Rückgang
- **Airbnb-Regulierung Barcelona** → +1.9% Miete, +4.6% Kaufpreise (Verlagerungseffekt!)
- **Santa Monica** → 60% Airbnb-Rückgang, aber Mietpreiseffekt insignifikant

### Steuer & Kapital
- **Grunderwerbsteuer +1%-Punkt** → −3% Immobilienpreise (Deutschland)
- **UK Stamp Duty** → −20% Mobilität an der £250k Schwelle
- **Singapore ABSD Ausländer:** 10% → 60% → deutliche Dämpfung
- **Bodenwertsteuer** → vollständige Kapitalisierung in Bodenpreise (Dänemark)
- **MID-Abschaffung (US)** → minimaler messbarer Preiseffekt

## Konsistente Muster über alle Parametergruppen

1. **Zeitverzögerung ist real** — 3–10 Jahre vom Policy-Entscheid bis zur messbaren Wirkung
2. **Angebots-effekte dominieren langfristig** — Regulierung kurzfristig preissenkend, langfristig Angebot reduziert → Preise steigen
3. **Spillover-Effekte** — Regulierung in einem Sektor treibt Preise im anderen Sektor
4. **Verlagerungseffekte** — Mietrecht → Möblierte/befristete; Airbnb-Regulierung → Kaufmarkt
5. **Starke lokale Unterschiede** — Dichte, Marktliquidität, Durchsetzbarkeit bestimmen Erfolg

## Forschungsdesiderata (was noch fehlt)

- Vorkaufsrecht: kaum quantitative Evaluationsstudien (Deutschland)
- Bauverpflichtung: rechtliche Mechanismen dokumentiert, aber Preiseffekte unknown
- Schweizer Spezifika: fast keine publizierten CH-Studien zu Eigenmietwert/Handänderungssteuer
- Hypothekarregulierung: wenig Evidenz zu Wirkung auf Bodenpreise

## Nutzung für Tests

Diese Daten dienen als:
1. **fachliche Validierungsbasis** — stimmen unsere DAG-Gewichte mit der realen Evidenz überein?
2. **Testfälle** — echte Städte/Jahre mit messbaren Outcomes als Regressionstests
3. **Zeitklassen-Kalibrierung** — stimmen unsere Zeitkonstanten mit der文献 überein?
4. **Grenzwert-Tests** — bei welchen Parameterwerten bricht das Modell?

Siehe auch: `docs/superpowers/specs/TEST_STRATEGY.md`
