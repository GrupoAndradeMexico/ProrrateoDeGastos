
var prorrateoOrdenURL = global_settings.urlCORS + 'api/prorrateoOrden/';
var esquemaProrrateoURL = global_settings.urlCORS + 'api/esquemaProrrateo/';

registrationModule.factory('esquemaProrrateoRepository', function($http){

    return{
        getEmpresas: function() {
            return $http({
                url: prorrateoOrdenURL + 'empresas/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getSucursales: function(idempresa) {
            return $http({
                url: prorrateoOrdenURL + 'sucursales/',
                method: "GET",
                params: {idempresa: idempresa},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getAllSucursal: function(){
            return $http({
                url: esquemaProrrateoURL + 'sucursalesAll/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDetalleEsquema: function(idEncabezado){
            return $http({
                url: esquemaProrrateoURL + 'detalleEsquema/',
                method: "GET",
                params: {idEncabezado:idEncabezado},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardaEncabezado: function(nombre, idEmpresa, idSucursal, idUsuario){
            return $http({
                url: esquemaProrrateoURL + 'guardaEncabezado/',
                method: "GET",
                params: {
                    nombre:nombre,
                    idEmpresa:idEmpresa,
                    idSucursal:idSucursal,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardaDetalle: function(data){
            return $http({
                url: esquemaProrrateoURL + 'guardarDetalle/',
                method: "GET",
                params: {
                    idEmpresa:data.idEmpresa,
                    idSucursales:data.idSucursales,
                    idEncabezado:data.idEncabezado,
                    porcentaje:data.porcentaje,
                    idUsuario:data.idUsuario,
                    idConcepto:data.idConcepto,
                    conceptoDesc:data.conceptoDesc
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        buscaEsquemas: function(data){
            return $http({
                url: esquemaProrrateoURL + 'buscaEsquemas/',
                method: "GET",
                params: {
                    mes:data.mes,
                    anio:data.anio,
                    idEmpresa:data.idEmpresa,
                    idSucursal:data.idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizaEsquema: function(data){
            return $http({
                url: esquemaProrrateoURL + 'actualizaEsquema/',
                method: "GET",
                params: {
                    idDetalle:data.idDetalle,
                    idUsuario:data.idUsuario,
                    idEmpresa:data.idEmpresa,
                    idSucursal:data.idSucursal,
                    porcentaje:data.porcentaje,
                    idConcepto:data.idConcepto,
                    conceptoDesc:data.conceptoDesc,
                    idArea:data.idArea,
                    areaDesc:data.areaDesc
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        eliminaDetalleEdicion: function(indice, idUsuario){
            return $http({
                url: esquemaProrrateoURL + 'eliminaDetalleEdicion/',
                method: "GET",
                params: {
                    indice:indice,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        desactivaEsquema: function(indice, idUsuario){
            return $http({
                url: esquemaProrrateoURL + 'desactivaEsquema/',
                method: "GET",
                params: {
                    indice:indice,
                    idUsuario:idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getConceptos: function(idSucursal){
            return $http({
                url: esquemaProrrateoURL + 'conceptos/',
                method: "GET",
                params: {
                    idSucursal:idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }

})