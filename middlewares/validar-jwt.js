
const jwt = require('jsonwebtoken');

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
        return req.res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }
}



module.exports = {
    validarJWT
}