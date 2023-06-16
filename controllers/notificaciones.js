const {dbconnecta} = require('../database/config')
const getNotificaciones = async(data)=>{
    const sql = "SELECT id_notificacion,'('||ep.desc_ente_publico_abreviada||') '||u.nombre_usuario||' '||u.apellido_paterno_usuario de,para,texto,id_solicitud,"
                +" (CASE WHEN TRUNC(n.fecha_registro) = TRUNC(SYSDATE) THEN TO_CHAR(n.fecha_registro,'hh24:mi:ss') ELSE TO_CHAR(n.fecha_registro,'dd/mm/rrrr hh24:mi:ss') END ) fecha,leido"
                +" FROM notificacion n"
                +" LEFT JOIN cat_usuarios u ON n.de = u.rfc_usuario "
                +" INNER JOIN cat_entes_publicos ep ON u.id_ente_publico_usuario = ep.id_ente_publico"
                +"   WHERE para = :1"
                +"   AND leido = 0"
                +" ORDER BY n.fecha_registro desc";    

    let result = await dbconnecta(sql,[data.usuario],false);

    Mensajes =[]

    result.rows.map(mensaje=>{
        let datos = {
            "idNotificacion":mensaje[0],
            "de":mensaje[1],
            "para":mensaje[2],
            "mensaje":mensaje[3],
            "idSolicitud":mensaje[4],            
            "fecha":mensaje[5],
            "leido":mensaje[6]
        };
        Mensajes.push(datos);
    });
    return Mensajes;
}

module.exports={
    getNotificaciones
}