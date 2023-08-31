
const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario.model');

const validarJWT = (req, res, next) => {

    //leer el token
    const token = req.header('x-token');

    //console.log(token);
    
    if (!token) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });
    }

    //* Validacion del token
    try {
        //? si hace match la semilla y el token se ejecutan las lineas sgtes
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);

        //obtiene el uid del usuario loggeado
        //*console.log(uid);
        req.uid = uid; //se establece info en la req

        next();

    } catch (error) {
        //? si ocurre un error en la verificacion quedara capturado en el catch
        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }
}

const validarADMIN_ROLE = async(req, res, next) => {
    
    const uid = req.uid;
    
    try {

        const usuarioDB = await Usuario.findById(uid);

        if (usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }

        if (usuarioDB.role !== 'ADMIN_ROLE') {
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para realzar esta acción'
            })
        }

        next();
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const validarADMIN_ROLE_o_MismoUsuario = async(req, res, next) => {
    
    const uid = req.uid;
    const id = req.params.id; //usuario activo
    
    try {

        const usuarioDB = await Usuario.findById(uid);

        if (usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            })
        }

        if (usuarioDB.role === 'ADMIN_ROLE' || uid === id) { //usuario que quiere modificar su mismo rol
            
            next();
        
        } else{
            
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para realzar esta acción'
            });
        }

        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}