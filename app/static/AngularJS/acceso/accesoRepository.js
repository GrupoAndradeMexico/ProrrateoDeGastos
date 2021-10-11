var accesoURL = global_settings.urlCORS + 'api/acceso/';


registrationModule.factory('accesoRepository', function($http) {
    return {
        getPermisos: function(usuario, contrasena) {
            return $http({
                url: accesoURL + 'permisos/',
                method: "GET",
                params: {
                    usuario: usuario,
                    contrasena: contrasena
                },
                headers: {
                    'Content-Type': 'application/json'
                }

            });
        }
    };

});
