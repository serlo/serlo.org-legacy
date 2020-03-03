
import { storiesOf } from '@storybook/react'
import * as React from 'react'
import { Notifications } from '../src/notifications/notifications'
import { Provider, GlobalStyle } from '../src/provider.component'
import { Normalize } from 'styled-normalize'

storiesOf('Notifications component', module)
  .add('test notification', () => (
    <Provider>
        <Normalize />
        <GlobalStyle />
        <Notifications author={{id: "123", username: "Maria Mustermann"}} body="hat eine <a href='https://de.serlo.org/entity/repository/compare/141975/153540'>Bearbeitung</a> von <a href='https://de.serlo.org/community/veranstaltungen/triff-serlo-community-m%C3%BCnster'>Triff deine Serlo Community in Münster</a> akzeptiert" timestamp="vor 6 Stunden"></Notifications>
        <Notifications author={{id: "123", username: "Stephen King"}} body="hat eine <a href='https://de.serlo.org/entity/repository/compare/1663/152026'>Bearbeitung</a> in <a href='https://de.serlo.org/mathe/terme-gleichungen/potenzen,-wurzeln-logarithmen/potenzen/potenzen-1663'>Potenzen</a> erstellt" timestamp="vor 30 Minuten"></Notifications>
        <Notifications author={{id: "123", username: "Ash Kutschum"}} body="hat eine neue Diskussion <a href='/discussion/153594'>Aufgabe und Lösung dieser Aufgabe sind nach der automatischen Datenübertragung aus Serlo 1 nicht überarbeitet worden und im gegenwärtigen ...</a> zu <a href='/mathe/geometrie/dreiecke,-vierecke,-kreise-andere-ebene-figuren/fl%C3%A4chen-,-umfangsberechnung-anderes-ebenen-figuren/r%C3%A4tselaufgaben-besonderen-ebenen-figuren/9797/9799'>9799</a> erstellt" timestamp="vor 30 Minuten"></Notifications>
    </Provider>
  ));
