# Widget-Ideen: Neue Analyse-Widgets

Erstellt: 2026-03-20  
Aktualisiert: 2026-03-28  
Basis: Wirkungsmodell & Städtedaten

## Bevölkerungsgruppen (festgelegt)

Ab sofort werden alle relevanten Effekte nach folgenden **8 festen Bevölkerungsgruppen** betrachtet:

### Feste Gruppen

1. **Geringverdiener** — Tiefe Einkommen, oft auf Sozialhilfe oder stark geförderte Wohnungen angewiesen
2. **Normalverdiener Mieter** — Mittleres Einkommen, auf dem freien Mietmarkt
3. **Glückspilze** — Mieter mit stark subventionierter/preisgebundener Wohnung (Kostenlimite, Genossenschaftslos etc.)
4. **Normalverdiener Eigentümer** — Mittleres Einkommen mit Hypothek
5. **Junge Familien** — Haushalte mit Kindern in der Familiengründungsphase
6. **Genossenschafter** — Mitglieder von Wohnbaugenossenschaften
7. **Rentner** — Pensionierte mit meist fixem Einkommen
8. **High Earner / Professionals** — Gut bis sehr gut verdienende Haushalte

**Granularitätsregel:**  
Effekte sollen granular pro Gruppe dargestellt werden, **dort wo eine Aufsplittung Sinn macht** (z. B. Preistrend, Verdrängungsrisiko, Wohnzufriedenheit). Bei Indikatoren wie allgemeiner Nachfrage oder Angebotspotenzial kann eine aggregierte Darstellung ausreichen.

---

## Priorisierung

| Widget | Daten-Basis | Komplexität | Empfehlung |
|--------|-------------|-------------|------------|
| Gentrifizierungsindex | Direkt aus Wirkungsmodell ableitbar | Mittel | ✅ Priorität 1 |
| Zeit bis Marktwirkung | Zeitklassen aus Wirkungsmodell | Niedrig | ✅ Priorität 1 |
| Neubau-Hemmnisindex | Direkt aus Wirkungsmodell ableitbar | Niedrig | ✅ Priorität 1 |
| Verdrängungsrisiko | Direkt aus Wirkungsmodell ableitbar | Niedrig | ✅ Priorität 1 |
| Trend Wohnpreise (pro Gruppe) | Neue Gruppen + Preistrend | Mittel | ✅ Priorität 1 (überarbeitet) |

---

## Überarbeitetes Widget: Trend Wohnpreise

**Beschreibung:** Zeigt die Preisentwicklung **pro Bevölkerungsgruppe**.

**Darstellung:**
- Erweiterte Version des `DivergingTrend`-Widgets
- Bis zu 8 Gruppen mit je eigenem Pfeil, Label und Preiseffekt
- Farbcodierung nach Richtung und Stärke des Effekts
- Gruppen können sortiert werden (z. B. nach Stärke des Preiseffekts)

**Granularität:** Hohe Granularität gewünscht. Unterschiede zwischen "Glückspilzen" und "Normalverdiener Mieter" sollen klar sichtbar sein.

---

## Priorität 1 — Sofort umsetzbar

*(Rest der Datei bleibt vorerst unverändert — die anderen Widgets werden bei Bedarf später angepasst.)*
