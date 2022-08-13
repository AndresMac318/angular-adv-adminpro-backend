const jwt = require('jsonwebtoken');

const generateJWT = (uid) => {

    return new Promise( (resolve, reject) => {

        const payload = {
            uid
        }
    
        jwt.sign( payload, process.env.JWT_SECRET, {
            expiresIn: '6h'
        }, (err, token) => { //3er argumento es un callback con la respuesta de si se genero el jwt o hubo error
    
            if (err) {
                console.log(err);
                reject('No se pudo generar el JWT');
            } else {
                resolve( token );
            }
        });
    });
    
}

module.exports = {
    generateJWT,
}