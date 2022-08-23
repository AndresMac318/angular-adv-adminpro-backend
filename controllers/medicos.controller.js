const { response } = require('express');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

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

const updateMedico = async (req , res = response) => {

    const id = req.params.id;

    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById(id);

        const hospitalDB = await Hospital.findById(req.body.hospital);

        //* validando existencia en mongo del medico a actualizar
        if (!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }
        
        //* validando existencia en mongo del hospital
        if (!hospitalDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado por id'
            });
        }

        const cambiosMedico = {
            ...req.body,
            usuario: uid,
        }

        //actulizando en mongo los nuevos datos
        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});

        res.json({
            ok: true,
            medico: medicoActualizado
        })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });        
    }

    
}

const deleteMedico = async (req , res = response) => {
    
    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById(id);

        if(!medicoDB) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado por id'
            });
        }

        //* Eliminar el medico de mongo
        await Medico.findByIdAndDelete( id );

        /*
        ! actualmente no se recomienda eliminar de la base de datos, mantener la integridad y ref de la db
        ! lo recomendado es desabilitar una bandera, ej:  activo: false
        */
        res.json({
            ok: true,
            msg: 'Medico eliminado'
        });

    } catch (error) {

        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
}

module.exports = {
    getMedicos,
    createMedico,
    updateMedico,
    deleteMedico
}