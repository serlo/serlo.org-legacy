import * as React from 'react'

export class ContentFooter extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <section className="comments">
          <header className="row">
            <div className="col-12">
              <h2>
                <i className="fas fa-xs fa-question-circle" /> Hast du eine
                Frage?
              </h2>
            </div>
          </header>

          <textarea className="test" defaultValue="Deine Frage oder Anregung" />

          <h3 className="col comments-header">
            <i className="fas fa-xs fa-comments" /> 6 Kommentare{' '}
            <small>
              <a
                data-toggle="collapse"
                href="#commentlist"
                role="button"
                aria-expanded="false"
                aria-controls="commentlist"
              >
                (alle anzeigen)
              </a>
            </small>
          </h3>
          <div className="collapse" id="commentlist">
            <h5>Kommentar…</h5>
          </div>
        </section>

        <section className="suggested-content">
          <header className="row">
            <div className="col">
              <h3>Passende Inhalte</h3>
            </div>
          </header>

          <div className="row">
            <div className="col-5 article-thumbnail">
              <i className="far fa-2x fa-newspaper" />
            </div>
            <p className="col">
              <b>
                <a href="#">Kreiszahl Pi</a>
              </b>
              <br />
              Die Kreiszahl π ist eine der wichtigsten Konstanten in der
              Mathematik.
            </p>
          </div>
          <div className="row">
            <div className="col-5 article-thumbnail">
              <i className="far fa-2x fa-newspaper" />
            </div>
            <p className="col">
              <b>
                <a href="#">Kreissektor</a>
              </b>
              <br />
              Ein Kreissektor ist eine Teilfläche des Kreises, die von einem
              Kreisbogen und zwei daran angrenzenden Strecken zum Mittelpunkt
              gebildet wird.
            </p>
          </div>
        </section>

        <section className="topiclist">
          <header className="row">
            <div className="col">
              <h3>Kreise und Kreisteile</h3>
            </div>
          </header>

          <ul>
            <li>
              <i className="far fa-newspaper" /> <a href="">Radius</a>
            </li>
            <li>
              <i className="far fa-newspaper" />{' '}
              <a href="">Berechnungen am Kreis</a>
            </li>
            <li>
              <i className="far fa-newspaper" /> <a href="">Kreis</a>
            </li>
            <li>
              <i className="fas fa-play-circle" />{' '}
              <a href="">Fläche eines Kreises</a>
            </li>
            <li>
              <i className="fas fa-play-circle" />{' '}
              <a href="">Kreissektor, Kreisbogen, Kreissegment</a>
            </li>
            <li className="important">
              <i className="fas fa-chevron-circle-down" />{' '}
              <a href="">Den gesamten Bereich anschauen</a>
            </li>
          </ul>
        </section>

        <section className="license">
          <header />
          <div className="row">
            <p className="col">
              Diese Inhalte stehen unter der freien{' '}
              <a
                href="https://creativecommons.org/licenses/by-sa/4.0/deed.de"
                rel="license nofollow"
              >
                CC-BY-SA 3.0
              </a>{' '}
              Lizenz, wenn nicht anders angeben. Was das genau bedeutet erfährst
              du <a href="#">hier</a>.
            </p>
          </div>
        </section>
      </React.Fragment>
    )
  }
}
