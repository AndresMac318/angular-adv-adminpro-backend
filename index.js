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

//base de datos
dbConnection();

//console.log(process.env);

// rutas
app.get('/', (req, res) => {
    res.json({
        ok: 'true',
        msg: 'Hola Express'
    });
});

app.listen(process.env.PORT, () => {
    console.log('servidor corriendo en el puerto: '+process.env.PORT);
})