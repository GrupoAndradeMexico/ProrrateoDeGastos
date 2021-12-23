var reporteConciliacion = global_settings.urlCORS + 'api/reporteConciliacion/';

registrationModule.factory('reporteNominaRepository', function($http) {
    return {
        conciliacion: function(  work_locat,mes,anio ) {
            return $http({
                url: reporteConciliacion + 'conciliacion/',
                method: "GET",
                params: {
                    work_locat: work_locat,
                    mes:mes,
                    anio:anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        empleados: function( mes,anio ) {
            return $http({
                url: reporteConciliacion + 'empleados/',
                method: "GET",
                params: {
                    mes:mes,
                    anio:anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        empleadosProrrateados: function( ) {
            return $http({
                url: reporteConciliacion + 'empleadosProrrateados/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        empleadosProrrateadosSucursal: function( idWorkLocat ) {
            return $http({
                url: reporteConciliacion + 'empleadosProrrateadosSucursal/',
                method: "GET",
                params: {
                    idWorkLocat:idWorkLocat
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ReporteConcentrado: function( mes,anio ) {
            return $http({
                url: reporteConciliacion + 'ReporteConcentrado/',
                method: "GET",
                params: {
                    mes:mes,
                    anio:anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        ListaConceptosConcentrado: function( mes,anio ) {
            return $http({
                url: reporteConciliacion + 'ListaConceptosConcentrado/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    }
});