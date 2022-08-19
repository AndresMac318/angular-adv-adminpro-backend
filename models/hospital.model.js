const { Schema, model } = require('mongoose');

/*
* para usar mongoose se debe trabjar con modelos, ponen restricciones,
* se encargan de establecer como lucira cada registro en la database o coleccion
*/
const HospitalSchema = Schema({//* definicion de cd registro que estara dentro de la coleccion o tabla
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {
        required: true, //! ningun hospital se grabara sin el usuario
        type: Schema.Types.ObjectId, //indica a mongoose que habra relacion entre este documento y el que se indique en la ref
        ref: 'Usuario'
    }
}, { collection: 'hospitales' }); //*se cambia el nombre en mongoose NO hospitals

// ? se renombra como se guarda el _id == uid en la base de datos
HospitalSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject(); //*se retira la version del objeto
    return object;
})


//implementacion del modelo
module.exports = model( 'Hospital', HospitalSchema );