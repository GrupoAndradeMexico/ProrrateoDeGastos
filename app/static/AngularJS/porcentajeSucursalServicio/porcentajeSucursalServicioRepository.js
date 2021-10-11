var porcentajesServicioURL = global_settings.urlCORS + 'api/porcentajeSucursal/';

registrationModule.factory('porcentajeSucursalServicioRepository', function($http) {
    return {
        getInfoPorcentajesServicio: function() {
            return $http({
                url: porcentajesServicioURL + 'InfoPorcentajesServicio/',
                method: "GET",
                params: {
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getLugaresTrabajo: function() {
            return $http({
                url: porcentajesServicioURL + 'ListaLugaresTrabajo/',
                method: "GET",
                params: {
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizarPorcentaje: function(consecutivo, porcentaje, idusuario) {
            return $http({
                url: porcentajesServicioURL + 'actualizarPorcentajeServicio/',
                method: "GET",
                params: {
                    consecutivo: consecutivo,
                    porcentaje: porcentaje,
                    idusuario: idusuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        guardarPorcentaje: function(porcentaje, idusuario, idSucursal) {
            return $http({
                url: porcentajesServicioURL + 'guardarPorcentajeServicio/',
                method: "GET",
                params: {
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
