//importar el eso de variables de entorno
require('dotenv').config();

//declara la instancia de express
const express = require('express');

//cors
const cors = require('cors');

//importacion de la configuracion  de conexion a la db
const { dbConnection } = require('./database/config');

//crear el server de express
const app = express();

//configurar cors
app.use(cors());

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
app.use('/api/login', require('./routes/auth.route'));

//? :: Fin Middleware

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto: '+process.env.PORT);
})