registrationModule.controller('mainController', function ($scope, $rootScope, $location, localStorageService, alertFactory) {

    $rootScope.userData = localStorageService.get('userData');


    $scope.init = function () {
        $rootScope.datosUsuario = localStorageService.get('empleadoDatos');
      
        if($rootScope.datosUsuario != null || $rootScope.datosUsuario != undefined)
        {
        $rootScope.mostrarMenu = 1;
        $rootScope.polizaNominaAcceso = 1;
        $rootScope.conciliacionAccesso = 1;
        }
        else
        {
            localStorageService.clearAll('userData');
            localStorageService.clearAll('empleadoDatos');
            localStorageService.clearAll('lgnUser');
            localStorage.removeItem('paramBusqueda');
        
            alertFactory.infoTopFull('No cuenta con el acceso a esta aplicación');

        }



    
    }

    // ************** NOTA se limpian todos los localStorage utilizados
    $scope.salir = function () {
        alertFactory.warning('Hasta luego ' + $rootScope.userData.nombreUsuario)
        localStorageService.clearAll('userData');
        localStorageService.clearAll('empleadoDatos');
        localStorageService.clearAll('lgnUser');
        localStorage.removeItem('paramBusqueda');

        location.href = '/';
    }
});
