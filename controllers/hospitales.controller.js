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

const updateHospital = (req , res = response) => {
    res.json({
        ok: true,
        msg: 'updateHospital'
    })
}

const deleteHospital = (req , res = response) => {
    res.json({
        ok: true,
        msg: 'deleteHospital'
    })
}

module.exports = {
    getHospitales,
    createHospital,
    updateHospital,
    deleteHospital
}