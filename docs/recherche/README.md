# Recherche: Empirische Studien zu Wohnpreisentwicklung

## Zweck

Systematische Sammlung und Auswertung empirischer Studien zu Wohnpreisentwicklung weltweit (1970–2025).
Die Erkenntnisse fliessen in das DAG-Modell des Wohnkosten-Simulators ein.

## Methodik

### Suchstrategie

1. **Schneeballverfahren:** Ausgehend von bekannten Meta-Studien (OECD, IMF) die Referenzen verfolgen
2. **Datenbanksuche:** Google Scholar, RePEc/IDEAS, SSRN, NBER, institutionelle Repositories
3. **Organisationen:** Direkte Suche auf Websites von Zentralbanken, Forschungsinstituten, Ministerien
4. **Sprachen:** Deutsch, Französisch, Englisch, Niederländisch, Spanisch, Portugiesisch, Japanisch (via EN-Abstracts)

### Qualitätsbewertung

| Typ | Vertrauensstufe |
|-----|-----------------|
| Meta-Studie / Systematic Review | ★★★★★ |
| Peer-reviewed Journal | ★★★★ |
| Working Paper (NBER, CEPR, etc.) | ★★★ |
| Government Report | ★★★ |
| Institutionelle Studie | ★★ |
| Graue Literatur | ★ |

### Relevanz für DAG

Jede Studie wird auf Relevanz für die DAG-Kanten geprüft:
- Bestätigt die Studie eine bestehende Kante (Vorzeichen, Gewicht)?
- Widerspricht sie einer Kante?
- Schlägt sie neue Kanten vor?

## Dateiformat

Jede Studie ist eine Markdown-Datei mit YAML-Frontmatter.
Siehe PLAN.md für das vollständige Schema.

## Regionen

Jede Region hat einen eigenen Ordner. Die Studie wird der Region zugeordnet,
auf die sich die empirische Analyse primär bezieht. Länderübergreifende Studien
kommen nach `GLOBAL/`.

## Duplikate

Wird eine Studie in mehreren Regionen gefunden, wird sie einmal angelegt
und in den anderen Regionen über `duplicate_of` referenziert.
