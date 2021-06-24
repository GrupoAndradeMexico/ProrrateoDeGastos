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
        getsucursales: function() {
            return $http({
                url: porcentajesURL + 'sucursales/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizarPorcentaje: function(consecutivo,anio, mes,  porcentaje, idusuario) {
            return $http({
                url: porcentajesURL + 'actualizarPorcentaje/',
                method: "GET",
                params: {
                    consecutivo: consecutivo,
                    anio: anio, 
                    mes: mes,
                    porcentaje: porcentaje,
                    idusuario: idusuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardarPorcentaje: function(anio, mes, porcentaje, idusuario, idSucursal) {
            return $http({
                url: porcentajesURL + 'guardarPorcentaje/',
                method: "GET",
                params: {
                    anio: anio, 
                    mes: mes,
                    porcentaje: porcentaje,
                    idusuario: idusuario,
                    idSucursal: idSucursal
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };
});
