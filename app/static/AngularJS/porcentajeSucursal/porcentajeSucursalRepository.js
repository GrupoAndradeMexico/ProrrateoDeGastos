var porcentajesURL = global_settings.urlCORS + 'api/porcentajeSucursal/';

registrationModule.factory('porcentajeSucursalRepository', function($http) {
    return {
        getInfoPorcentajes: function(anio, mes) {
            return $http({
                url: porcentajesURL + 'InfoPorcentajes/',
                method: "GET",
                params: {
                    anio: anio, 
                    mes: mes
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getsucursales: function(anio, mes) {
            return $http({
                url: porcentajesURL + 'sucursales/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };
});
