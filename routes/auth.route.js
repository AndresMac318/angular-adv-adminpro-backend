/* 
*   Path: '/api/login'
*/

const { Router } = require('express');
const { check } = require('express-validator')

const { login, googleSignIn, renewToken } = require('../controllers/auth.controller');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
    '/', 
    [
        check('email', 'El email es requerido').isEmail(),
        check('password', 'La password es requerida').not().isEmpty(),
        validarCampos
    ],
    login
)

router.post(
    '/google', 
    [
        check('token', 'El token de Google es requerido').not().isEmpty(),
        validarCampos
    ],
    googleSignIn
)

router.get(
    '/renew', 
    validarJWT,
    renewToken
)


module.exports = router;