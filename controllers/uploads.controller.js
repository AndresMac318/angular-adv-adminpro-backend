const path = require('path'); // sirve para construir un path completo viene en node
const fs = require('fs');

const { response } = require('express');
const { v4: uuidv4 } = require('uuid');
const { actualizarImagen } = require('../helpers/actualizar-imagen');

const fileUpload = ( req, res = response) => {

    const tipo = req.params.tipo;
    const id = req.params.id;

    const tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    //*validar que pertenezca a un tipo valido
    if (!tiposValidos.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            msg: 'No es un medico, usuario u hospital (tipo)'
        });
    }

    //*validar la existencia en la req del archivo(s)
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            ok: false,
            msg: 'No hay archivos cargados'
        });
    }

    //*Procesar la imagen
    //?se tiene acceso a la img por el middleware que se establecio en la ruta: router.use(expressfileUpload())
    const file = req.files.imagen;

    //*generar o extraer la extension del archivo
    const nombreCortado = file.name.split('.'); // image.sc.d.jpg

    //*extension del archivo
    const extensionArchivo = nombreCortado[nombreCortado.length - 1];

    //*validar extension
    const extensionesValidas = ['jpg','png','jpeg','gif'];
    if (!extensionesValidas.includes(extensionArchivo)) {
        return res.status(400).json({
            ok: false,
            msg: 'La extension del archivo debe ser jpg, png, jpeg o gif'
        });
    }

    //?generar nombre archivo: asi no se sobreescribiran al tener nombre iguales
    const nombreArchivo = `${uuidv4()}.${extensionArchivo}`;

    //?path donde se alojara la imagen en el proyecto "server"
    const path = `./uploads/${ tipo }/${ nombreArchivo }`;

    // metodo para mover la imagen a una ruta deseada
    file.mv(path, (err) => {
        if (err){
            console.log(err);
            return res.status(500).json({
                ok: false,
                msg: 'Ocurrio un error al mover la imagen'
            });
        }

        //? actualizar la database
        actualizarImagen( tipo, id, nombreArchivo );

        //*si no hubo error la imagen se subio
        res.json({
            ok: true,
            msg: 'Archivo subido',
            nombreArchivo
        })
    });

}

const retornaImagen = (req, res = response) => {
    
    const tipo = req.params.tipo;
    const foto = req.params.foto;

    /*
        
        *join sirve para unir la ruta que se le de
        ?__dirname : proporciona toda la ubicacion donde se encuentra la app desplegada 
        ! se concatena el 2do arg que es el path de donde se encuentra la imagen fisicamente
    */
    const pathImg = path.join( __dirname, `../uploads/${ tipo }/${ foto }`); //* todo esto es el path completo de la imagen

    //imagen por defecto
    if (fs.existsSync( pathImg )) {
        res.sendFile(pathImg); // express retorna la imagen ocn esta instruccion
    } else {
        const pathImg = path.join(__dirname, `../uploads/no-img.jpg`);
        res.sendFile(pathImg);
    }

}

module.exports = {
    fileUpload,
    retornaImagen
}