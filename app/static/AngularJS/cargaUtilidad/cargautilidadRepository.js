var cargaUtilidadlURL = global_settings.urlCORS + 'api/prorrateoSucursal/';

registrationModule.factory('cargaUtilidadRepository', function($http) {
    return {
        
        getCargaUtilidad: function() {
            return $http({
                url: cargaUtilidadlURL + 'utilidadesCarga/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        InsSemiNuevos: function(idSemiNuevos, SeminuevosUtilidad) {
            return $http({
                url: cargaUtilidadlURL + 'insSemiNuevos/',
                method: "GET",
                params: {
                    idSemiNuevos: idSemiNuevos,
                    SeminuevosUtilidad: SeminuevosUtilidad
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        InsRefacciones: function(idRefacciones, RefaccionesUtilidad) {
            return $http({
                url: cargaUtilidadlURL + 'insRefacciones/',
                method: "GET",
                params: {
                    idRefacciones: idRefacciones,
                    RefaccionesUtilidad: RefaccionesUtilidad
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        InsFlotillas: function(idFlotillas, FlotillasUtilidad) {
            return $http({
                url: cargaUtilidadlURL + 'insFlotillas/',
                method: "GET",
                params: {
                    idFlotillas: idFlotillas,
                    FlotillasUtilidad: FlotillasUtilidad
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
    };
});
