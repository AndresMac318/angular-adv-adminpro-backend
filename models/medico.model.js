const { Schema, model } = require('mongoose');

/*
* para usar mongoose se debe trabjar con modelos, ponen restricciones,
* se encargan de establecer como lucira cada registro en la database o coleccion
*/
const MedicoSchema = Schema({//* definicion de cd registro que estara dentro de la coleccion o tabla
    nombre: {
        type: String,
        required: true
    },
    img: {
        type: String,
    },
    usuario: {// ? ref saber q usuario creo al medico
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    hospital: {// ? ref saber a que hospital pertenece cada medico, puede ser a varios :  [ ]
        type: Schema.Types.ObjectId,
        ref: 'Hospital',
        required: true
    }
    
});

// ? se renombra como se guarda el _id == uid en la base de datos
MedicoSchema.method('toJSON', function(){
    const {__v, ...object} = this.toObject(); //se quita la version __v
    return object;
})


//implementacion del modelo
module.exports = model( 'Medico', MedicoSchema );