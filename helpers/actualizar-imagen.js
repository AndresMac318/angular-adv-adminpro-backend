const fs = require('fs'); //permite leer carpetas y archivos

const Usuario = require('../models/usuario.model');
const Medico = require('../models/medico.model');
const Hospital = require('../models/hospital.model');

//* optimizacion de borrar imagen
const borrarImagen = ( path ) => {
    if(fs.existsSync( path )){ //existe este archivo en esta ruta?
        //borra la imagen
        fs.unlinkSync(path);
    } 
}

const actualizarImagen = async (tipo, id, nombreArchivo ) => {

    let pathViejo = '';

    switch (tipo) {
        case 'medicos':
            const medico = await Medico.findById(id);//trae el objeto del medico con este id
            if (!medico) { //* NO existe un medico con ese id ?
                console.log('No se encontro medico con este id');
                return false;
            }
            pathViejo = `./uploads/medicos/${ medico.img }`;
            borrarImagen(pathViejo);

            //* grabar el nuevo nombre de imagen al medico en la db
            medico.img = nombreArchivo;
            await medico.save();// guardar la img en el respectivo medico en mongo
            return true;

        case 'hospitales':
            const hospital = await Hospital.findById(id);//trae el objeto del medico con este id
            if (!hospital) { //* NO existe un hospital con ese id ?
                console.log('No se encontro hospital con este id');
                return false;
            }
            pathViejo = `./uploads/hospitales/${ hospital.img }`;
            borrarImagen(pathViejo);

            //* grabar el nuevo nombre de imagen al hospital en la db
            hospital.img = nombreArchivo;
            await hospital.save();
            return true;

        case 'usuarios':
            const usuario = await Usuario.findById(id);//trae el objeto del medico con este id
            if (!usuario) { //* NO existe un usuario con ese id ?
                console.log('No se encontro usuario con este id');
                return false;
            }
            pathViejo = `./uploads/usuarios/${ usuario.img }`;
            borrarImagen(pathViejo);

            //* grabar el nuevo nombre de imagen al usuario en la db
            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
    }
}


module.exports = {
    actualizarImagen
}