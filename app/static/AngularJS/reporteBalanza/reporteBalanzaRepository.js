var reporteBalanzaURL = global_settings.urlCORS + 'api/reporteBalanza/';

registrationModule.factory('reporteBalanzaRepository', function($http) {
    return {
        getreporteBalanza: function( anio, mes, quincena ) {
            return $http({
                url: reporteBalanzaURL + 'ReporteBalanza/',
                method: "GET",
                params: {
                    anio: anio, 
                    mes: mes,
                    quincena: quincena
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
    };
});
