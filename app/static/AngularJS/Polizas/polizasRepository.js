var polizasURL = global_settings.urlCORS + 'api/polizas/';

registrationModule.factory('polizasRepository', function($http) {
    return {
        getEmpresasPagadoras: function(idUsuario) {
            return $http({
                url: polizasURL + 'EmpresasPagadoras/',
                method: "GET",
                params: {idUsuario: idUsuario},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        },  
        getUnidadOrganizavaxPagadora: function(idpagadora) {
            return $http({
                url: polizasURL + 'UnidadOrganizativa/',
                method: "GET",
                params: {idpagadora: idpagadora},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getLugarTrabajoxPagadora: function(idpagadora) {
            return $http({
                url: polizasURL + 'LugardeTrabajo/',
                method: "GET",
                params: {idpagadora: idpagadora},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getTipoPolizaxPagadora: function(idpagadora, origen) {
            return $http({
                url: polizasURL + 'TipoPoliza/',
                method: "GET",
                params: {idpagadora: idpagadora, origen: origen},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getPagas: function(anio, mes) {
            return $http({
                url: polizasURL + 'Pagas/',
                method: "GET",
                params: {anio: anio, mes: mes},
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
      getInfoNominas: function(paga, poliza, frecuencia, lugarTrabajo, anio, mes, pagadora) {
            return $http({
                url: polizasURL + 'InfoNomina/',
                method: "GET",
                params: {
                    paga: paga,
                    poliza: poliza,
                    frecuencia: frecuencia,
                    lugarTrabajo: lugarTrabajo,
                    anio: anio, 
                    mes: mes,
                    pagadora: pagadora
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
        getInfoNominasXPagadora: function(paga, frecuencia, lugarTrabajo, anio, mes, pagadora, origen) {
            return $http({
                url: polizasURL + 'InfoNominaxPagadora/',
                method: "GET",
                params: {
                    paga: paga,
                    frecuencia: frecuencia,
                    lugarTrabajo: lugarTrabajo,
                    anio: anio, 
                    mes: mes,
                    pagadora: pagadora,
                    origen: origen
                },
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }, 
    };
});
