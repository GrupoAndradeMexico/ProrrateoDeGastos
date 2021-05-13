var prorrateoSucursalURL = global_settings.urlCORS + 'api/prorrateoSucursal/';

registrationModule.factory('prorrateoSucursalRepository', function($http) {
    return {
        
        getTipoComprobanteXPagadora: function(idpagadora) {
            return $http({
                url: prorrateoSucursalURL + 'TipoComprobanteXPagadora/',
                method: "GET",
                params: {idpagadora: idpagadora},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getPlantillasXPagadora: function(idpagadora) {
            return $http({
                url: prorrateoSucursalURL + 'PlantillasXPagadora/',
                method: "GET",
                params: {idpagadora: idpagadora},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getBalanza: function(idpagadora, cargo, abono, cargomes, abonomes, anio) {
            return $http({
                url: prorrateoSucursalURL + 'Balanza/',
                method: "GET",
                params: {
                    idpagadora: idpagadora,
                    cargo: cargo,
                    abono: abono,
                    cargomes: cargomes,
                    abonomes: abonomes,
                    anio: anio
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        getPorcentajesGastos: function(mes, anio) {
            return $http({
                url: prorrateoSucursalURL + 'porcentajesGastos/',
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
    };
});
