/* 
* Ruta: /api/usuarios 
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { getUsuarios, createUsuario, updateUsuario, deleteUsuario } = require('../controllers/usuarios.controller');
const { validarJWT, validarADMIN_ROLE, validarADMIN_ROLE_o_MismoUsuario } = require('../middlewares/validar-jwt');

const router = Router();

router.get('/', validarJWT, getUsuarios);

router.post(
    '/', 
    [
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('password', 'La contraseña es requerida').not().isEmpty(),
        check('email', 'El email es requerido').isEmail(),
        validarCampos
    ],
    createUsuario
);

router.put(
    '/:id', 
    [
        validarJWT,
        validarADMIN_ROLE_o_MismoUsuario,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('email', 'El email es requerido').isEmail(),
        check('role', 'El role es requerido').not().isEmpty(),
        validarCampos,
    ], 
    updateUsuario
);

router.delete(
    '/:id',
    [validarJWT, validarADMIN_ROLE],
    deleteUsuario
)

module.exports = router;