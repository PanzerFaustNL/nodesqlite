# Node.js + SQLite: een klein voorbeeld

Een voorbeeld zonder externe packages. Gebruik Node.js 22.13 of nieuwer.

## Starten

```sh
npm start
```

Open http://localhost:3000 en klik op **Gegevens ophalen**.
Stop de server met Ctrl+C.

## Wat gebeurt er?

1. De browser doet met `fetch('/api/studenten')` een HTTP-verzoek.
2. De Node.js-server ontvangt dit verzoek en voert `SELECT id, naam FROM studenten ORDER BY id` uit op SQLite.
3. De server stuurt de gevonden rijen terug als JSON.
4. De browser toont die JSON op de pagina.

Alles staat in `server.js`, inclusief de kleine HTML-pagina. De SQLite-database
`voorbeeld.sqlite` wordt bij de eerste start automatisch aangemaakt naast dat bestand.
De database blijft bewaard als je de server stopt. De browser praat alleen met de
server; alleen de server opent de database.

Je kunt de API ook rechtstreeks bekijken op http://localhost:3000/api/studenten.

De `?` in de INSERT-query zijn parameters: waarden worden apart aan de query
doorgegeven met `.run(...)`. Gebruik dit ook voor eventuele gebruikersinvoer,
in plaats van die in SQL-tekst te plakken.

Dit voorbeeld gebruikt de ingebouwde module `node:sqlite`. Sommige Node.js-versies
tonen daarvoor een experimentele waarschuwing.
# nodesqlite
