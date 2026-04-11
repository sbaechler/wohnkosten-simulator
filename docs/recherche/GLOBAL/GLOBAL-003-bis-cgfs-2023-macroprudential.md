---
id: "GLOBAL-003"
title: "Macroprudential policies to mitigate housing market risks"
authors: ["CGFS Working Group"]
year: 2023
institution: "Bank for International Settlements — Committee on the Global Financial System"
type: "government-report"
language: "en"
url: "https://www.bis.org/publ/cgfs69.pdf"
doi: null
bis_id: "CGFS Papers No 69"
status: "evaluated"
dag_nodes:
  - "kapital_hypothekarregulierung"
  - "kapital_institutionelle_regulierung"
  - "spekulationshemmung"
  - "investitionsattraktivitaet"
dag_edges_confirmed:
  - { from: "kapital_hypothekarregulierung", to: "spekulationshemmung", sign: +1, note: "LTV-Limits dämpfen spekulative Nachfrage, belegt für viele Länder" }
  - { from: "kapital_hypothekarregulierung", to: "nachfragedruck", sign: -1, note: "Verschärfte LTV-Regeln reduzieren Transaktionsvolumen und Preisdruck" }
dag_edges_challenged: []
relevance: "high"
duplicate_of: null
regions: ["GLOBAL"]
period_covered: "2000–2022"
countries: "CGFS-Mitglieder (ca. 30)"
---

## Zusammenfassung

Umfassende Analyse makroprudenzieller Instrumente für Wohnungsmärkte durch die BIS/CGFS-Arbeitsgruppe.
Untersucht Wirksamkeit von LTV-Limits, DTI-Regeln, Eigenkapitalanforderungen und anderen Instrumenten
in einer breiten Länderauswahl.

## Key Findings

- Fast alle Zentralbanken setzen **mehrere makroprudenzielle Instrumente** parallel ein
- LTV-Limits (Loan-to-Value) sind das häufigste und wirksamste Instrument gegen Preisübertreibungen
- **Pfadvarianz:** Länder unterscheiden sich stark je nach institutioneller Geschichte und politischer Kultur
- LTV-Verschärfungen reduzieren Transaktionsvolumen und kurzfristig Preise, langfristige Effekte variieren
- Kombination aus LTV + DTI (Debt-to-Income) zeigt stärkere dämpfende Wirkung als einzelne Instrumente
- Instrumente wirken asymmetrisch: Verschärfungen dämpfen schneller als Lockerungen ankurbeln

## Relevanz für DAG

- `kapital_hypothekarregulierung`: Diese Studie ist die Kernreferenz für diesen Parameter
  - Bestätigt sign: -1 auf `nachfragedruck` und sign: +1 auf `spekulationshemmung`
- Makroprudenzielle Politik hat moderate, aber robuste Wirkung auf Wohnpreise
- Wirkung auf `investitionsattraktivitaet`: LTV-Limits reduzieren Renditechancen, aber auch Ausfallrisiko

## Zitate

> "LTV limits are the most widely used and most effective macroprudential tool for mitigating housing market risks." (S. 4)

> "The combination of LTV and DTI limits is more effective than either tool in isolation." (S. 27)

## Notizen

- BIS/CGFS ist Leitinstitution für makroprudenzielle Regulierung — sehr hohe Autorität
- Für Schweiz direkt relevant: SNB setzt seit 2012 Hypothekarregulierungen ein (FINMA-Rundschreiben)
- Ergänzende Studie: BIS WP 632 (kanadische LTV-Daten) und BIS WP 673 (Ländervergleich LTV)
