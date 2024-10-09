# Applicazione in Express e MongoDB 
## Introduzione
Questo progetto è il risultato del corso Udemy che ho seguito sul backend. Inizialmente avevo intenzione di realizzarlo in Typescript ma il corso prevedeva che il progetto fosse in Javascript, quindi per essere in linea con il corso ho rimosso Typescript in corso d'opera (si, la cartella @types è una porcata ma avevo bisogno di far funzionare una libreria xD).
Inoltre manca la parte relativa alla documentazione che cerco di riassumere su questo readme.

## Come iniziare

Installa i node modules
```js
npm i
```
Runna il progetto
```js
npm run dev
```
Se vuoi caricare dei dati demo
 ```js
node seeder -i
```
Se vuoi cancellare tutti i dati da db
 ```js
node seeder -d
```

## API per i film

### GET localhost:3000/api/v1/film
Api public per avere l'elenco dei film disponibili
### GET localhost:3000/api/v1/film/<id>
Api public per ottenere informazioni su un determinato film
### POST localhost:3000/api/v1/film/
Api private per aggiungere un film. Un esempio di body:
 ```js
 {
            "title": "film di esempio",
            "year": 2015,
            "directorName": "Mario",
            "directorSurname": "Rossi",
            "description": "Lorem ipsum dolor sit amet",
            "averageRating": 5,
            "photo": "esempio.jpg"
}
```
### PUT localhost:3000/api/v1/film/<id>
Api private per modificare un film già esistente. Un esempio di body:
 ```js
 {
            "title": "film di esempio 22",
            "year": 2000,
            //[inserisci gli altri campi da modificare prendendo spunto dalla post]
}
```
### DELETE localhost:3000/api/v1/film/<id>
Api private per eliminare un film.