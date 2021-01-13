
var plantilla = global_settings.urlCORS+'api/plantillaProrrateo/'
registrationModule.factory('plantillaProrrateoRepository', function($http){
    return{
        guardaCabecero: function(data) {
            return $http({
                url: plantilla + 'guardaCabecero/',
                method: "GET",
                params: {
                    nombreRelacion:data.nombreRelacion,
                    ordencompra:data.ordencompra,
                    idEsquema:data.idEsquema,
                    idEmpresa:data.idEmpresa,
                    idSucursal:data.idSucursal,
                    Frecuencia:data.Frecuencia,
                    fechaInicio:data.fechaInicio,
                    idUsuario:data.idUsuario,
                    esplantilla:data.esplantilla
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardaDetalleCabecero: function(data) {
            return $http({
                url: plantilla + 'guardaDetalleCabecero/',
                method: "GET",
                params: {
                    idPlantilla:data.idPlantilla,
                    idArea:data.idArea,
                    areaDescripcion:data.areaDescripcion,
                    idConcepto:data.idConcepto,
                    conceptoDescripcion:data.conceptoDescripcion,
                    idUsuario:data.idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardaRelacion: function(data) {
            return $http({
                url: plantilla + 'guardaRelacion/',
                method: "GET",
                params: {
                    idEmpresaOrden: data.idEmpresaOrden,
                    idSucursalOrden: data.idSucursalOrden,
                    idAreaOrden: data.idAreaOrden,
                    areaOrden: data.areaOrden,
                    idConceptoOrden: data.idConceptoOrden,
                    conceptoOrden: data.conceptoOrden,
                    idEmpresaPro: data.idEmpresaPro,
                    idSucursalPro: data.idSucursalPro,
                    idAreaPro: data.idAreaPro,
                    areaPro: data.areaPro,
                    idConcepto: data.idConcepto,
                    conceptoPro: data.conceptoPro
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardaProrrateo: function(idEsquema,orden,data) {
            return $http({
                url: plantilla + 'guardaProrrateoOrden/',
                method: "GET",
                params: {
                    idEsquema: idEsquema,
                    idEmpresa: data.idEmpresaPro,
                    idSucursal: data.idSucursalPro,
                    Orden: orden,
                    Area: data.idAreaPro,
                    areaDEscripcion: data.areaPro,
                    Concepto: data.idConcepto,
                    conceptoDescripcion: data.conceptoPro

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        relacionesCreadas: function(data) {
            return $http({
                url: plantilla + 'relacionesCreadas/',
                method: "GET",
                params: {
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal,
                    areaDesc: data.areaDesc,
                    conceptoDesc: data.conceptoDesc

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

})