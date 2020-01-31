import { Icon } from '@edtr-io/ui'
import { faLevelUpAlt } from '@fortawesome/free-solid-svg-icons/faLevelUpAlt'
import * as React from 'react'

import { BackgroundSymbol, getIcon } from './styled-elements'
import { SemanticPluginTypes } from './types'

export const stepLabel =
  'Ein Bestandteil der Lösung, der zur Lösung der Aufgabe aufgeschrieben werden muss'
export const explanationLabel =
  'Eine zusätzliche Erklärung, die den Lernenden beim Verstehen der Lösung helfen soll'
export const strategyLabel = 'Erkläre dein Vorgehen'
export const additionalsLabel = 'Ergänze weitere Inhalte zur Lösung'
export const introductionLabel =
  'Ein einführender Satz, in dem das Thema bzw die wichtigste Methode genannt wird'
//TODO: refactor Backgroundsymbol -> hand down via config?

export const exerciseGuideline: React.ReactNode = (
  <div>
    <h1>Aufgabenstellung</h1>
    <p>
      Erstelle eine ansprechende, lernerfreundliche Aufgabenstellung. Frage
      dich, was für eine Aufgabenanforderung du stellst: Reproduzieren,
      Wissenstransfer, Analysieren, Alltags-Check, Vertiefungsaufgabe,
      Aktionsaufgabe,...
    </p>
    <h2>allgemeine Richtlinien</h2>
    <ul>
      <li>Formuliere eine Aufgabenstellung in der Du-Form/Befehlsform.</li>
      <li>Benutze keine Überschriften in Aufgabenstellungen.</li>
      <li>Verlinke keine Lerninhalte und Begriffe in der Aufgabenstellung.</li>
    </ul>
    <h2>Unterschiedliche Aufgabenarten </h2>
    <p>
      Sei dir bewusst, welche Art von Aufgabe du erstellst:
      <ul>
        <li>
          Eine <b>Textaufgabe</b> hat genau eine Aufgabenstellung, einen Hinweis
          und eine Lösung.
        </li>
        <li>
          Ein <b>Textaufgabenblock</b> ist eine Liste zusammenhängender
          Aufgabenstellungen. Die Angabe ist in einer Textaufgabe gebündelt, die
          Nummerierung erfolgt mit 1.,2.,3. usw.
        </li>
        <li>
          Eine <b>Textaufgabengruppe</b> ist eine Liste von Aufgaben, die nicht
          zusammenhängen. Sie werden als Textaufgabengruppe angelegt und jede
          Aufgabenstellung ist einzeln.
        </li>
      </ul>
    </p>
    <h2>interaktive Elemente </h2>
    <p>
      Wie überall kannst du mit dem &#8853; Dinge hinzufügen. Wann immer es
      didaktisch wertvoll ist kannst du deiner Aufgabe hier ein Eingabefeld,
      eine Multiple Choice oder ein anderes interaktives Element hinzufügen. Das
      ersetzt nicht die Lösung!
    </p>
    <BackgroundSymbol>
      {getIcon(SemanticPluginTypes.exercise, '8x')}
    </BackgroundSymbol>
  </div>
)

export const introductionGuideline: React.ReactNode = (
  <div>
    <h1>Wichtiges Wissen zur Aufgabe</h1>
    <ul>
      <li>
        Formuliere einen einführenden Satz, in dem das Thema bzw. die wichtigste
        Methode genannt wird
      </li>
      <li>Verlinke auf einen Artikel zum Thema bzw. zur wichtigsten Methode</li>
    </ul>
    <BackgroundSymbol>
      {getIcon(SemanticPluginTypes.introduction, '8x')}
    </BackgroundSymbol>
  </div>
)

export const strategyGuideline: React.ReactNode = (
  <div>
    <h1>Lösungsstrategie</h1>
    <p>
      Bei schwierigen oder mehrschrittigen Aufgaben empfiehlt es sich eine
      Lösungsstrategie zu beschreiben. Wir empfehlen folgendene Elemente:
    </p>
    <ul>
      <li>
        <b>Zielanaylse</b>
        <p>Frage dich selbst: Was ist der Zielzustand der Aufgabe?</p>
      </li>
      <li>
        <b>Situationsanalyse</b>
        <p>
          Frage dich selbst: Was ist die Ausgangssituation der Aufgabe und
          welche Angaben habe ich vorliegen?
        </p>
      </li>
      <li>
        <b>Planerstellung</b>
        <p>
          Frage dich selbst: Wie bereite ich mich auf die Aufgabe vor, wie fange
          ich an und was ist die zeitliche Abfolge der Lösungsschritte?
        </p>
      </li>
    </ul>
    <BackgroundSymbol>
      {getIcon(SemanticPluginTypes.strategy, '8x')}
    </BackgroundSymbol>
  </div>
)

export const stepGuideline = (
  <div>
    <h1>Lösungsschritt</h1>
    <p>
      Lösungsschritte <b>untergliedern</b> die Aufgabenlösung in kleine
      Sinnabschnitte. Vermittle dein <b>gedankliches Vorgehen</b> bzw. wichtige{' '}
      <b>Lösungsmethoden</b>.
    </p>
    <ul>
      <li>
        <b>Kleinschrittig:</b>
        <p>
          Formuliere die Lösung in kleinen sowie passenden Lösungsschritten.
        </p>
      </li>
      <li>
        <b>Nachvollziehbar:</b>
        <p>
          Formuliere die Lösung entsprechend dem Niveau der Lernenden (achte auf
          Sprache und Formeln).
        </p>
      </li>
      <li>
        <b>Prozessorientiert: </b>
        <p>
          Formuliere den Weg von der Ausgangssituation zu dem Zielzustand
          schrittweise.
        </p>
      </li>
    </ul>
    <p>
      <b>Beachte: </b>Verwende die richtigen Bausteine, zum Beispiel das
      Gleichungsplugin für Rechnungen.
    </p>
    <BackgroundSymbol>
      {getIcon(SemanticPluginTypes.step, '8x')}
    </BackgroundSymbol>
  </div>
)

export const explanationGuideline = (
  <div>
    <h1>Erklärung eines Schrittes</h1>
    <p>
      Die Erklärung des Schrittes stellt eine <b>detaillierte Erläuterung </b>
      des Lösungsschrittes dar. Dabei kannst du u.a.:
    </p>
    <ul>
      <li>
        <p>
          den <b>Grund</b> für dein gedankliches Vorgehen erläutern
        </p>
      </li>
      <li>
        <p>
          die <b>Funktion</b> des Schrittes erläutern
        </p>
      </li>
    </ul>
    <h1>Zweispaltigkeit</h1>
    <p>
      Damit die Lernenden einen guten Lesefluss haben, kannst du vor allem kurze
      Erklärungen mit dem <Icon icon={faLevelUpAlt} />
      -Symbol neben den vorherigen Lösungsschritt holen. Bitte mache dies nur,
      wenn es keine zu langen Erklärungen sind.
    </p>
    <BackgroundSymbol>
      {getIcon(SemanticPluginTypes.explanation, '8x')}
    </BackgroundSymbol>
  </div>
)

export const additionalsGuideline = (
  <div>
    <h1>Ergänzungen</h1>
    <p>
      Gelegentlich sind nach der Lösung (nach dem letzen Schritt!) der Aufgabe
      noch Ergänzungen sinnvoll.
    </p>
    <p> Dabei könnte es sich um Folgendes handeln:</p>
    <ul>
      <li>
        Weitere Antwortmöglichkeiten, deren vollständige Ausformulierung sich
        nicht lohnt. Alternative Lösungsstrategien.
      </li>
      <li>Zusatzinformationen.</li>
      <li>Anregungen und Links zum Weiterlernen.</li>
    </ul>
    <BackgroundSymbol>
      {getIcon(SemanticPluginTypes.additionals, '8x')}
    </BackgroundSymbol>
  </div>
)
