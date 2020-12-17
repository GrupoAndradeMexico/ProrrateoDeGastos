registrationModule.controller('loginController', function ($scope, $rootScope, $location, loginRepository, alertFactory, localStorageService) {


    $scope.init = function () {
        $rootScope.mostrarMenu = 0;
        localStorageService.clearAll('userData');
        localStorageService.clearAll('empleadoDatos');
        localStorageService.clearAll('lgnUser');
        localStorage.removeItem('paramBusqueda');
        if (!($('#lgnUser').val().indexOf('[') > -1)) {
            localStorageService.set('lgnUser', $('#lgnUser').val());
            $scope.permisos($rootScope.currentEmployee);
            $scope.getEmpleado($rootScope.currentEmployee);
        } else {
            if (($('#lgnUser').val().indexOf('[') > -1) && !localStorageService.get('lgnUser')) {
                if (getParameterByName('employee') != '') {
                    $rootScope.currentEmployee = getParameterByName('employee');
                } else {
                    alertFactory.infoTopFull('Inicie sesión desde panel de aplicaciones o desde el login.');
                }

            }
        }
        $rootScope.currentEmployee = localStorageService.get('lgnUser');
        $scope.permisos($rootScope.currentEmployee);
        $scope.getEmpleado($rootScope.currentEmployee);
    }

    // *************************** Función para logueo de portal *****************
    $scope.permisos = function (usuario) {
        loginRepository.getPermisos(usuario).then(function (result) {
            localStorage.setItem('ShowBtns', JSON.stringify(result.data[1]));
            if (result.data[1][0].Consulta == 1) {
                $scope.login = result.data[0][0];
                $scope.getEmpleado(usuario);
                $rootScope.polizaNominaAcceso = 1;
                $rootScope.conciliacionAccesso = 0;
                alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                location.href = '/conciliacionInicioConsulta';
                localStorageService.set('userData', $scope.login);
            } else if (result.data[1][0].AsignaFormaPago == 1) {
                $scope.login = result.data[0][0];
                $scope.getEmpleado(usuario);
                $rootScope.polizaNominaAcceso = 1;
                $rootScope.conciliacionAccesso = 0;
                alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                location.href = '/formaPago';
                localStorageService.set('userData', $scope.login);
            } else if(result.data[1][0].NoProcesados == 1){
                $scope.login = result.data[0][0];
                $scope.getEmpleado(usuario);
                $rootScope.polizaNominaAcceso = 1;
                $rootScope.conciliacionAccesso = 0;
                alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                // location.href = '/formaPago';
                localStorageService.set('userData', $scope.login);
            }else {
                if (result.data.length > 0) {
                    $scope.login = result.data[0][0];
                    $scope.getEmpleado(usuario);
                    if ($scope.login.idPerfil == 4) {
                        $rootScope.polizaNominaAcceso = 1;
                        $rootScope.conciliacionAccesso = 0;
                        alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                        location.href = '/conciliacionInicio';
                        localStorageService.set('userData', $scope.login);
                    } else {
                        if ($scope.login.idPerfil == 5) {
                            $rootScope.polizaNominaAcceso = 1;
                            $rootScope.conciliacionAccesso = 1;
                            alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                            location.href = '/polizaNomina';
                            localStorageService.set('userData', $scope.login);
                        } else {
                            $rootScope.polizaNominaAcceso = 0;
                            $rootScope.conciliacionAccesso = 1;
                            alertFactory.warning('Bienvenido a Tesorería: ' + result.data[0][0].nombreUsuario);
                            location.href = '/polizaNomina';
                            localStorageService.set('userData', $scope.login);

                        }
                    }

                } else {
                    alertFactory.info('Valide el usuario y/o contraseña');
                }
            }

        });
    }

    $scope.getEmpleado = function (usuario) {
        loginRepository.getEmpleado(usuario).then(function (empleado) {
            if (empleado.data.length > 0) {
                $scope.empleadoDatos = empleado.data;
                localStorageService.set('empleadoDatos', $scope.empleadoDatos);
            } else {

            }
        })
    }
});
