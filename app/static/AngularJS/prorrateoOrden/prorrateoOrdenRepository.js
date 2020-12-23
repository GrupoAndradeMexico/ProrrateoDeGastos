var prorrateoOrdenURL = global_settings.urlCORS + 'api/prorrateoOrden/';

registrationModule.factory('prorrateoOrdenRepository', function($http) {
    return {
        
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
        getOrdenes: function(idempresa, idsucursal, fechaInicio, fechaFin) {
            return $http({
                url: prorrateoOrdenURL + 'ordenesCompra/',
                method: "GET",
                params: {
                    idempresa: idempresa,
                    idsucursal: idsucursal,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getEsquemas: function(idEmpresa, idSucursal, mes, anio) {
            return $http({
                url: prorrateoOrdenURL + 'esquemas/',
                method: "GET",
                params: {
                    idEmpresa: idEmpresa,
                    idSucursal: idSucursal,
                    mes: mes,
                    anio: anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        prorrateoOrden: (idsucursal,monto,esquema, orden) => {
            return $http({
                url: prorrateoOrdenURL + 'prorrateoOrden/',
                method: "GET",
                params: {
                       idsucursal: idsucursal,
                       monto: monto,
                       esquema: esquema,
                       orden: orden
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        detalleOrden: (orden) => {
            return $http({
                url: prorrateoOrdenURL + 'detalleOrden/',
                method: "GET",
                params: {
                       orden: orden
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getAreaAfectacion: (idEmpresa, idSucursal) => {
            return $http({
                url: prorrateoOrdenURL + 'areaAfectacion/',
                method: "GET",
                params: {
                       idEmpresa,
                       idSucursal
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getConceptosProrrateo: (idEmpresa, idSucursal) => {
            return $http({
                url: prorrateoOrdenURL + 'conceptosProrrateo/',
                method: "GET",
                params: {
                       idEmpresa,
                       idSucursal
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        guardarRelacion: (data) => {
            return $http({
                url: prorrateoOrdenURL + 'guardarRelacion/',
                method: "GET",
                params: {
                    idEsquema: data.idEsquema,
                    idEmpresa: data.idEmpresa,
                    idSucursal: data.idSucursal,
                    Orden: data.Orden,
                    Area: data.Area,
                    Concepto: data.Concepto,
                    TipoIVA: data.TipoIVA,
                    monto: data.monto

                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };
});
