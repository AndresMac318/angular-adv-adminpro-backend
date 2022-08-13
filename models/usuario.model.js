const { Schema, model } = require('mongoose');

/*
* para usar mongoose se debe trabjar con modelos, ponen restricciones,
* se encargan de establecer como lucira cada registro en la database o coleccion
*/
const UsuarioSchema = Schema({//* definicion de cd registro que estara dentro de la coleccion o tabla
    nombre: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    img: {
        type: String,
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE'
    }, 
    google: {
        type: Boolean,
        default: false
    }, 
    token: {
        type: String,
    }
});

// ? se renombra como se guarda el _id == uid en la base de datos
UsuarioSchema.method('toJSON', function(){
    const {__v, _id, password, ...object} = this.toObject();
    object.uid = _id;
    return object;
})


//implementacion del modelo
module.exports = model( 'Usuario', UsuarioSchema );