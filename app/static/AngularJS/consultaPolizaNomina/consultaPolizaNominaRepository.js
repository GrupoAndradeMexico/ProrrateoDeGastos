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
        ObtieneAsientoContablePaga: function(fechaPagaSelected, tipoSelected ) {
            return $http({
                url: consultaPolizaNomna + 'ObtieneAsientoContablePaga/',
                method: "GET",
                params: {
                    fechaPagaSelected, 
                    tipoSelected
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
