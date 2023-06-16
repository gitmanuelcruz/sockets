const {dbSeguridad,dbconnecta} = require('../database/config')

const getTipoUsuario = async(data)=>{
    const sql = "SELECT tu.cve_tipo_usuario FROM seg_usuarios a "+
                "INNER JOIN seg_tipo_usuario tu ON a.id_tipo_usuario = tu.id_tipo_usuario "+
                "WHERE seg_usuario =:1";    

    let result = await dbSeguridad(sql,[data.usuario],false);

    let tipoUsuario;

    result.rows.map(user=>{
        tipoUsuario = user[0]
    });
    return tipoUsuario;
}

const getTotalCambios=async(data)=>{
    const sql = "SELECT COUNT(a.id_notificacion_cambio) "+
                "   FROM notificaciones_cambio a"+
                " WHERE EXTRACT(YEAR FROM fecha_movimiento) = EXTRACT(YEAR FROM fecha_movimiento) "+
                " AND EXTRACT(MONTH FROM fecha_movimiento) =EXTRACT(MONTH FROM fecha_movimiento)";

    let result = await dbconnecta(sql,[],false);

    let totalMovimientos;

    result.rows.map(movimiento=>{
        totalMovimientos = movimiento[0]
    });
    return totalMovimientos;
}

module.exports={
    getTipoUsuario,
    getTotalCambios
}