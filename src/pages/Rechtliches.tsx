import './Rechtliches.css';

interface RechtlichesProps {
  /** Wird aufgerufen, wenn der Nutzer zurück zum Simulator will */
  onBack: () => void;
}

/**
 * Rechtliches: Impressum, Datenschutzerklärung und Nutzungsbedingungen.
 *
 * Diese Seite ist die massgebende Fassung der Datenschutzerklärung —
 * sie wird bewusst nicht auf einen externen Hoster verlinkt.
 */
export function Rechtliches({ onBack }: RechtlichesProps) {
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">Rechtliches</h1>
        <button
          className="legal__back"
          onClick={onBack}
          title="Zurück zum Simulator"
        >
          ← Zurück zum Simulator
        </button>
      </header>

      <main className="legal">
        <article className="legal__doc">
          <h2 className="legal__heading">Impressum</h2>

          <h3>Verantwortlich für diese Website</h3>
          <p>
            Simon Bächler
            <br />
            Zürich, Schweiz
            <br />
            E-Mail: <a href="mailto:laecheln.origami6t@icloud.com">laecheln.origami6t@icloud.com</a>
          </p>

          <h3>Betreiber der Website</h3>
          <p>
            wohnkosten-simulator.ch ist ein privates, nicht-kommerzielles Projekt. Es steht in
            keinem Zusammenhang mit einer Behörde, Partei oder Interessenorganisation.
          </p>

          <h3>Haftungsausschluss</h3>
          <p>
            Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Der Simulator bildet ein
            vereinfachtes Modell des Wohnungsmarkts ab; für Richtigkeit, Vollständigkeit und
            Aktualität der dargestellten Ergebnisse wird keine Haftung übernommen.
          </p>

          <h3>Urheberrecht</h3>
          <p>
            Der Quellcode steht unter der AGPL-3.0-Lizenz. Die verwendeten Daten stammen aus
            öffentlich zugänglichen Quellen; die jeweiligen Rechte verbleiben bei den Urhebern.
          </p>
        </article>

        <article className="legal__doc">
          <h2 className="legal__heading">Datenschutzerklärung</h2>
          <p className="legal__meta">Stand: 9. April 2026</p>

          <h3>1. Verantwortlicher</h3>
          <p>
            Simon Bächler
            <br />
            Zürich, Schweiz
            <br />
            E-Mail: <a href="mailto:laecheln.origami6t@icloud.com">laecheln.origami6t@icloud.com</a>
          </p>

          <h3>2. Grundsätze</h3>
          <p>
            Wir nehmen den Schutz deiner persönlichen Daten sehr ernst. Diese Website
            (wohnkosten-simulator.ch) ist eine <strong>rein statische</strong> Anwendung, die bei
            Cloudflare gehostet wird.
          </p>
          <p>
            <strong>Wichtig:</strong> Wir erheben, speichern oder verarbeiten{' '}
            <strong>keine personenbezogenen Daten</strong> über diese Website.
          </p>

          <h3>3. Cloudflare Web Analytics</h3>
          <p>
            Wir nutzen <strong>Cloudflare Web Analytics</strong>, um die Nutzung der Website anonym
            zu analysieren.
          </p>
          <h4>Was wird verarbeitet?</h4>
          <p>
            Cloudflare Web Analytics arbeitet weitgehend ohne Cookies und erhebt nur folgende
            technische Daten:
          </p>
          <ul>
            <li>Anonymisierte IP-Adresse (letztes Oktett wird maskiert)</li>
            <li>Betriebssystem und Browser-Typ (Device Data)</li>
            <li>Geografische Region (Land/Region, keine genaue Stadt)</li>
            <li>Aufgerufene Seiten und Verweildauer</li>
            <li>Referrer (von welcher Seite du kommst)</li>
          </ul>
          <p>
            <strong>Es werden keine</strong> persistenten Cookies gesetzt, keine
            Cross-Site-Tracking-Mechanismen verwendet und keine personenbezogenen Profile erstellt.
          </p>
          <p>
            Cloudflare verarbeitet diese Daten in unserem Auftrag. Die Daten werden primär in der EU
            bzw. den USA verarbeitet. Cloudflare hat sich vertraglich zur Einhaltung der
            schweizerischen Datenschutzgesetzgebung (DSG) und der DSGVO verpflichtet.
          </p>

          <h3>4. Deine Rechte</h3>
          <p>
            Da wir keine personenbezogenen Daten von dir speichern, kannst du folgende Rechte{' '}
            <strong>nicht</strong> ausüben (weil keine Daten vorhanden sind):
          </p>
          <ul>
            <li>Auskunftsrecht</li>
            <li>Berichtigung, Löschung, Einschränkung</li>
            <li>Widerspruch gegen die Verarbeitung</li>
            <li>Datenübertragbarkeit</li>
          </ul>
          <p>Falls du dennoch Fragen hast, kontaktiere uns gerne per E-Mail.</p>

          <h3>5. Änderungen dieser Datenschutzerklärung</h3>
          <p>
            Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen, um sie an
            geänderte rechtliche Anforderungen oder Änderungen unserer Services anzupassen. Die
            aktuelle Version findest du immer auf dieser Seite.
          </p>
        </article>

        <article className="legal__doc">
          <h2 className="legal__heading">Nutzungsbedingungen</h2>
          <p className="legal__placeholder">
            Die Nutzungsbedingungen werden derzeit ausgearbeitet und an dieser Stelle veröffentlicht.
          </p>
          <p>
            Bis dahin gilt: Der Simulator ist ein Modell zu Informations- und Diskussionszwecken. Die
            dargestellten Ergebnisse sind normierte Modellwerte und keine Prognose, Beratung oder
            Entscheidungsgrundlage für konkrete Einzelfälle. Der Quellcode steht unter der
            AGPL-3.0-Lizenz.
          </p>
        </article>
      </main>

      <footer className="app__footer">
        <span>©2026 Simon Bächler</span>
      </footer>
    </div>
  );
}
