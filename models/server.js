const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/config');

class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.vehiclesPath = '/api/vehicles';
        this.connectDB();
        // Middlewares
        this.middlewares();
        this.routes();
    }
    async connectDB(){
        await dbConnection();
    }
    middlewares(){
        //CORS
        this.app.use(cors());
        //lectura y parseo del body
        this.app.use(express.json());
        //Directorio publico
        this.app.use(express.static('public'));
    }
    routes(){
        this.app.use(this.vehiclesPath, require('../routes/vehicles'));
    }
    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor corriendo en puerto', this.port);
        });
    }
}
module.exports = Server;