var gastosURL = global_settings.urlCORS + 'api/gastosNoCentra/';

registrationModule.factory('gastosNoCentraRepository', function($http) {
    return {
        getInfoGastos: function(pagadora, anio, mes, quincena ) {
            return $http({
                url: gastosURL + 'InfoGastos/',
                method: "GET",
                params: {
                    pagadora: pagadora,
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
