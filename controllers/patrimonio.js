const {dbconnecta} = require('../database/config')
const getUsers = async(data)=>{
    const sql = "SELECT UNIQUE rfc_acceso_usuario"
                 +"       FROM SIGGET_SAS_SEGURIDAD.SEG_ACCESO_USUARIO seg"
                 +"       WHERE seg.id_ente_publico_acceso = get_ente_solicitud("+data+")"
                 +"       AND seg.id_seg_sistema='BIENES'"
                 +"       AND cve_estatus = 'VIG'"
                 +"       AND EXISTS("
                 +"           SELECT NULL"
                 +"               FROM SIGGET_SAS_SEGURIDAD.SEG_ACCESO_PLANTILLA_USUARIO p"
                 +"               WHERE p.id_seg_sistema = 'BIENES'"
                 +"               AND acceso_plantilla IN( get_tb_solicitud("+data+"),'TODOS')"
                 +"               AND p.rfc_acceso_usuario = seg.rfc_acceso_usuario"
                 +"       )";
    let result = await dbconnecta(sql,[],false);

    Users =[]

    result.rows.map(mensaje=>{
        let datos = {
            "rfcUsuario":mensaje[0]
        };
        Users.push(datos);
    });

    return Users;
}

const insertaNotificacion = async(data)=>{
    const sql = "INSERT INTO notificacion(id_notificacion,texto,de,para,usuario_registro,id_solicitud)"
                +" values(seq_notificacion.nextval,:mensaje,:de,:para,:usuario,:id_solicitud)";
    
    let result = await dbconnecta(sql,[data.mensaje,data.de,data.para,data.de,data.idSolicitud],true);
}

const setMensajeLeido = async(data)=>{
    const sql = "Update notificacion set leido=1, fecha_leido = sysdate,usuario_leido=:usuario "
                +" WHERE id_notificacion =:notificacion AND leido=0";
    let result = await dbconnecta(sql,[data.usuario,data.idNotificacion],true);
}

const getUsuarioEnvioSolicitud = async(data)=>{
    const sql = "SELECT enviado_por FROM solicitudes WHERE id_solicitud = :solicitud";
    let result = await dbconnecta(sql,[data.idSolicitud],false);

    let usuario = "";
    result.rows.map(user=>{
        usuario = user[0];
    });
    return usuario;
}

const getUsuarioAtiendeSolicitud = async(data)=>{
    const sql = "SELECT usuario_atiende FROM solicitudes WHERE id_solicitud = :solicitud";
    let result = await dbconnecta(sql,[data.idSolicitud],false);

    let usuario = "";
    result.rows.map(user=>{
        usuario = user[0];
    });
    return usuario;
}

const getUsuarioRechazoBien = async(data)=>{
    const sql = "SELECT rechazado_por FROM bienes_alta WHERE id_bien_alta = :bien";
    let result = await dbconnecta(sql,[data.idBienAlta],false);

    let usuario = "";
    result.rows.map(user=>{
        usuario = user[0];
    });
    return usuario;
}

const getUsersDependencia = async(data)=>{

    const sql="SELECT UNIQUE AUS.RFC_ACCESO_USUARIO FROM SIGGET_SAS_SEGURIDAD.SEG_ACCESO_USUARIO AUS "+
    "INNER JOIN SIGGET_SAS_SEGURIDAD.SEG_USUARIOS USU ON AUS.RFC_ACCESO_USUARIO=USU.SEG_USUARIO AND AUS.CVE_ESTATUS = USU.CVE_ESTATUS "+
    "WHERE AUS.ID_SEG_SISTEMA='BIENES' "+
    "AND AUS.CVE_ESTATUS='VIG' "+
    "AND USU.SISTEMA='BIENES' "+
    "AND USU.ID_TIPO_USUARIO=3 "+
    "AND AUS.ID_ENTE_PUBLICO_ACCESO IN (SELECT UNIQUE ID_ENTE_PUBLICO_ACCESO FROM SIGGET_SAS_SEGURIDAD.SEG_ACCESO_USUARIO WHERE RFC_ACCESO_USUARIO='"+data+"' AND CVE_ESTATUS='VIG')";

    let result = await dbconnecta(sql,[],false);

    Users =[]

    result.rows.map(mensaje=>{
        let datos = {
            "rfcUsuario":mensaje[0]
        };
        Users.push(datos);
    });

    return Users;
}

const getUsuarioValido=async(data)=>{
    const sql = "SELECT validado_por FROM solicitudes WHERE id_solicitud = :idSolicitud";
    let result = await dbconnecta(sql,[data.idSolicitud],false);

    let usuario = "";
    result.rows.map(user=>{
        usuario = user[0];
    });
    return usuario;
}

module.exports={
    getUsers,
    insertaNotificacion,
    getUsuarioEnvioSolicitud,
    getUsuarioRechazoBien,
    setMensajeLeido,
    getUsuarioAtiendeSolicitud,
    getUsersDependencia,
    getUsuarioValido
}