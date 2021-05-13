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
                    monto: data.monto,
                    idDetalle: data.idDetalle
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDetalleProrrateoOrden: (idEsquema, folio,idConsecutivoOC) => {
            return $http({
                url: prorrateoOrdenURL + 'detalleProrrateoOrden/',
                method: "GET",
                params: {
                    idEsquema,
                    folio
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        delRelacionAreaConcepto: (id) => {
            return $http({
                url: prorrateoOrdenURL + 'delRelacionAreaConcepto/',
                method: "GET",
                params: {
                    id
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        insOrdenMasIva: (orden, idEmpresa, idSucursal,idEsquema) => {
            return $http({
                url: prorrateoOrdenURL + 'insOrdenMasIva/',
                method: "GET",
                params: {
                    orden, 
                    idEmpresa, 
                    idSucursal,
                    idEsquema
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        detallesOC: (detalles) => {
            return $http({
                url: prorrateoOrdenURL + 'detallesOC/',
                method: "GET",
                params: {
                    detalles
                    },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        },
        getDetalleProrrateoOrdenPlantilla: function(idEsquema) {
            return $http({
                url: prorrateoOrdenURL + 'detalleProrrateoOrdenPlantilla/',
                method: "GET",
                params: {
                    idEsquema: idEsquema
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDetalleProrrateoOrdenPlantillaOrdenes: function(idEsquema,folio) {
            return $http({
                url: prorrateoOrdenURL + 'detalleProrrateoOrdenPlantillaOrdenes/',
                method: "GET",
                params: {
                    idEsquema: idEsquema,
                    folio:folio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        detallesOCGroup: function(folio) {
            return $http({
                url: prorrateoOrdenURL + 'detallesOCGroup/',
                method: "GET",
                params: {
                    folio: folio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getDetalleOrdenRelacion: function(idEsquema,idIdentificador) {
            return $http({
                url: prorrateoOrdenURL + 'detalleOrdenRelacion/',
                method: "GET",
                params: {
                    idEsquema: idEsquema,
                    idIdentificador: idIdentificador
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };
});
