import { createServer } from 'node:http';
import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'node:url';

// Dit draait op de SERVER. De browser heeft geen toegang tot het databasebestand.
const db = new DatabaseSync(fileURLToPath(new URL('./voorbeeld.sqlite', import.meta.url)));

db.exec(`
  CREATE TABLE IF NOT EXISTS studenten (
    id INTEGER PRIMARY KEY,
    naam TEXT NOT NULL
  );
`);

// Voeg bij het opstarten wat voorbeeldgegevens toe (zonder duplicaten).
const toevoegen = db.prepare('INSERT OR IGNORE INTO studenten (id, naam) VALUES (?, ?)');
toevoegen.run(1, 'Sam');
toevoegen.run(2, 'Noor');
toevoegen.run(3, 'Alex');

const server = createServer((request, response) => {
  if (request.method !== 'GET') {
    response.writeHead(405, { Allow: 'GET' });
    response.end('Alleen GET is toegestaan');
    return;
  }

  if (request.url === '/api/studenten') {
    // Stap 2: de server voert een SQL-query uit en stuurt de rijen als JSON terug.
    try {
      const studenten = db.prepare('SELECT id, naam FROM studenten ORDER BY id').all();
      response.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify(studenten));
    } catch (error) {
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      response.end(JSON.stringify({ fout: 'Database uitlezen is mislukt' }));
    }
    return;
  }

  if (request.url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(`<!doctype html>
<html lang="nl">
  <meta charset="utf-8">
  <title>Node.js + SQLite</title>
  <h1>Studenten uit SQLite</h1>
  <p>Browser → Node.js-server → SQLite → JSON → browser</p>
  <button id="laden">Gegevens ophalen</button>
  <pre id="resultaat">Klik op de knop om de database uit te lezen.</pre>
  <script>
    document.querySelector('#laden').addEventListener('click', async () => {
      const resultaat = document.querySelector('#resultaat');
      try {
        // Stap 1: de browser vraagt de gegevens op bij onze server.
        const response = await fetch('/api/studenten');
        if (!response.ok) throw new Error('Ophalen mislukt');
        const studenten = await response.json();

        // Stap 3: toon het antwoord van de server op de pagina.
        resultaat.textContent = JSON.stringify(studenten, null, 2);
      } catch (error) {
        resultaat.textContent = error.message;
      }
    });
  </script>
</html>`);
    return;
  }

  response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  response.end('Niet gevonden');
});

server.listen(3000, '127.0.0.1', () => {
  console.log('Open http://localhost:3000');
});
