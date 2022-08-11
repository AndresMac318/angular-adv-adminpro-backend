const mongoose = require('mongoose');

const dbConnection = async () => {
    
    try {
        await mongoose.connect(
            process.env.DB_CNN
        /* ,
        {
            useNewUrlParser: true,
            useUnifiedTopoloogy: true,
            useCreateIndex: true
        }  */
        );

        //* paso la conexion
        console.log('Database connected!');
        
    } catch (error) {
        console.log(error);
        throw new Error('Error en la conexión con la database')

    }
}

module.exports = {
    dbConnection
}