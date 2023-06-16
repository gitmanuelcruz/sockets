const {dbconnecta} = require('../database/config');

const getDatosBien=async(data)=>{
    const sql = "SELECT bien.id_bien_mueble,bien.id_tipo_bien, bien.num_inventario_get "+
                ", bien.num_serie_bien_mueble "+
                ", nvl(bien.num_factura_bien_mueble,'S/F') num_factura, nvl(to_char(bien.fecha_factura_bien_mueble,'dd/mm/rrrr'),'S/F') fecha_factura "+
                ", tb.desc_tipo_bien tipo_bien,bien.precio_unitario_bien_mueble precio_unitario "+
                ", bien.monto_iva importe_iva "+
                ", bien.costo_total_bien_mueble valor_bien "+
                ", bien.cve_estatus_bien_mueble estatus_bien "+
                ", cb.codigo_cabmi||' '||cb.nombre_cabmi nombre_cabmi "+
                ", part.num_partida_pptal ||' '||part.nombre_partida_pptal nombre_partida "+
                ", tm.desc_tipo_bien_mueble, st.desc_subtipo_bien_mueble subtipo "+
                ", nvl(rfc_resguardo_bien_mueble,'S/N') rfc_resguardante "+
                ", nvl(nombre_resguardo_bien_mueble,'S/N') nombres_resguardante "+
                ", mr.desc_marca,m.desc_modelo "+
                ", ubica.desc_ubicacion_unidad_admtva, domicilio.desc_domicilio_completo_ep,ebm.desc_estatus_bien_mueble, bien.desc_modelo "+
                "FROM bien_mueble_"+data.control+"_inventario bien "+
                "INNER JOIN cat_tipo_bien tb ON bien.id_tipo_bien = tb.id_tipo_bien "+
                "LEFT JOIN cabmis cb ON bien.id_cabmi = cb.id_cabmi "+
                "LEFT JOIN cat_partidas_presupuestales part ON bien.id_partida_pptal = part.id_partida_pptal "+
                "LEFT JOIN cat_tipo_bien_mueble tm ON bien.id_tipo_bien_mueble = tm.id_tipo_bien_mueble "+
                "LEFT JOIN cat_subtipo_bien_mueble st ON bien.id_subtipo_bien_mueble = st.id_subtipo_bien_mueble AND bien.id_tipo_bien_mueble = st.id_tipo_bien_mueble "+
                "LEFT JOIN cat_marcas mr ON bien.id_marca_bien_mueble = mr.id_marca "+
                "LEFT JOIN cat_modelos m ON bien.id_modelo_bien_mueble = m.id_modelo AND bien.id_marca_bien_mueble = m.id_marca "+
                "LEFT JOIN cat_ubicaciones_unidad_admtva ubica ON bien.id_ubicacion_unidad_admtrativa = ubica.id_ubicacion_unidad_admtva "+
                "LEFT JOIN sab_cat_domicilio_ente_publico domicilio ON ubica.id_domicilio_unidad_admtva = domicilio.id_domicilio_ente_publico "+
                "INNER JOIN cat_estatus_bien_mueble ebm ON bien.cve_estatus_bien_mueble = ebm.cve_estatus_bien_mueble "+
            " WHERE bien.id_bien_mueble = :id";

    let result = await dbconnecta(sql,[data.id],false);
    let bien={};


    result.rows.map(row=>{
        let modelo = (row[1]===9)?row[17]:row[22];
        let estilo =(row[10]==='A')?"alert alert-success":"alert alert-danger";
        bien = { idBien:row[0],
                idTipoBien:row[1],                
                numInventarioget:row[2],
                numSerieBienMueble:row[3],
                numFactura:row[4],
                fechaFactura:row[5],
                nombreTipoBien:row[6],                
                precioUnitario:new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row[7]),
                importeIva:new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row[8]),
                valorBien:new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(row[9]),
                estatusBien:row[10],
                nombreCabmi:row[11],
                nombrePartida:row[12],
                rubro:row[13],
                subtipo:row[14],
                rfcResguardante:row[15],
                nombreResguardante:row[16],
                nombreMarca:row[17],
                nombreModelo:modelo,
                nombreUbicacion:row[19],
                domicilio:row[20],
                descEstatusBien:row[21],
                estilo:estilo,
                encontrado:true
                };
    });

    if(bien.encontrado ===undefined)
        bien.encontrado = false;

    return bien;

}
module.exports={
    getDatosBien
}