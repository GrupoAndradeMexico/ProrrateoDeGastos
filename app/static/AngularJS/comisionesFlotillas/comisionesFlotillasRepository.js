var comisionesFlotillasURL = global_settings.urlCORS + 'api/comisionesFlotillas/';

registrationModule.factory('comisionesFlotillasRepository', function($http) {
    return {
        getInfoDepartamentosComisiones: function() {
            return $http({
                url: comisionesFlotillasURL + 'InfoDepartamentosComisiones/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizarPorcentaje: function(iddepartamento, estatus, idusuario) {
            return $http({
                url: comisionesFlotillasURL + 'actualizarPorcentaje/',
                method: "GET",
                params: {
                    iddepartamento: iddepartamento,
                    estatus: estatus, 
                    idusuario: idusuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        detalleFlotillas: function(idFlotilla) {
            return $http({
                url: comisionesFlotillasURL + 'detalleFlotillas/',
                method: "GET",
                params: {
                    idFlotilla: idFlotilla
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        eliminaSucFlotilla: function(idDetalleFlotilla, idUsuario) {
            return $http({
                url: comisionesFlotillasURL + 'eliminaSucFlotilla/',
                method: "GET",
                params: {
                    idDetalleFlotilla: idDetalleFlotilla,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        insertarSucFlotilla: function(IdFlotilla, idSucursal, porcentaje, idUsuario) {
            return $http({
                url: comisionesFlotillasURL + 'insertarSucFlotilla/',
                method: "GET",
                params: {
                    IdFlotilla: IdFlotilla,
                    idSucursal: idSucursal,
                    porcentaje: porcentaje,
                    idUsuario: idUsuario
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
    };
});
