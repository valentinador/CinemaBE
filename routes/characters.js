const express = require('express');
const {protect, authorize} = require('../middleware/auth')

//Express usa mergeParents per mergiare i parametri dalle rotte padre (film in questo caso)
//Se non si imposta {mergeParams: true}, i parametri dell'URL del router principale non vengono passati ai router figli.
const router = express.Router({mergeParams: true});

const {getCharacters, getCharacter, addCharacter, updateCharacter, deleteCharacter} = require('../controllers/characters');


router.route('/').get(getCharacters).post(protect, authorize('publisher'), addCharacter);
router.route('/:id').get(getCharacter).put(protect, authorize('publisher'), updateCharacter).delete(protect, authorize('publisher'), deleteCharacter);
router.route('/characters/:id').get(getCharacter);



module.exports = router;