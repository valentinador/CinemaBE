const moongose = require('mongoose');

const CharacterSchema = moongose.Schema({
    actorName: {
        type: String,
        required: [true, "Il nome è un campo obbligatorio"],
        maxlength: [30, "Il nome può avere massimo 30 caratteri"]
    },
    actorSurname:{
        type: String,
        required: [true, "Il cognome è un campo obbligatorio"],
        maxlength: [30, "Il cognome può avere massimo 30 caratteri"]    
    },
    character:{
        type: String,
        required: [true, "Il nome del personaggio è un campo obbligatorio"],
        maxlength: [50, "Il nome del personaggio può avere massimo 50 caratteri"]
    },
    film:{
        type:moongose.Schema.ObjectId,
        ref: 'Film',
        required:true,

    },
    slug: String, //identificatore unico utile a mongodb per prendere il documento di riferimento 
                //e utile alla SEO per la leggibilità degli url
});


module.exports = moongose.model('Character', CharacterSchema);