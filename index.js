//importar el eso de variables de entorno
require('dotenv').config();

//declara la instancia de express
const express = require('express');

//importacion cors
const cors = require('cors');


//importacion de la configuracion  de conexion a la db
const { dbConnection } = require('./database/config');

//crear el server de express
const app = express();

//configurar cors
app.use(cors());

//? carpeta publica: permite mostrar la pagina html 
app.use( express.static('public') );

//lectura y parseo
app.use( express.json() );

//base de datos
dbConnection();

//console.log(process.env); //tds las var de entorno que usa node de momento

/*
! ************ RUTAS *************
? :: Inicio middleware 
* cualquier peticion que pase por '/api/usuarios' o haga un llamado, sera respondida por el
* router require('./routes/usuarios.route') */

app.use('/api/usuarios', require('./routes/usuarios.route'));
app.use('/api/hospitales', require('./routes/hospitales.route'));
app.use('/api/medicos', require('./routes/medicos.route'));
app.use('/api/todo', require('./routes/busquedas.route'));
app.use('/api/login', require('./routes/auth.route'));
app.use('/api/upload', require('./routes/uploads.route'));

//? :: Fin Middleware

app.listen(process.env.PORT, () => {
    console.log('Server Running in PORT: '+process.env.PORT);
})