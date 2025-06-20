
require('dotenv').config();
const express = require('express');
const { dbConnection } = require('./db/config');
const cors = require('cors');


const app = express();

// Base de datos
dbConnection();

//CORS
app.use(cors());

//Directorio publico
app.use( express.static('public') );

//Lectura y parseo del body
app.use( express.json() );

//Rutas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/events', require('./routes/events'));


app.listen( process.env.PORT, () => {
    console.log(`Server is running on port ${ 4000 }`);
} );
