/* 
* Ruta: /api/todo/
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const { getTodo, getDocsColeccion } = require('../controllers/busquedas.controller');

const router = Router();

router.get(
    '/:busqueda',
    [ validarJWT ],
    getTodo
);

router.get(
    '/coleccion/:tabla/:busqueda',
    validarJWT,
    getDocsColeccion
);

module.exports = router;