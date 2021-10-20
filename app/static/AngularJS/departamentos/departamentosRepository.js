var departamentosURL = global_settings.urlCORS + 'api/departamentos/';

registrationModule.factory('departamentosRepository', function($http) {
    return {
        getInfoDepartamentos: function() {
            return $http({
                url: departamentosURL + 'InfoDepartamentos/',
                method: "GET",
                params: {},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },
        actualizarPorcentaje: function(iddepartamento, estatus, idusuario) {
            return $http({
                url: departamentosURL + 'actualizarPorcentaje/',
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
    };
});
