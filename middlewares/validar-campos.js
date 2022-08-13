const { response } = require('express');
const { validationResult } = require('express-validator');

/*
? next se llamara si el presente middleware pasa, es decir continue con el sgte middleware
? o el controller que se esta protegiendo en la ruta
*/
const validarCampos = (req, res=response, next) => {
    //servira para capturar los errores si los hay en los middlewares
    //al pasar por el middleware del check, creara en la req un array con tds los errores que ocurrieron
    const errores = validationResult(req);
    if(!errores.isEmpty()){
        return res.status(400).json({
            ok:false,
            errors: errores.mapped()
        });
    }

    next();
}

module.exports = {
    validarCampos,
}