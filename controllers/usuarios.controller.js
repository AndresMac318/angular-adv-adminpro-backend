const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario.model');
const { generateJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {
    
    // const usuarios = await Usuario.find({}, 'nombre); filtra y devuele el id y el nombre
    // const usuarios = await Usuario.find(); devuelve todo el contenido del registro
    const usuarios = await Usuario.find({}, 'nombre email role google');

    res.json({
        ok: 'true',
        usuarios,
        // uid: req.uid //info traida del middleware validar-jwt
    });
}

const createUsuario = async (req, res=response) => { //si no viene la res, esta sera de tipo response ayuda con autocompletado

    const { password, email } = req.body;

    try {
        //? Usuario.findOne() busca en la database si existe la propiedad especificada
        const existeEmail = await Usuario.findOne({email}); // || (email="andres@test.com")
        
        if (existeEmail) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo electronico ya esta registrado'
            });
        }

        //* se crea una const igual a una instancia de mi modelo y se le asignan los datos del body
        const usuario = new Usuario(req.body);

        //!Encriptar password, esto antes de guardar en la database
        const salt = bcrypt.genSaltSync(); //salt genera un numero aleatorio para ayudar a encriptar la password
        usuario.password = bcrypt.hashSync(password, salt); //se pasa la pass que el user escogio

        
        //*usuario.save() GUARDA mi usuario en la database
        await usuario.save();
        
        // se crea un token de usuario una vez grabado con exito
        const token = await generateJWT(usuario._id);
        // usuario.set('token', token); //se inserta la propiedad token en nuestro new usuario

        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado... revisar logs'
        })
    }

}

const updateUsuario = async ( req, res ) => {
    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        //*Actualizacion

        const { password, google, email, ...campos} = req.body; //se recibe el mismo body pero esta vez sacando pass y body

        if (usuarioDB.email !== email) {

            const existeEmail = await Usuario.findOne({email}); //verifica si el email nuevo lo posee otro usuario
            if (existeEmail) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario con ese email'
                });
            }
        }

        campos.email = email;        
        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, {new: true} );

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}

const deleteUsuario = async ( req, res ) => {

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );
        if (!usuarioDB) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }

}


module.exports = {
    getUsuarios,
    createUsuario,
    updateUsuario,
    deleteUsuario,
}