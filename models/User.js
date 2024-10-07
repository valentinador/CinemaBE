const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Il campo nome è obbligatorio"]
    },
    surname:{
        type: String,
        required: [true, "Il campo cognome è obbligatorio"]
    },
    email: {
        type: String,
        required:[true, "Il campo email è obbligatorio"],
        unique: true,
        match:[
            /^([\w.*-]+@([\w-]+\.)+[\w-]{2,4})?$/,
            "L'indirizzo email non è valido"
                ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Il campo password è obbligatorio'],
        minlength: [6, 'La password deve contenere almeno 6 caratteri'],
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt:{
        type:Date,
        default: Date.now
    }
});


//Criptare la password con bcrypt prima che venga salvata nel database
UserSchema.pre('save', async function(next){
      // Verifica se la password è stata modificata, in caso contrario, passa oltre
  if (!this.isModified('password')) {
    return next();
  }
    /* bcrypt è una libreria utilizzata per crittografare le password. 
    bcrypt.genSalt(10) genera una stringa casuale aggiunta alla password per renderla 
    più sicura prima di essere criptata. Il numero 10 rappresenta il cost factor o livello 
    di complessità del processo di hashing. Più è alto, più sarà sicuro, ma anche più lento.
    bcrypt.hash() serve per criptare la password.*/
   const salt = await bcrypt.genSalt(10);
   this.password = await bcrypt.hash(this.password, salt);
})

/* 
    Si deve generare un JWT token firmato per un utente. 
    jwt.sign() è una funzione della libreria jsonwebtoken che crea un token JWT. 
    {id: this._id}: Questo è il payload del token. Il payload è l'informazione che vuoi includere nel token
    (abbiamo scelto l'id ma poteva essere quello che mi pare). process.env.JWT_SECRET è il secret usato 
    per firmare il token. Il token JWT viene firmato con una chiave segreta, che solo il server conosce. 
    In questo caso, la chiave segreta è presa da una variabile d'ambiente (process.env.JWT_SECRET).
    Firmare un token garantisce che il contenuto del token non venga alterato da utenti malintenzionati.
 */
UserSchema.methods.getSignedJwtToken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET);
}

/* controllare che la password criptata corrisponda a quello che l'utente ha digitato
*/
UserSchema.methods.matchPassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}

module.exports = mongoose.model('User', UserSchema);