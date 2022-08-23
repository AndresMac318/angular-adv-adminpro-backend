/* 
* Ruta: /api/medicos
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getMedicos, createMedico, updateMedico, deleteMedico } = require('../controllers/medicos.controller');


const router = Router();

router.get('/', getMedicos);

router.post(
    '/', 
    [
        validarJWT,
        check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
        check('hospital', 'El hospital id debe ser válido').isMongoId(),//* valida si corresponde a un id de mongo valido
        validarCampos
    ],
    createMedico
);

router.put(
    '/:id', 
    [
        validarJWT,
        check('nombre', 'El nombre del medico es requerido').not().isEmpty(),
        check('hospital', 'El hospital es requerido').not().isEmpty(),
        validarCampos
    ], 
    updateMedico
);

router.delete(
    '/:id',
    deleteMedico
)

module.exports = router;