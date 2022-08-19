const { response } = require('express');
const Medico = require('../models/medico.model');

const getMedicos = async (req , res = response) => {

    const medicos = await Medico.find()
                                    .populate('usuario', 'nombre img')
                                    .populate('hospital', 'nombre img')

    res.json({
        ok: true,
        medicos
    })
}

const createMedico = async (req , res = response) => {

    //* se toma el uid xq ya se paso el middleware de autenticacion de jwt
    const uid = req.uid;


    //* instancia del modelo
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try{

        const medicoDB = await medico.save();

        res.json({
            ok: true,
            medico: medicoDB
        });

    } catch (error) {
        //console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });

    }

}

const updateMedico = (req , res = response) => {
    res.json({
        ok: true,
        msg: 'updateMedico'
    })
}

const deleteMedico = (req , res = response) => {
    res.json({
        ok: true,
        msg: 'deleteMedico'
    })
}

module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
}