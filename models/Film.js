const moongose = require('mongoose');
const slugify = require('slugify');
const FilmSchema = moongose.Schema({
    title: {
        type: String,
        required: [true, "Il titolo è un campo obbligatorio"],
        unique: true, //non voglio che ci siano nomi uguali
        trim: false, //togliere i whitespace
        maxlength: [50, "Il titolo può avere massimo 50 caratteri"]
    },
    year:{
        type:Number,
        required: [true, "L'anno è obbligatorio"],
    },
    directorName:{
        type: String,
        required: [true, "Il nome del regista è un campo obbligatorio"],
        maxlength: [20, "Il nome del regista può avere massimo 20 caratteri"]
    },
    directorSurname:{
        type: String,
        required: [true, "Il cognome del regista è un campo obbligatorio"],
        maxlength: [20, "Il cognome del regista può avere massimo 20 caratteri"]
    },
    slug: String, //identificatore unico utile a mongodb per prendere il documento di riferimento 
                //e utile alla SEO per la leggibilità degli url
    description: {
        type: String,
        maxlength: [700, "La descrizione può avere massimo 700 caratteri"],
        //match: [regex, errore] se vuoi inserire una regular expression
    },
    averageRating:{
        type: Number,
        min: [1, "Devi inserire almeno una stella"],
        max: [5, "Puoi inserire al massimo 5 stelle"]
    },
    photo: {
        type: String,
        default: "empty.jpg"
    }
},
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true }
    });

/*
In MongoDB, il termine virtual si riferisce ai campi virtuali che sono definiti in uno schema di Mongoose. 
Questi campi non vengono effettivamente salvati nel database, ma sono calcolati o derivati a partire da altri 
campi di un documento. I campi virtuali sono utili quando vuoi aggiungere proprietà a un documento senza 
memorizzarle nel database. Ad esempio, puoi creare un campo virtuale che combina o elabora altri campi esistenti.
Si sceglie di usare il virtual per aggiungere ai film, la corrispettiva lista di personaggi
*/


//creazione di uno slug dal titolo
//Senza chiamare next(), il processo di salvataggio non proseguirebbe.
FilmSchema.pre('save', function(next){
    console.log('slugify run  ', this.title);
    this.slug = slugify(this.title, {lower:true});
    next();
})

//codice collegato con controllers/films (Film.find(JSON.parse(queryString)).populate('characters');)
FilmSchema.virtual('characters',{
    ref: "Character",
    localField: "_id",
    foreignField: "film",
    justOne: false,
})


module.exports = moongose.model('Film', FilmSchema);