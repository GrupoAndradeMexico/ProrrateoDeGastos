var consultaPolizaNomna = global_settings.urlCORS + 'api/consultaPolizaNomina/';

registrationModule.factory('consultaPolizaNominaRepository', function($http) {
    return {
        FechasPagas: function(  mes,anio ) {
            return $http({
                url: consultaPolizaNomna + 'fechasPagas/',
                method: "GET",
                params: {
                    mes: mes,
                    anio: anio

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ObtieneAsientoContablePaga: function(lugarTrabajo,fechaPagaSelected, tipoSelected,frecuenciaSelected ) {
            return $http({
                url: consultaPolizaNomna + 'ObtieneAsientoContablePaga/',
                method: "GET",
                params: {
                    lugarTrabajo,
                    fechaPagaSelected, 
                    tipoSelected,
                    frecuenciaSelected
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        LugaresTrabajo: function() {
            return $http({
                url: consultaPolizaNomna + 'LugaresTrabajo/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        GeneraPoiizaIndividual: function(lugarTrabajo,fechaPagaSelected, tipoSelected,frecuenciaSelected ) {
            return $http({
                url: consultaPolizaNomna + 'GeneraPolizaIndividual/',
                method: "GET",
                params: {
                    lugarTrabajo,
                    fechaPagaSelected, 
                    tipoSelected,
                    frecuenciaSelected
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ConsultaBitacoraPolizas: function(mes, anio ) {
            return $http({
                url: consultaPolizaNomna + 'ConsultaBitacoraPolizas/',
                method: "GET",
                params: {
                    mes,
                    anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        GeneraOrdenesMasivas: function(mes, anio, fechaNomina, tipoNomina ) {
            return $http({
                url: consultaPolizaNomna + 'GeneraOrdenesMasivas/',
                method: "GET",
                params: {
                    mes,
                    anio,
                    fechaNomina,
                    tipoNomina
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        FechasPagasBitacora: function(  mes,anio ) {
            return $http({
                url: consultaPolizaNomna + 'FechasPagasBitacora/',
                method: "GET",
                params: {
                    mes: mes,
                    anio: anio

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ConsultaPoliza: function(  lugarTrabajo,idCabecero ) {
            return $http({
                url: consultaPolizaNomna + 'ConsultaPoliza/',
                method: "GET",
                params: {
                    lugarTrabajo,
                    idCabecero

                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
