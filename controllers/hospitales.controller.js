const { response } = require('express');
const Hospital = require('../models/hospital.model');

const getHospitales = async (req , res = response) => {

    const hospitales = await Hospital.find()
                                        .populate('usuario', 'nombre img') //? quien creo el hospital
                                    
    res.json({
        ok: true,
        hospitales
    })
}

const createHospital = async(req , res = response) => {

    // ? como ya se paso por el middleware de autenticacion de jwt el uid del que esta creando el hospital viene en la req 
    const uid = req.uid;
    
    // ? se debe enviar el id del que esta grabando el hospital en el body para que se cumpla la referencia
    const hospital = new Hospital({ //se desestructura el body
        usuario: uid, //se manda en el body el usuario: uid para cumpplir la ref
        ...req.body // se extrae td lo que este en el body
    });

    //console.log('hereee!!!', uid);

    try {

        const hospitalDB = await hospital.save();

        res.json({
            ok: true,
            hospital: hospitalDB //*se envia el hospital q se grabo en mongo
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}

const updateHospital = async (req , res = response) => {

    const id = req.params.id;

    //*como se paso por la autenticacion del JWT se tiene 
    const uid = req.uid;

    try {

        const hospitalDB = await Hospital.findById(id);

        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        //ya se sabe que el hospital existe, ahora se actualiza
        /* 
        ?si se va a cambiar un solo campo: 
        hospital.nombre = req.body.nombre; */

        //*Otra forma de actualizar seria ...
        const cambiosHospital = {
            ...req.body,
            usuario: uid, //si otro admin diferente es quien actualiza, se actualiza
        }

        //* grabando en la mongo || {new : true} es para obtener el documento con los cambios recien realizados
        const hospitalActualizado = await Hospital.findByIdAndUpdate(id, cambiosHospital, {new: true}) 
        
        res.json({
            ok: true,
            hospital: hospitalActualizado
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

const deleteHospital = async (req , res = response) => {
    
    const id = req.params.id;

    try {

        const hospitalDB = await Hospital.findById(id);

        if(!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        //* Eliminar el hospital de mongo
        await Hospital.findByIdAndDelete( id );

        /*
        ! actualmente no se recomienda eliminar de la base de datos, mantener la integridad y ref de la db
        ! lo recomendado es desabilitar una bandera, ej:  activo: false
        */
        res.json({
            ok: true,
            msg: 'Hospital eliminado'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getHospitales,
    createHospital,
    updateHospital,
    deleteHospital
}