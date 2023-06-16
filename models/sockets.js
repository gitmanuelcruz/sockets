const { getNotificaciones} = require('../controllers/notificaciones');
const {getTipoUsuario,getTotalCambios} = require('../controllers/notificacioncambios')
const {getUsers,insertaNotificacion,getUsuarioEnvioSolicitud,getUsuarioRechazoBien,setMensajeLeido,
    getUsuarioAtiendeSolicitud,getUsersDependencia,getUsuarioValido} = require('../controllers/patrimonio');

class Sockets{
    constructor( io ){
        this.io = io;
        this.socketEvents(); 
    }
    socketEvents(){
        //on connection
        this.io.on("connection",async(socket)=>{
            console.log("Cliente conectado");
            socket.on("message-to-patrimonio",async(payload)=>{
               const users =  await getUsers(payload.idSolicitud);
               for(let i=0;i<users.length;i++){
                    insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":users[i].rfcUsuario,"idSolicitud":payload.idSolicitud})
                    this.io.emit("nota-privada",{"para":users[i].rfcUsuario,"mensaje":payload.mensaje,"icono":"success"});
                }
            });

            socket.on("notificacion-rechazo",async(payload)=>{
                const usuario = await getUsuarioEnvioSolicitud(payload);
                await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":"error"});
            });

            socket.on("notificacion-validacion",async(payload)=>{
                const usuario = await getUsuarioEnvioSolicitud(payload);
                await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":"success"});
            });

            socket.on("notificacion-correccion",async(payload)=>{
                const usuario = await getUsuarioRechazoBien(payload);
                await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":"success"});
            });
           
            socket.on("get-notificaciones",async(payload)=>{
                const json = {"notificaciones":await getNotificaciones(payload),"para":payload.usuario};
                this.io.emit("mis-notificaciones",json);
            });

            socket.on("message-leido",async(payload)=>{
                await setMensajeLeido(payload);
                const json = {"notificaciones":await getNotificaciones(payload),"para":payload.usuario};
                //this.io.emit("mis-notificaciones",json);
            });

            socket.on("notificacion-to-usersolicitud",async(payload)=>{
                const usuario = await getUsuarioEnvioSolicitud(payload);
                await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":payload.icono});

                if (payload.refrescar!=undefined)
                    this.io.emit(payload.refrescar,{"para":usuario,"idSolicitud":payload.idSolicitud});
                
            });

            socket.on("notificar_solicitud_adjunta",async(payload)=>{
                const usuario = await getUsuarioValido(payload);
                await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":payload.icono});

                if (payload.refrescar!=undefined)
                this.io.emit(payload.refrescar,{"para":usuario,"idSolicitud":payload.idSolicitud});
            })

            socket.on("notificacion-aprobacion",async(payload)=>{
                const usuario = await getUsuarioEnvioSolicitud(payload);
                await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":payload.icono});
            })

            socket.on("notificacion-to-usersolicitudRefrescar",async(payload)=>{
                const usuario = await getUsuarioEnvioSolicitud(payload);

                if (payload.refrescar!=undefined)
                    this.io.emit(payload.refrescar,{"para":usuario,"idSolicitud":payload.idSolicitud});
            });

            socket.on("notificacion-to-userpatrimonio",async(payload)=>{
                const usuario = await getUsuarioAtiendeSolicitud(payload);
                if (payload.mensaje!=undefined){
                    await insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":usuario,"idSolicitud":payload.idSolicitud})
                    this.io.emit("nota-privada",{"para":usuario,"mensaje":payload.mensaje,"icono":payload.icono});
                }

                if (payload.refrescar!=undefined)
                    this.io.emit(payload.refrescar,{"para":usuario,"idSolicitud":payload.idSolicitud});

            });
            

            socket.on("message-to-user-dependencias",async(payload)=>{
                const users =  await getUsersDependencia(payload.usuario);
                for(let i=0;i<users.length;i++){
                     insertaNotificacion({'mensaje':payload.mensaje,"de":payload.usuario,"para":users[i].rfcUsuario,"idSolicitud":null})
                     this.io.emit("nota-privada",{"para":users[i].rfcUsuario,"mensaje":payload.mensaje,"icono":"success"});
                 }
            });

            socket.on("get-notificacion-cambios",async(payload)=>{
                const tipoUsuario = await getTipoUsuario(payload);
                if(tipoUsuario ==='ADMIN_PATRIMONIO'){
                    const totalCambios = await getTotalCambios(payload);
                    this.io.emit("total-cambios-ente",{"totalCambios":totalCambios,"para":payload.usuario});
                }
            });

            socket.on("set-cambio",async(payload)=>{
                this.io.emit("set-cambio",{"total":1});
            });
        });
    }
}
module.exports =Sockets;