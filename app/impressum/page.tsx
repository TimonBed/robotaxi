import React from 'react'

export const metadata = {
  title: 'Impressum – RobotaxiMap'
}

export default function ImpressumPage() {
  return (
    <main className="prose prose-invert max-w-none">
      <h1>Impressum</h1>

      <h2>Diensteanbieter nach § 5 TMG</h2>
      <p>
        <strong>Firmenname</strong><br />
        Straßenname Hausnummer<br />
        PLZ Ort<br />
        Land
      </p>
      <p>
        Telefon: <span>+49&nbsp;0000&nbsp;000000</span><br />
        E‑Mail: <span>kontakt@example.com</span>
      </p>

      <h2>Vertretungsberechtigte Person</h2>
      <p>Vor- und Nachname (Geschäftsführung/Inhaber)</p>

      <h2>Register und Registernummer</h2>
      <p>Handelsregister: Amtsgericht Musterstadt, HRB 000000 (falls vorhanden)</p>

      <h2>Umsatzsteuer-ID</h2>
      <p>USt-IdNr.: DE000000000 (falls vorhanden)</p>

      <h2>Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)</h2>
      <p>Vor- und Nachname, Anschrift wie oben</p>

      <h2>Online-Streitbeilegung und Verbraucherstreitbeilegung</h2>
      <p>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">ec.europa.eu/consumers/odr</a>.
        Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.
      </p>

      <h2>Haftung für Inhalte und Links</h2>
      <p>
        Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
      </p>

      <h2>Urheberrecht</h2>
      <p>
        Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet.
      </p>

      <p className="text-xs text-gray-400">Hinweis: Bitte ergänzen Sie die obenstehenden Platzhalter mit Ihren echten Unternehmensangaben.</p>
    </main>
  )
}


