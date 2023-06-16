// Servidor de Express
const express  = require('express');
const http     = require('http');
const socketio = require('socket.io');
const path     = require('path');
const cors     = require('cors');

const Sockets  = require('./sockets');
//const { dbConnection } = require('../database/config');
const {getDatosBien} = require('../controllers/bien');

class Server {
    constructor() {

        this.app  = express();
        this.port = process.env.PORT || 3000;

        // Conectar a DB
        //dbConnection();

        // Http server
        this.server = http.createServer( this.app );
        
        // Configuraciones de sockets
        this.io = socketio( this.server, { 
            cors: {
            origin: "*",
            methods: ["GET", "POST"],
            allowedHeaders: ["my-custom-header"]}
        });
    }
    configurarSockets() {
        new Sockets( this.io );
    }

    middlewares() {
        // Desplegar el directorio público
        this.app.set('view engine', 'ejs');
        this.app.use( express.static( path.resolve( __dirname, '../public' ) ) );
        this.app.use("/css", express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));

        // CORS
        this.app.use(cors());        
        // Parseo del body
        this.app.use( express.json() );

        // API End Points     
       /* this.app.post('/mensaje', function(req, res) {
            res.json({ mensaje: 'Método post' })   
        });*/

        this.app.get('/get/:control/:id',async function(req, res) {
            const bien = await getDatosBien({'id':req.params.id,'control':req.params.control});
            
            if(bien.encontrado)
                res.render('pages/bien', {bien});
            else
                res.render('pages/nofound', {bien}); 
        });
      //  this.app.use( '/api/login', require('../router/auth') );
      //  this.app.use( '/api/mensajes', require('../router/mensajes') );
    }

    execute() {

        // Inicializar Middlewares
        this.middlewares();

        // Inicializar sockets
        this.configurarSockets();

        // Inicializar Server
        this.server.listen( this.port, () => {
            console.log('Server corriendo en puerto:', this.port );
        });
    }

}

module.exports = Server;