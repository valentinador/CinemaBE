# Applicazione in Express e MongoDB 
## Introduzione
Questo progetto è il risultato del corso Udemy che ho seguito sul backend. Il progetto è in Javascript (il corso non predeva Typescript ma inizialmente volevo provare ad inserirlo, poi ho abbandonato l'idea per quello è presente a cartella @types).
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



## API per l'autenticazione

### GET localhost:3000/api/v1/auth/me
Api private per avere le informazioni sull'utente loggato

### GET localhost:3000/api/v1/logout
Api private per effetttuare il logout

### POST localhost:3000/api/v1/login
Api public per effetttuare il login. Un esempio di body (funzionante, esiste questo utente ed è publisher):
 ```js
 {
    "email":"test@example.com",
    "password": "Admin1234!"
 }
```

### POST localhost:3000/api/v1/auth/register
Api public per la registrazione di un nuovo utente. Un esempio di body:
 ```js
 {
    "name": "Maria",
    "surname": "Arancione",
    "password": "Pippo1234!",
    "email":"m.arancione@example.com",
    "role": "user"
 }
```
