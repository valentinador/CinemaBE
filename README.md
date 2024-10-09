# Applicazione in Express e MongoDB 
## Introduzione
Questo progetto è il risultato del corso Udemy che ho seguito sul backend. Inizialmente avevo intenzione di realizzarlo in Typescript ma il corso prevedeva che il progetto fosse in Javascript, quindi per essere in linea con il corso ho rimosso Typescript in corso d'opera (si, la cartella @types è una porcata ma avevo bisogno di far funzionare una libreria xD).
Inoltre manca la parte relativa alla documentazione che cerco di riassumere su questo readme.
L'idea è quella di avere un database di film in cui ad ogni film associo i personaggi (ad esempio se considero il Signore degli Anelli i personaggi saranno Frodo, Gandalf, Aragorn...). È presente anche l'autenticazione di due tipologie di utenti:
- publisher (può pubblicare i contenuti, modificarli e cancellarli)
- user (può visualizzare solo i dati)

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

### PUT localhost:3000/api/v1/film/:id/locandina
Api private per caricare la locandina del film (si riferisce a photo in film). Il body vuole un form-data file che prende solo le immagini in input.

## API per i personaggi associati a un film

### GET localhost:3000/api/v1/character
Api public per avere l'elenco dei personaggi disponibili

### GET localhost:3000/api/v1/film/<film_id>/characters
Api public per ottenere informazioni sui personaggi relativi ad un determinato film

### GET localhost:3000/api/v1/character/<id_personaggio>
Api public per ottenere informazioni su un determinato personaggio

### POST localhost:3000/api/v1/film/<id_film>/characters
Api private per aggiungere un personaggio a un determinato film. Un esempio di body:
 ```js
{
        "actorName": "Giuseppe",
        "actorSurname": "Verdi",
        "character": "Gandalf"
}
```
### DELETE localhost:3000/api/v1/character/<id_personaggio>
Api private per eliminare un personaggio.

### PUT localhost:3000/api/v1/character/<id_personaggio>
Api private per modificare un personaggio. Un esempio di body:
 ```js
{
        "character": "Gandalf",
        //[inserisci gli altri campi da modificare prendendo spunto dalla post]
}
```
